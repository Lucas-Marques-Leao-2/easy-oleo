"use client";

import Link from "next/link";

import { apiErrorMessage } from "@/lib/api-error-message";
import { formatCpfOrCnpjDocument } from "@/lib/format-brazilian-doc";
import {
	getCustomersControllerFindAllQueryKey,
	useCustomersControllerFindAll,
	useCustomersControllerRemove,
} from "@/openapi/client/customers/customers";
import { useQueryClient } from "@tanstack/react-query";

import { CreateCustomerForm } from "./_components/create-customer-form";

export default function CustomersPage() {
	const queryClient = useQueryClient();
	const { data: customers = [], isPending, isError, error } = useCustomersControllerFindAll();

	const remove = useCustomersControllerRemove({
		mutation: {
			onSuccess: () => {
				void queryClient.invalidateQueries({
					queryKey: getCustomersControllerFindAllQueryKey(),
				});
			},
			onError: err => {
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
					Clientes
				</h1>
			</header>

			<section className="mt-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
				<h2 className="mb-3 text-base font-semibold text-typography-lv2 dark:text-slate-300">Novo</h2>
				<CreateCustomerForm />
			</section>

			<section
				className="mt-8"
				aria-labelledby="list-heading"
			>
				<h2
					id="list-heading"
					className="mb-3 text-base font-semibold text-typography-lv2 dark:text-slate-300"
				>
					Lista
				</h2>
				{isPending && <p className="text-sm text-typography-lv2 dark:text-slate-400">Carregando…</p>}
				{isError && (
					<p
						className="text-sm text-red-600 dark:text-red-400"
						role="alert"
					>
						{apiErrorMessage(error)}
					</p>
				)}
				{!isPending && !isError && (
					<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
						<table className="w-full border-collapse text-sm">
							<thead>
								<tr>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Nome
									</th>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Documento
									</th>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Cidade / UF
									</th>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										E-mail
									</th>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Telefones
									</th>
									<th
										className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
										aria-label="Actions"
									/>
								</tr>
							</thead>
							<tbody>
								{customers.map(row => (
									<tr
										key={row.id}
										className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
									>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{row.name}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{formatCpfOrCnpjDocument(row.document)}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{row.city} / {row.state}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{row.email}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{row.phones.map(p => p.number).join(", ") || "—"}
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
