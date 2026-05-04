"use client";

import Link from "next/link";
import { useState } from "react";

type Row = {
	id: string;
	code: string;
	name: string;
	brand: string;
	type: string;
	unit: string;
	salePrice: number;
	stockQuantity: number;
	minStock: number;
};

const SEED: Row[] = [
	{
		id: "seed-p1",
		code: "OLEO-5W30-1L",
		name: "Óleo motor sintético 5W30",
		brand: "Mobil",
		type: "óleo",
		unit: "L",
		salePrice: 45.9,
		stockQuantity: 120,
		minStock: 24,
	},
];

export default function ProductsPage() {
	const [rows, setRows] = useState<Row[]>(SEED);
	const [code, setCode] = useState("");
	const [name, setName] = useState("");
	const [brand, setBrand] = useState("");
	const [type, setType] = useState("");
	const [unit, setUnit] = useState("L");
	const [salePrice, setSalePrice] = useState("");
	const [stockQuantity, setStockQuantity] = useState("");
	const [minStock, setMinStock] = useState("");

	function add(e: React.FormEvent) {
		e.preventDefault();
		if (!code.trim() || !name.trim()) return;
		const price = Number(salePrice);
		const stock = Number(stockQuantity);
		const min = Number(minStock);
		setRows((r) => [
			...r,
			{
				id: crypto.randomUUID(),
				code: code.trim(),
				name: name.trim(),
				brand: brand.trim() || "—",
				type: type.trim() || "—",
				unit: unit.trim() || "un",
				salePrice: Number.isFinite(price) ? price : 0,
				stockQuantity: Number.isFinite(stock) ? stock : 0,
				minStock: Number.isFinite(min) ? min : 0,
			},
		]);
		setCode("");
		setName("");
		setBrand("");
		setType("");
		setUnit("L");
		setSalePrice("");
		setStockQuantity("");
		setMinStock("");
	}

	function remove(id: string) {
		setRows((r) => r.filter((x) => x.id !== id));
	}

	return (
		<main className="mx-auto max-w-4xl px-4 py-8 pb-16 text-[15px] leading-snug">
			<p className="mb-3 inline-block text-sm font-medium text-main hover:underline dark:text-main">
				<Link href="/">← Início</Link>
			</p>
			<header>
				<h1 className="mb-6 text-xl font-bold tracking-tight text-typography-lv1 dark:text-slate-100">
					Produtos
				</h1>
			</header>

			<form className="mt-8" onSubmit={add}>
				<h2 className="mb-3 text-base font-semibold text-typography-lv2 dark:text-slate-300">
					Novo
				</h2>
				<div className="mb-4 flex flex-wrap items-end gap-2">
					<label className="flex flex-col gap-1 text-xs font-medium text-typography-lv2 dark:text-slate-400">
						Código
						<input className="min-w-[8rem] rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-typography-lv1 shadow-sm focus:border-main focus:outline-none focus:ring-1 focus:ring-main dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" value={code} onChange={(e) => setCode(e.target.value)} />
					</label>
					<label className="flex flex-col gap-1 text-xs font-medium text-typography-lv2 dark:text-slate-400">
						Nome
						<input className="min-w-[8rem] rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-typography-lv1 shadow-sm focus:border-main focus:outline-none focus:ring-1 focus:ring-main dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" value={name} onChange={(e) => setName(e.target.value)} />
					</label>
					<label className="flex flex-col gap-1 text-xs font-medium text-typography-lv2 dark:text-slate-400">
						Marca
						<input className="min-w-[8rem] rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-typography-lv1 shadow-sm focus:border-main focus:outline-none focus:ring-1 focus:ring-main dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" value={brand} onChange={(e) => setBrand(e.target.value)} />
					</label>
					<label className="flex flex-col gap-1 text-xs font-medium text-typography-lv2 dark:text-slate-400">
						Tipo
						<input className="min-w-[8rem] rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-typography-lv1 shadow-sm focus:border-main focus:outline-none focus:ring-1 focus:ring-main dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" value={type} onChange={(e) => setType(e.target.value)} />
					</label>
					<label className="flex flex-col gap-1 text-xs font-medium text-typography-lv2 dark:text-slate-400">
						Unidade
						<input className="min-w-[8rem] rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-typography-lv1 shadow-sm focus:border-main focus:outline-none focus:ring-1 focus:ring-main dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" value={unit} onChange={(e) => setUnit(e.target.value)} />
					</label>
					<label className="flex flex-col gap-1 text-xs font-medium text-typography-lv2 dark:text-slate-400">
						Preço venda
						<input
							className="min-w-[8rem] rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-typography-lv1 shadow-sm focus:border-main focus:outline-none focus:ring-1 focus:ring-main dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
							inputMode="decimal"
							value={salePrice}
							onChange={(e) => setSalePrice(e.target.value)}
						/>
					</label>
					<label className="flex flex-col gap-1 text-xs font-medium text-typography-lv2 dark:text-slate-400">
						Estoque
						<input
							className="min-w-[8rem] rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-typography-lv1 shadow-sm focus:border-main focus:outline-none focus:ring-1 focus:ring-main dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
							inputMode="numeric"
							value={stockQuantity}
							onChange={(e) => setStockQuantity(e.target.value)}
						/>
					</label>
					<label className="flex flex-col gap-1 text-xs font-medium text-typography-lv2 dark:text-slate-400">
						Estoque mín.
						<input
							className="min-w-[8rem] rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-typography-lv1 shadow-sm focus:border-main focus:outline-none focus:ring-1 focus:ring-main dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
							inputMode="numeric"
							value={minStock}
							onChange={(e) => setMinStock(e.target.value)}
						/>
					</label>
					<button
						type="submit"
						className="rounded-md border border-slate-400 bg-white px-3 py-1.5 text-sm font-medium text-typography-lv1 shadow-sm hover:bg-slate-50 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
					>
						Adicionar
					</button>
				</div>
			</form>

			<section className="mt-8" aria-labelledby="list-heading">
				<h2
					id="list-heading"
					className="mb-3 text-base font-semibold text-typography-lv2 dark:text-slate-300"
				>
					Lista
				</h2>
				<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr>
								<th className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold whitespace-nowrap text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">Código</th>
								<th className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold whitespace-nowrap text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">Nome</th>
								<th className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold whitespace-nowrap text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">Marca</th>
								<th className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold whitespace-nowrap text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">Tipo</th>
								<th className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold whitespace-nowrap text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">Un.</th>
								<th className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold whitespace-nowrap text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">Preço</th>
								<th className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold whitespace-nowrap text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">Estoque</th>
								<th className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold whitespace-nowrap text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">Mín.</th>
								<th className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold whitespace-nowrap text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" aria-label="Ações" />
							</tr>
						</thead>
						<tbody>
							{rows.map((p) => (
								<tr
									key={p.id}
									className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
								>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">{p.code}</td>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">{p.name}</td>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">{p.brand}</td>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">{p.type}</td>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">{p.unit}</td>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">{p.salePrice.toFixed(2)}</td>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">{p.stockQuantity}</td>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">{p.minStock}</td>
									<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
										<button
											type="button"
											className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50"
											onClick={() => remove(p.id)}
										>
											Remover
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</main>
	);
}
