"use client";

import { useState } from "react";

import { Modal } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";

import {
	ListSection,
	PageShell,
	SectionCard,
} from "@/components/layout/page-layout";
import { apiErrorMessage } from "@/lib/api-error-message";
import { formatCNPJ } from "@/lib/format-brazilian-doc";
import {
	getSuppliersControllerFindAllQueryKey,
	useSuppliersControllerFindAll,
	useSuppliersControllerRemove,
} from "@/openapi/client/suppliers/suppliers";

import { CreateSupplierForm } from "./_components/create-supplier-form";

export default function SuppliersPage() {
	const [opened, setOpened] = useState(false);

	const queryClient = useQueryClient();

	const {
		data: suppliers = [],
		isPending,
		isError,
		error,
	} = useSuppliersControllerFindAll();

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
		<PageShell title="Fornecedores">
			<ListSection
				title="Lista"
				headingId="fornecedores-lista"
			>
				<div className="mb-4 flex justify-end">
					<button
						type="button"
						onClick={() => setOpened(true)}
						className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
					>
						Adicionar
					</button>
				</div>

				{isPending && (
					<p className="text-sm text-typography-lv2 dark:text-slate-400">
						Carregando…
					</p>
				)}

				{isError && (
					<p
						className="text-sm text-red-600 dark:text-red-400"
						role="alert"
					>
						{apiErrorMessage(error)}
					</p>
				)}

				{!isPending && !isError && (
					<div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
						<table className="w-full min-w-[640px] border-collapse text-sm">
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

				<Modal
					opened={opened}
					onClose={() => setOpened(false)}
					title="Adicionar fornecedor"
					centered
					size="lg"
				>
					<CreateSupplierForm />
				</Modal>
			</ListSection>
		</PageShell>
	);
}