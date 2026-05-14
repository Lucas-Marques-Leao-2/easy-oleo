"use client";

import { ListSection, PageShell } from "@/components/layout/page-layout";
import { useApiAuth } from "@/hooks/use-api-auth";
import { apiErrorMessage } from "@/lib/api-error-message";
import {
	getProductsControllerFindAllQueryKey,
	useProductsControllerCreate,
	useProductsControllerFindAll,
	useProductsControllerRemove,
} from "@/openapi/client/products/products";
import type { CreateProductDto } from "@/openapi/client/models/createProductDto";
import {
	Button,
	Group,
	Modal,
	NumberInput,
	SimpleGrid,
	Stack,
	TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function isOilLubricantType(type: string): boolean {
	const t = type.trim().toLowerCase();
	return t === "óleo" || t === "oleo";
}

export default function ProductsPage() {
	const queryClient = useQueryClient();
	const auth = useApiAuth();

	const [opened, setOpened] = useState(false);
	const [code, setCode] = useState("");
	const [name, setName] = useState("");
	const [brand, setBrand] = useState("");
	const [type, setType] = useState("");
	const [viscosity, setViscosity] = useState("");
	const [unit, setUnit] = useState("L");
	const [salePrice, setSalePrice] = useState<number | string>("");
	const [stockQuantity, setStockQuantity] = useState<number | string>("");
	const [minStock, setMinStock] = useState<number | string>("");

	const showViscosity = isOilLubricantType(type);

	const {
		data: rows = [],
		isPending,
		isError,
		error,
		refetch,
	} = useProductsControllerFindAll({
		query: { retry: false },
		request: auth,
	});

	const create = useProductsControllerCreate({
		mutation: {
			onSuccess: () => {
				void queryClient.invalidateQueries({ queryKey: getProductsControllerFindAllQueryKey() });
				setCode("");
				setName("");
				setBrand("");
				setType("");
				setViscosity("");
				setUnit("L");
				setSalePrice("");
				setStockQuantity("");
				setMinStock("");
				setOpened(false);
				notifications.show({ color: "teal", title: "Produto", message: "Cadastro realizado." });
			},
			onError: err => {
				notifications.show({ color: "red", title: "Erro", message: apiErrorMessage(err) });
			},
		},
		request: auth,
	});

	const remove = useProductsControllerRemove({
		mutation: {
			onSuccess: () => {
				void queryClient.invalidateQueries({ queryKey: getProductsControllerFindAllQueryKey() });
			},
			onError: err => {
				notifications.show({ color: "red", title: "Erro", message: apiErrorMessage(err) });
			},
		},
		request: auth,
	});

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!code.trim() || !name.trim()) return;
		const price = typeof salePrice === "number" ? salePrice : Number(salePrice);
		const stock = typeof stockQuantity === "number" ? stockQuantity : Number(stockQuantity);
		const min = typeof minStock === "number" ? minStock : Number(minStock);
		const dto: CreateProductDto = {
			code: code.trim(),
			name: name.trim(),
			brand: brand.trim() || "—",
			type: type.trim() || "—",
			unit: unit.trim() || "un",
			salePrice: Number.isFinite(price) ? price : 0,
			stockQuantity: Number.isFinite(stock) ? stock : 0,
			minStock: Number.isFinite(min) ? min : 0,
		};
		if (showViscosity && viscosity.trim()) {
			dto.viscosity = viscosity.trim();
		}
		await create.mutateAsync({ data: dto });
	}

	return (
		<PageShell title="Produtos">
			<ListSection
				title="Lista"
				headingId="produtos-lista"
				actions={
					<Button onClick={() => setOpened(true)}>
						Adicionar
					</Button>
				}
			>
				{isPending && (
					<p className="text-sm text-typography-lv2 dark:text-slate-400">Carregando…</p>
				)}
				{isError && (
					<p className="text-sm text-red-600 dark:text-red-400" role="alert">
						{apiErrorMessage(error)}{" "}
						<Button variant="subtle" size="compact-sm" onClick={() => void refetch()}>
							Tentar de novo
						</Button>
					</p>
				)}
				{!isPending && !isError && (
					<div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
						<table className="w-full min-w-[720px] border-collapse text-sm">
							<thead>
								<tr>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Código
									</th>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Nome
									</th>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Marca
									</th>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Tipo
									</th>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Visc.
									</th>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Un.
									</th>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Preço
									</th>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Estoque
									</th>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Mín.
									</th>
									<th
										className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
										aria-label="Ações"
									/>
								</tr>
							</thead>
							<tbody>
								{rows.map(p => (
									<tr
										key={p.id}
										className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
									>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{p.code}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{p.name}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{p.brand}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{p.type}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{p.viscosity?.trim() ? p.viscosity : "—"}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{p.unit}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{p.salePrice.toFixed(2)}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{p.stockQuantity}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{p.minStock}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											<Button
												type="button"
												variant="light"
												color="red"
												size="xs"
												loading={remove.isPending}
												onClick={() => void remove.mutateAsync({ id: p.id })}
											>
												Remover
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				<Modal opened={opened} onClose={() => setOpened(false)} title="Novo produto" centered size="xl">
					<form onSubmit={e => void handleSubmit(e)}>
						<Stack gap="sm">
							<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
								<TextInput label="Código" required value={code} onChange={e => setCode(e.currentTarget.value)} />
								<TextInput label="Nome" required value={name} onChange={e => setName(e.currentTarget.value)} />
								<TextInput label="Marca" value={brand} onChange={e => setBrand(e.currentTarget.value)} />
								<TextInput
									label="Tipo"
									value={type}
									onChange={e => setType(e.currentTarget.value)}
								/>
								{showViscosity && (
									<TextInput
										label="Viscosidade"
										value={viscosity}
										onChange={e => setViscosity(e.currentTarget.value)}
									/>
								)}
								<TextInput label="Unidade" value={unit} onChange={e => setUnit(e.currentTarget.value)} />
								<NumberInput
									label="Preço venda"
									value={salePrice}
									onChange={setSalePrice}
									min={0}
									decimalScale={2}
									fixedDecimalScale
									thousandSeparator="."
									decimalSeparator=","
								/>
								<NumberInput
									label="Quantidade em estoque"
									value={stockQuantity}
									onChange={setStockQuantity}
									min={0}
									decimalScale={0}
								/>
								<NumberInput
									label="Estoque mín."
									value={minStock}
									onChange={setMinStock}
									min={0}
									decimalScale={0}
								/>
							</SimpleGrid>
							<Group justify="flex-end">
								<Button type="submit" loading={create.isPending}>
									Adicionar
								</Button>
							</Group>
						</Stack>
					</form>
				</Modal>
			</ListSection>
		</PageShell>
	);
}
