"use client";

import { ListSection, PageShell, SectionCard } from "@/components/layout/page-layout";
import { Button, Group, NumberInput, Select, SimpleGrid, Stack, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useState } from "react";

import { formatIsoDatePtBr, parseIsoDateToLocalDate, todayIsoDateLocal } from "@/lib/formatters/format-date";

type SaleOrderStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";

type SaleOrderRow = {
	id: string;
	orderDate: string;
	customerName: string;
	total: number;
	status: SaleOrderStatus;
	note: string;
};

const INITIAL_ROWS: SaleOrderRow[] = [
	{
		id: "seed-so1",
		orderDate: "2026-04-18",
		customerName: "Oficina Silva Ltda",
		total: 191.8,
		status: "DRAFT",
		note: "In-memory sample",
	},
];

const STATUS_LABELS_PT: Record<SaleOrderStatus, string> = {
	DRAFT: "Rascunho",
	CONFIRMED: "Confirmado",
	CANCELLED: "Cancelado",
};

export default function SalesOrdersPage() {
	const [rows, setRows] = useState<SaleOrderRow[]>(INITIAL_ROWS);
	const [orderDate, setOrderDate] = useState<string | null>(null);
	const [customerName, setCustomerName] = useState("");
	const [totalInput, setTotalInput] = useState<number | string>("");
	const [status, setStatus] = useState<SaleOrderStatus>("DRAFT");
	const [note, setNote] = useState("");

	function handleAdd(e: React.FormEvent) {
		e.preventDefault();
		if (!customerName.trim()) return;
		const parsedTotal = typeof totalInput === "number" ? totalInput : Number(totalInput);
		setRows((prev) => [
			...prev,
			{
				id: crypto.randomUUID(),
				orderDate: orderDate || todayIsoDateLocal(),
				customerName: customerName.trim(),
				total: Number.isFinite(parsedTotal) ? parsedTotal : 0,
				status,
				note: note.trim() || "—",
			},
		]);
		setOrderDate(null);
		setCustomerName("");
		setTotalInput("");
		setStatus("DRAFT");
		setNote("");
	}

	function handleRemoveRow(id: string) {
		setRows((prev) => prev.filter((row) => row.id !== id));
	}

	return (
		<PageShell
			title="Pedidos de venda"
			description="Demonstração em memória; integração com API pode substituir esta lista."
		>
			<SectionCard
				title="Novo"
				titleId="pedidos-venda-novo"
			>
				<form onSubmit={handleAdd}>
					<Stack gap="sm">
						<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
							<DatePickerInput
								label="Data"
								placeholder="DD/MM/AAAA"
								value={orderDate ? parseIsoDateToLocalDate(orderDate) : null}
								onChange={v =>
									setOrderDate(v ? dayjs(v).format("YYYY-MM-DD") : null)
								}
								valueFormat="DD/MM/YYYY"
								clearable
							/>
							<TextInput
								label="Cliente (texto)"
								value={customerName}
								onChange={e => setCustomerName(e.currentTarget.value)}
								required
							/>
						</SimpleGrid>
						<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
							<NumberInput
								label="Total"
								value={totalInput}
								onChange={setTotalInput}
								decimalScale={2}
								fixedDecimalScale
								min={0}
								thousandSeparator="."
								decimalSeparator=","
							/>
							<Select
								label="Status"
								value={status}
								data={[
									{ value: "DRAFT", label: STATUS_LABELS_PT.DRAFT },
									{ value: "CONFIRMED", label: STATUS_LABELS_PT.CONFIRMED },
									{ value: "CANCELLED", label: STATUS_LABELS_PT.CANCELLED },
								]}
								onChange={v =>
									setStatus(v === "CONFIRMED" || v === "CANCELLED" ? v : "DRAFT")
								}
							/>
						</SimpleGrid>
						<TextInput
							label="Obs."
							value={note}
							onChange={e => setNote(e.currentTarget.value)}
						/>
						<Group justify="flex-end">
							<Button type="submit">Adicionar</Button>
						</Group>
					</Stack>
				</form>
			</SectionCard>

			<ListSection
				title="Lista"
				headingId="pedidos-venda-lista"
			>
				<div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
					<table className="w-full min-w-[640px] border-collapse text-sm">
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
								<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
									Obs.
								</th>
								<th
									className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
									aria-label="Actions"
								/>
							</tr>
						</thead>
						<tbody>
							{rows.map((row) => (
								<tr
									key={row.id}
									className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
								>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
										{formatIsoDatePtBr(row.orderDate)}
									</td>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
										{row.customerName}
									</td>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
										{row.total.toFixed(2)}
									</td>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
										{STATUS_LABELS_PT[row.status]}
									</td>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
										{row.note}
									</td>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
										<button
											type="button"
											className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50"
											onClick={() => handleRemoveRow(row.id)}
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
