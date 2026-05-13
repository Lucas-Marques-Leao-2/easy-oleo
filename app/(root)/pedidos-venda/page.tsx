"use client";

import { ListSection, PageShell, SectionCard } from "@/components/layout/page-layout";
import { apiErrorMessage } from "@/lib/api-error-message";
import { parseIsoDateToLocalDate, todayIsoDateLocal } from "@/lib/formatters/format-date";
import { useCustomersControllerFindAll } from "@/openapi/client/customers/customers";
import { useProductsControllerFindAll } from "@/openapi/client/products/products";
import {
	getSaleOrdersControllerFindAllQueryKey,
	useSaleOrdersControllerConfirm,
	useSaleOrdersControllerCreate,
	useSaleOrdersControllerFindAll,
	useSaleOrdersControllerRemove,
} from "@/openapi/client/sale-orders/sale-orders";
import type { CreateSaleOrderDtoItemsItem } from "@/openapi/client/models/createSaleOrderDtoItemsItem";
import type { SaleOrderResponseStatus } from "@/openapi/client/models/saleOrderResponseStatus";
import { useUsersControllerFindAll } from "@/openapi/client/users/users";
import {
	Button,
	Divider,
	Group,
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

const STATUS_LABELS_PT: Record<SaleOrderResponseStatus, string> = {
	DRAFT: "Rascunho",
	CONFIRMED: "Confirmado",
	CANCELLED: "Cancelado",
};

export default function SalesOrdersPage() {
	const queryClient = useQueryClient();
	const [orderDate, setOrderDate] = useState<string | null>(null);
	const [customerId, setCustomerId] = useState<string | null>(null);
	const [createdByUserId, setCreatedByUserId] = useState<string | null>(null);
	const [draftProductId, setDraftProductId] = useState<string | null>(null);
	const [draftQuantity, setDraftQuantity] = useState<number | string>(1);
	const [lineItems, setLineItems] = useState<CreateSaleOrderDtoItemsItem[]>([]);

	const {
		data: orders = [],
		isPending: ordersLoading,
		isError: ordersError,
		error: ordersErrorObj,
		refetch: refetchOrders,
	} = useSaleOrdersControllerFindAll();

	const {
		data: customers = [],
		isPending: customersLoading,
		isError: customersError,
		error: customersErrorObj,
	} = useCustomersControllerFindAll();

	const {
		data: products = [],
		isPending: productsLoading,
		isError: productsError,
		error: productsErrorObj,
	} = useProductsControllerFindAll();

	const {
		data: users = [],
		isPending: usersLoading,
		isError: usersError,
		error: usersErrorObj,
	} = useUsersControllerFindAll();

	useEffect(() => {
		if (users.length > 0 && createdByUserId === null) {
			setCreatedByUserId(users[0].id);
		}
	}, [users, createdByUserId]);

	const customerSelectData = useMemo(
		() =>
			customers.map(c => ({
				value: c.id,
				label: c.name,
			})),
		[customers],
	);

	const productSelectData = useMemo(
		() =>
			products.map(p => ({
				value: p.id,
				label: `${p.code} — ${p.name}`,
			})),
		[products],
	);

	const userSelectData = useMemo(
		() =>
			users.map(u => ({
				value: u.id,
				label: `${u.name} (${u.email})`,
			})),
		[users],
	);

	const invalidateList = () => {
		void queryClient.invalidateQueries({
			queryKey: getSaleOrdersControllerFindAllQueryKey(),
		});
	};

	const createOrder = useSaleOrdersControllerCreate({
		mutation: {
			onSuccess: () => {
				invalidateList();
				setOrderDate(null);
				setCustomerId(null);
				setLineItems([]);
				setDraftProductId(null);
				setDraftQuantity(1);
				notifications.show({
					color: "teal",
					title: "Pedido",
					message: "Pedido de venda registrado.",
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
	});

	const removeOrder = useSaleOrdersControllerRemove({
		mutation: {
			onSuccess: () => {
				invalidateList();
				notifications.show({ color: "teal", title: "Pedido", message: "Pedido removido." });
			},
			onError: err => {
				notifications.show({
					color: "red",
					title: "Erro",
					message: apiErrorMessage(err),
				});
			},
		},
	});

	const confirmOrder = useSaleOrdersControllerConfirm({
		mutation: {
			onSuccess: () => {
				invalidateList();
				notifications.show({ color: "teal", title: "Pedido", message: "Pedido confirmado." });
			},
			onError: err => {
				notifications.show({
					color: "red",
					title: "Erro",
					message: apiErrorMessage(err),
				});
			},
		},
	});

	function addLineItem() {
		if (!draftProductId) return;
		const qty = typeof draftQuantity === "number" ? draftQuantity : Number(draftQuantity);
		if (!Number.isFinite(qty) || qty <= 0) return;

		setLineItems(prev => {
			const idx = prev.findIndex(i => i.productId === draftProductId);
			if (idx >= 0) {
				const next = [...prev];
				next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
				return next;
			}
			return [...prev, { productId: draftProductId, quantity: qty }];
		});
		setDraftQuantity(1);
	}

	function removeLineItem(productId: string) {
		setLineItems(prev => prev.filter(i => i.productId !== productId));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!customerId || !createdByUserId) {
			notifications.show({
				color: "yellow",
				title: "Pedido",
				message: "Selecione cliente e quem registra o pedido.",
			});
			return;
		}
		if (lineItems.length === 0) {
			notifications.show({
				color: "yellow",
				title: "Pedido",
				message: "Inclua pelo menos um item (produto e quantidade).",
			});
			return;
		}

		await createOrder.mutateAsync({
			data: {
				customerId,
				createdByUserId,
				items: lineItems,
				orderDate: orderDate ? `${orderDate}T12:00:00.000Z` : null,
			},
		});
	}

	function formatOrderDate(iso: string): string {
		const d = dayjs(iso);
		return d.isValid() ? d.format("DD/MM/YYYY") : iso;
	}

	const listError =
		ordersError && ordersErrorObj ? apiErrorMessage(ordersErrorObj) : null;

	return (
		<PageShell
			title="Pedidos de venda"
			description="POST /sale-orders com cliente, usuário que registra, data opcional e itens (produto + quantidade). Lista via GET /sale-orders."
		>
			<SectionCard
				title="Novo"
				titleId="pedidos-venda-novo"
			>
				<form onSubmit={e => void handleSubmit(e)}>
					<Stack gap="md">
						<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
							<DatePickerInput
								label="Data do pedido"
								placeholder="DD/MM/AAAA"
								value={orderDate ? parseIsoDateToLocalDate(orderDate) : null}
								onChange={v =>
									setOrderDate(v ? dayjs(v).format("YYYY-MM-DD") : null)
								}
								valueFormat="DD/MM/YYYY"
								clearable
							/>
							<Select
								label="Cliente"
								placeholder={
									customersLoading
										? "Carregando…"
										: customerSelectData.length === 0
											? "Nenhum cliente"
											: "Selecione"
								}
								data={customerSelectData}
								value={customerId}
								onChange={setCustomerId}
								searchable
								clearable
								nothingFoundMessage="Nenhum cliente encontrado."
								disabled={customersLoading || customersError || customerSelectData.length === 0}
								required
								error={
									customersError && customersErrorObj
										? apiErrorMessage(customersErrorObj)
										: undefined
								}
							/>
							<Select
								label="Registrado por"
								description="Usuário vinculado ao pedido (createdBy), até haver login na sessão."
								placeholder={
									usersLoading
										? "Carregando…"
										: userSelectData.length === 0
											? "Nenhum usuário"
											: "Selecione"
								}
								data={userSelectData}
								value={createdByUserId}
								onChange={setCreatedByUserId}
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

						<div>
							<Text
								size="sm"
								fw={500}
								mb="xs"
							>
								Itens
							</Text>
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
									min={1}
									decimalScale={0}
								/>
								<Group
									align="flex-end"
									wrap="nowrap"
								>
									<Button
										type="button"
										variant="light"
										onClick={addLineItem}
										disabled={!draftProductId}
									>
										Adicionar item
									</Button>
								</Group>
							</SimpleGrid>
						</div>

						{lineItems.length > 0 && (
							<>
								<Divider label="Itens do pedido" />
								<Table striped highlightOnHover withTableBorder>
									<Table.Thead>
										<Table.Tr>
											<Table.Th>Produto</Table.Th>
											<Table.Th style={{ width: 120 }}>Qtd.</Table.Th>
											<Table.Th style={{ width: 100 }} />
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>
										{lineItems.map(row => {
											const p = products.find(pr => pr.id === row.productId);
											const label = p ? `${p.code} — ${p.name}` : row.productId;
											return (
												<Table.Tr key={row.productId}>
													<Table.Td>{label}</Table.Td>
													<Table.Td>{row.quantity}</Table.Td>
													<Table.Td>
														<Button
															type="button"
															variant="subtle"
															color="red"
															size="xs"
															onClick={() => removeLineItem(row.productId)}
														>
															Remover
														</Button>
													</Table.Td>
												</Table.Tr>
											);
										})}
									</Table.Tbody>
								</Table>
							</>
						)}

						<Group justify="flex-end">
							<Button
								type="submit"
								loading={createOrder.isPending}
							>
								Criar pedido
							</Button>
						</Group>
					</Stack>
				</form>
			</SectionCard>

			<ListSection
				title="Lista"
				headingId="pedidos-venda-lista"
			>
				{ordersLoading && (
					<Text
						size="sm"
						c="dimmed"
					>
						Carregando pedidos…
					</Text>
				)}
				{listError && (
					<Text
						size="sm"
						c="red"
						role="alert"
					>
						{listError}{" "}
						<Button
							variant="subtle"
							size="compact-sm"
							onClick={() => void refetchOrders()}
						>
							Tentar de novo
						</Button>
					</Text>
				)}
				{!ordersLoading && !listError && orders.length === 0 && (
					<Text
						size="sm"
						c="dimmed"
					>
						Nenhum pedido cadastrado.
					</Text>
				)}
				{!ordersLoading && !listError && orders.length > 0 && (
					<div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
						<table className="w-full min-w-[720px] border-collapse text-sm">
							<thead>
								<tr>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Data
									</th>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Cliente
									</th>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Total
									</th>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Status
									</th>
									<th
										className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
										aria-label="Ações"
									/>
								</tr>
							</thead>
							<tbody>
								{orders.map(row => (
									<tr
										key={row.id}
										className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
									>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{formatOrderDate(row.orderDate)}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{row.customer.name}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{row.total.toFixed(2)}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{STATUS_LABELS_PT[row.status]}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											<Group gap="xs">
												{row.status === "DRAFT" && (
													<>
														<Button
															type="button"
															variant="light"
															color="teal"
															size="xs"
															loading={confirmOrder.isPending}
															onClick={() => void confirmOrder.mutateAsync({ id: row.id })}
														>
															Confirmar
														</Button>
														<Button
															type="button"
															variant="light"
															color="red"
															size="xs"
															loading={removeOrder.isPending}
															onClick={() => void removeOrder.mutateAsync({ id: row.id })}
														>
															Remover
														</Button>
													</>
												)}
											</Group>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</ListSection>
		</PageShell>
	);
}
