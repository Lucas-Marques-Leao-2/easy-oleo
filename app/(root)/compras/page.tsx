"use client";

import { ListSection, PageShell } from "@/components/layout/page-layout";
import { MantinePurchaseOrdersTableSkeleton } from "@/components/loading/list-table-skeleton";
import { useUser } from "@/components/context/user-provider";
import { useApiAuth } from "@/hooks/use-api-auth";
import { apiErrorMessage } from "@/lib/api-error-message";
import {
	formatIsoDatePtBr,
	parseIsoDateToLocalDate,
	todayIsoDateLocal,
} from "@/lib/formatters/format-date";
import type { CreatePurchaseOrderDtoItemsItem } from "@/openapi/client/models/createPurchaseOrderDtoItemsItem";
import {
	getPurchaseOrdersControllerFindAllQueryKey,
	usePurchaseOrdersControllerCreate,
	usePurchaseOrdersControllerFindAll,
	usePurchaseOrdersControllerRemove,
} from "@/openapi/client/purchase-orders/purchase-orders";
import { useProductsControllerFindAll } from "@/openapi/client/products/products";
import { useSuppliersControllerFindAll } from "@/openapi/client/suppliers/suppliers";
import { useUsersControllerFindAll } from "@/openapi/client/users/users";
import {
	Button,
	Divider,
	Group,
	Modal,
	NumberInput,
	Select,
	SimpleGrid,
	Stack,
	Table,
	Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

export default function PurchasesPage() {
	const queryClient = useQueryClient();
	const auth = useApiAuth();
	const { user: meUser } = useUser();

	const [opened, setOpened] = useState(false);
	const [purchaseDate, setPurchaseDate] = useState<string | null>(null);
	const [supplierId, setSupplierId] = useState<string | null>(null);
	const [registeredByUserId, setRegisteredByUserId] = useState<string | null>(null);
	const [draftProductId, setDraftProductId] = useState<string | null>(null);
	const [draftQuantity, setDraftQuantity] = useState<number | string>(1);
	const [draftUnitCost, setDraftUnitCost] = useState<number | string>("");
	const [lineItems, setLineItems] = useState<CreatePurchaseOrderDtoItemsItem[]>([]);

	const {
		data: orders = [],
		isPending: ordersLoading,
		isError: ordersError,
		error: ordersErrorObj,
		refetch: refetchOrders,
	} = usePurchaseOrdersControllerFindAll({
		query: { retry: false },
		request: auth,
	});

	const {
		data: suppliers = [],
		isPending: suppliersLoading,
		isError: suppliersError,
		error: suppliersErrorObj,
	} = useSuppliersControllerFindAll({
		query: { retry: false },
		request: auth,
	});

	const {
		data: products = [],
		isPending: productsLoading,
		isError: productsError,
		error: productsErrorObj,
	} = useProductsControllerFindAll({
		query: { retry: false },
		request: auth,
	});

	const {
		data: users = [],
		isPending: usersLoading,
		isError: usersError,
		error: usersErrorObj,
	} = useUsersControllerFindAll({
		query: { retry: false },
		request: auth,
	});

	useEffect(() => {
		if (meUser?.id) {
			setRegisteredByUserId(meUser.id);
		}
	}, [meUser?.id]);

	useEffect(() => {
		if (!meUser?.id && users.length > 0 && registeredByUserId === null) {
			setRegisteredByUserId(users[0].id);
		}
	}, [meUser?.id, users, registeredByUserId]);

	const supplierSelectData = useMemo(
		() => suppliers.map(s => ({ value: s.id, label: s.legalName })),
		[suppliers],
	);

	const productSelectData = useMemo(
		() => products.map(p => ({ value: p.id, label: `${p.code} — ${p.name}` })),
		[products],
	);

	const userSelectData = useMemo(
		() => users.map(u => ({ value: u.id, label: `${u.name} (${u.email})` })),
		[users],
	);

	const invalidateList = () => {
		void queryClient.invalidateQueries({
			queryKey: getPurchaseOrdersControllerFindAllQueryKey(),
		});
	};

	const createOrder = usePurchaseOrdersControllerCreate({
		mutation: {
			onSuccess: () => {
				invalidateList();
				setPurchaseDate(null);
				setSupplierId(null);
				setLineItems([]);
				setDraftProductId(null);
				setDraftQuantity(1);
				setDraftUnitCost("");
				setOpened(false);
				notifications.show({
					color: "teal",
					title: "Compra",
					message: "Pedido de compra registrado.",
				});
			},
			onError: err => {
				notifications.show({
					color: "red",
					title: "Erro",
					message: apiErrorMessage(err),
				});
			},
		},
		request: auth,
	});

	const removeOrder = usePurchaseOrdersControllerRemove({
		mutation: {
			onSuccess: () => {
				invalidateList();
				notifications.show({
					color: "teal",
					title: "Compra",
					message: "Pedido removido e estoque estornado.",
				});
			},
			onError: err => {
				notifications.show({
					color: "red",
					title: "Erro",
					message: apiErrorMessage(err),
				});
			},
		},
		request: auth,
	});

	function addLineItem() {
		if (!draftProductId) return;
		const qty = typeof draftQuantity === "number" ? draftQuantity : Number(draftQuantity);
		const cost = typeof draftUnitCost === "number" ? draftUnitCost : Number(draftUnitCost);
		if (!Number.isFinite(qty) || qty <= 0) return;
		if (!Number.isFinite(cost) || cost < 0) return;

		setLineItems(prev => {
			const idx = prev.findIndex(i => i.productId === draftProductId);
			if (idx >= 0) {
				const next = [...prev];
				const prevQty = Number(next[idx].quantity);
				next[idx] = {
					...next[idx],
					quantity: prevQty + qty,
					unitCost: cost,
				};
				return next;
			}
			return [...prev, { productId: draftProductId, quantity: qty, unitCost: cost }];
		});
		setDraftQuantity(1);
		setDraftUnitCost("");
	}

	function removeLineItem(productId: string) {
		setLineItems(prev => prev.filter(i => i.productId !== productId));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!supplierId || !registeredByUserId) {
			notifications.show({
				color: "yellow",
				title: "Compra",
				message: "Selecione fornecedor e quem registra o pedido.",
			});
			return;
		}
		if (lineItems.length === 0) {
			notifications.show({
				color: "yellow",
				title: "Compra",
				message: "Inclua pelo menos um item (produto, quantidade e custo unitário).",
			});
			return;
		}

		await createOrder.mutateAsync({
			data: {
				supplierId,
				registeredByUserId,
				items: lineItems.map(i => ({
					productId: i.productId,
					quantity: i.quantity,
					unitCost: i.unitCost ?? 0,
				})),
				purchaseDate: purchaseDate ? `${purchaseDate}T12:00:00.000Z` : undefined,
			},
		});
	}

	const listError =
		ordersError && ordersErrorObj ? apiErrorMessage(ordersErrorObj) : null;

	return (
		<PageShell title="Compras (reposição)">
			<ListSection
				title="Lista"
				headingId="compras-lista"
				actions={
					<Button onClick={() => setOpened(true)}>
						Adicionar
					</Button>
				}
			>
				{ordersLoading && <MantinePurchaseOrdersTableSkeleton />}

				{listError && (
					<Text size="sm" c="red" role="alert">
						{listError}{" "}
						<Button variant="subtle" size="compact-sm" onClick={() => void refetchOrders()}>
							Tentar de novo
						</Button>
					</Text>
				)}

				{!ordersLoading && !listError && (
					<Table.ScrollContainer minWidth={640}>
						<Table striped highlightOnHover withTableBorder>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Data</Table.Th>
									<Table.Th>Fornecedor</Table.Th>
									<Table.Th>Registrado por</Table.Th>
									<Table.Th style={{ textAlign: "right" }}>Total</Table.Th>
									<Table.Th w={120} />
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{orders.map(o => (
									<Table.Tr key={o.id}>
										<Table.Td>
											{dayjs(o.purchaseDate).isValid()
												? dayjs(o.purchaseDate).format("DD/MM/YYYY")
												: formatIsoDatePtBr(String(o.purchaseDate).slice(0, 10))}
										</Table.Td>
										<Table.Td>{o.supplier.name}</Table.Td>
										<Table.Td>{o.registeredBy.name}</Table.Td>
										<Table.Td style={{ textAlign: "right" }}>{o.total.toFixed(2)}</Table.Td>
										<Table.Td>
											<Button
												type="button"
												variant="light"
												color="red"
												size="xs"
												loading={removeOrder.isPending}
												onClick={() => void removeOrder.mutateAsync({ id: o.id })}
											>
												Remover
											</Button>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</Table.ScrollContainer>
				)}

				<Modal opened={opened} onClose={() => setOpened(false)} title="Nova compra" centered size="xl">
					<form onSubmit={e => void handleSubmit(e)}>
						<Stack gap="sm">
							<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
								<DatePickerInput
									label="Data"
									placeholder="DD/MM/AAAA"
									value={purchaseDate ? parseIsoDateToLocalDate(purchaseDate) : null}
									onChange={v => setPurchaseDate(v ? dayjs(v).format("YYYY-MM-DD") : null)}
									valueFormat="DD/MM/YYYY"
									clearable
								/>
								<Select
									label="Fornecedor"
									placeholder={
										suppliersLoading
											? "Carregando…"
											: supplierSelectData.length === 0
												? "Nenhum fornecedor"
												: "Selecione"
									}
									data={supplierSelectData}
									value={supplierId}
									onChange={setSupplierId}
									searchable
									clearable
									nothingFoundMessage="Nenhum fornecedor encontrado."
									disabled={
										suppliersLoading || suppliersError || supplierSelectData.length === 0
									}
									required
									error={
										suppliersError && suppliersErrorObj
											? apiErrorMessage(suppliersErrorObj)
											: undefined
									}
								/>
								<Select
									label="Registrado por"
									placeholder={
										usersLoading
											? "Carregando…"
											: userSelectData.length === 0
												? "Nenhum usuário"
												: "Selecione"
									}
									data={userSelectData}
									value={registeredByUserId}
									onChange={setRegisteredByUserId}
									searchable
									clearable
									nothingFoundMessage="Nenhum usuário encontrado."
									disabled={usersLoading || usersError || userSelectData.length === 0}
									required
									error={
										usersError && usersErrorObj ? apiErrorMessage(usersErrorObj) : undefined
									}
								/>
							</SimpleGrid>

							<Divider label="Itens" labelPosition="center" />

							<SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
								<Select
									label="Produto"
									placeholder={
										productsLoading
											? "Carregando…"
											: productSelectData.length === 0
												? "Nenhum produto"
												: "Selecione"
									}
									data={productSelectData}
									value={draftProductId}
									onChange={setDraftProductId}
									searchable
									clearable
									nothingFoundMessage="Nenhum produto encontrado."
									disabled={productsLoading || productsError || productSelectData.length === 0}
									error={
										productsError && productsErrorObj
											? apiErrorMessage(productsErrorObj)
											: undefined
									}
								/>
								<NumberInput
									label="Quantidade"
									value={draftQuantity}
									onChange={setDraftQuantity}
									min={0.0001}
									decimalScale={3}
								/>
								<NumberInput
									label="Custo unitário"
									value={draftUnitCost}
									onChange={setDraftUnitCost}
									min={0}
									decimalScale={2}
									fixedDecimalScale
									thousandSeparator="."
									decimalSeparator=","
								/>
							</SimpleGrid>
							<Group justify="flex-start">
								<Button type="button" variant="light" onClick={addLineItem}>
									Incluir item
								</Button>
							</Group>

							{lineItems.length > 0 && (
								<Table.ScrollContainer minWidth={400}>
									<Table striped withTableBorder>
										<Table.Thead>
											<Table.Tr>
												<Table.Th>Produto</Table.Th>
												<Table.Th style={{ textAlign: "right" }}>Qtd</Table.Th>
												<Table.Th style={{ textAlign: "right" }}>Custo un.</Table.Th>
												<Table.Th w={100} />
											</Table.Tr>
										</Table.Thead>
										<Table.Tbody>
											{lineItems.map(li => {
												const p = products.find(x => x.id === li.productId);
												const label = p ? `${p.code} — ${p.name}` : li.productId;
												const uc = li.unitCost ?? 0;
												return (
													<Table.Tr key={li.productId}>
														<Table.Td>{label}</Table.Td>
														<Table.Td style={{ textAlign: "right" }}>{li.quantity}</Table.Td>
														<Table.Td style={{ textAlign: "right" }}>
															{Number(uc).toFixed(2)}
														</Table.Td>
														<Table.Td>
															<Button
																type="button"
																variant="subtle"
																color="red"
																size="compact-xs"
																onClick={() => removeLineItem(li.productId)}
															>
																Remover
															</Button>
														</Table.Td>
													</Table.Tr>
												);
											})}
										</Table.Tbody>
									</Table>
								</Table.ScrollContainer>
							)}

							<Text size="xs" c="dimmed">
								Data em branco usa hoje ({formatIsoDatePtBr(todayIsoDateLocal())}).
							</Text>

							<Group justify="flex-end">
								<Button type="submit" loading={createOrder.isPending}>
									Registrar compra
								</Button>
							</Group>
						</Stack>
					</form>
				</Modal>
			</ListSection>
		</PageShell>
	);
}
