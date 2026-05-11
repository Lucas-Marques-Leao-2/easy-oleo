"use client";

import { ListSection, PageShell, SectionCard } from "@/components/layout/page-layout";
import { Button, Group, NumberInput, SimpleGrid, Stack, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useState } from "react";

import { formatIsoDatePtBr, parseIsoDateToLocalDate, todayIsoDateLocal } from "@/lib/formatters/format-date";

type Row = {
	id: string;
	purchaseDate: string;
	supplierName: string;
	total: number;
	note: string;
};

const SEED: Row[] = [
	{
		id: "seed-po1",
		purchaseDate: "2026-04-10",
		supplierName: "Distribuidora Lubrificantes Nordeste",
		total: 1560,
		note: "Reposição óleo 5W30",
	},
];

export default function PurchasesPage() {
	const [rows, setRows] = useState<Row[]>(SEED);
	const [purchaseDate, setPurchaseDate] = useState<string | null>(null);
	const [supplierName, setSupplierName] = useState("");
	const [total, setTotal] = useState<number | string>("");
	const [note, setNote] = useState("");

	function add(e: React.FormEvent) {
		e.preventDefault();
		if (!supplierName.trim()) return;
		const t = typeof total === "number" ? total : Number(total);
		setRows(r => [
			...r,
			{
				id: crypto.randomUUID(),
				purchaseDate: purchaseDate || todayIsoDateLocal(),
				supplierName: supplierName.trim(),
				total: Number.isFinite(t) ? t : 0,
				note: note.trim() || "—",
			},
		]);
		setPurchaseDate(null);
		setSupplierName("");
		setTotal("");
		setNote("");
	}

	function remove(id: string) {
		setRows(r => r.filter(x => x.id !== id));
	}

	return (
		<PageShell
			title="Compras (reposição)"
			description="Demonstração em memória; fluxo real usará API de pedidos de compra."
		>
			<SectionCard
				title="Novo"
				titleId="compras-novo"
			>
				<form
					onSubmit={add}
				>
					<Stack gap="sm">
						<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
							<DatePickerInput
								label="Data"
								placeholder="DD/MM/AAAA"
								value={purchaseDate ? parseIsoDateToLocalDate(purchaseDate) : null}
								onChange={v =>
									setPurchaseDate(v ? dayjs(v).format("YYYY-MM-DD") : null)
								}
								valueFormat="DD/MM/YYYY"
								clearable
							/>
							<TextInput
								label="Fornecedor (texto)"
								value={supplierName}
								onChange={e => setSupplierName(e.currentTarget.value)}
								required
							/>
						</SimpleGrid>
						<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
							<NumberInput
								label="Total"
								value={total}
								onChange={setTotal}
								decimalScale={2}
								fixedDecimalScale
								min={0}
								thousandSeparator="."
								decimalSeparator=","
							/>
							<TextInput
								label="Obs."
								value={note}
								onChange={e => setNote(e.currentTarget.value)}
							/>
						</SimpleGrid>
						<Group justify="flex-end">
							<Button type="submit">Adicionar</Button>
						</Group>
					</Stack>
				</form>
			</SectionCard>

			<ListSection
				title="Lista"
				headingId="compras-lista"
			>
				<div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
					<table className="w-full min-w-[560px] border-collapse text-sm">
						<thead>
							<tr>
								<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
									Data
								</th>
								<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
									Fornecedor
								</th>
								<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
									Total
								</th>
								<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
									Obs.
								</th>
								<th
									className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
									aria-label="Ações"
								/>
							</tr>
						</thead>
						<tbody>
							{rows.map(o => (
								<tr
									key={o.id}
									className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
								>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
										{formatIsoDatePtBr(o.purchaseDate)}
									</td>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
										{o.supplierName}
									</td>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
										{o.total.toFixed(2)}
									</td>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
										{o.note}
									</td>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
										<button
											type="button"
											className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50"
											onClick={() => remove(o.id)}
										>
											Remover
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</ListSection>
		</PageShell>
	);
}
