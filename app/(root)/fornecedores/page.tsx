"use client";

import { apiErrorMessage } from "@/lib/api-error-message";
import { formatCNPJ } from "@/lib/format-brazilian-doc";
import {
	getSuppliersControllerFindAllQueryKey,
	useSuppliersControllerFindAll,
	useSuppliersControllerRemove,
} from "@/openapi/client/suppliers/suppliers";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

import { CreateSupplierForm } from "./_components/create-supplier-form";

export default function SuppliersPage() {
	const queryClient = useQueryClient();
	const { data: suppliers = [], isPending, isError, error } =
		useSuppliersControllerFindAll();

	const remove = useSuppliersControllerRemove({
		mutation: {
			onSuccess: () => {
				void queryClient.invalidateQueries({
					queryKey: getSuppliersControllerFindAllQueryKey(),
				});
			},
			onError: (err) => {
				console.error(err);
			},
		},
	});

	return (
		<main className="mx-auto max-w-4xl px-4 py-8 pb-16 text-[15px] leading-snug">
			<p className="mb-3 inline-block text-sm font-medium text-main hover:underline dark:text-main">
				<Link href="/">← Início</Link>
			</p>
			<header>
				<h1 className="mb-6 text-xl font-bold tracking-tight text-typography-lv1 dark:text-slate-100">
					Fornecedores
				</h1>
			</header>

			<section className="mt-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
				<h2 className="mb-3 text-base font-semibold text-typography-lv2 dark:text-slate-300">
					Novo
				</h2>
				<CreateSupplierForm />
			</section>

			<section className="mt-8" aria-labelledby="list-heading">
				<h2
					id="list-heading"
					className="mb-3 text-base font-semibold text-typography-lv2 dark:text-slate-300"
				>
					Lista
				</h2>
				{isPending && (
					<p className="text-sm text-typography-lv2 dark:text-slate-400">
						Carregando…
					</p>
				)}
				{isError && (
					<p className="text-sm text-red-600 dark:text-red-400" role="alert">
						{apiErrorMessage(error)}
					</p>
				)}
				{!isPending && !isError && (
					<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
						<table className="w-full border-collapse text-sm">
							<thead>
								<tr>
									<th className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold whitespace-nowrap text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Razão social
									</th>
									<th className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold whitespace-nowrap text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										CNPJ
									</th>
									<th className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold whitespace-nowrap text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Cidade / UF
									</th>
									<th className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold whitespace-nowrap text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										E-mail
									</th>
									<th className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold whitespace-nowrap text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Telefones
									</th>
									<th
										className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold whitespace-nowrap text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
										aria-label="Actions"
									/>
								</tr>
							</thead>
							<tbody>
								{suppliers.map((row) => (
									<tr
										key={row.id}
										className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
									>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{row.legalName}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{formatCNPJ(row.cnpj)}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{row.city} / {row.state}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{row.email}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{row.phones.map((p) => p.number).join(", ") || "—"}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											<button
												type="button"
												className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50"
												disabled={remove.isPending}
												onClick={() => remove.mutate({ id: row.id })}
											>
												Remover
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</section>
		</main>
	);
}
