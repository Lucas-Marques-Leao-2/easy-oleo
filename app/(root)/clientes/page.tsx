"use client";

import { useState } from "react";

import { Modal, Button } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";

import { ListSection, PageShell } from "@/components/layout/page-layout";
import { ListTableSkeleton } from "@/components/loading/list-table-skeleton";
import { useApiAuth } from "@/hooks/use-api-auth";
import { apiErrorMessage } from "@/lib/api-error-message";
import { formatCpfOrCnpjDocument } from "@/lib/format-brazilian-doc";
import {
	getCustomersControllerFindAllQueryKey,
	useCustomersControllerFindAll,
	useCustomersControllerRemove,
} from "@/openapi/client/customers/customers";

import { CreateCustomerForm } from "./_components/create-customer-form";

export default function CustomersPage() {
	const [opened, setOpened] = useState(false);

	const queryClient = useQueryClient();
	const auth = useApiAuth();

	const {
		data: customers = [],
		isPending,
		isError,
		error,
	} = useCustomersControllerFindAll({
		query: { retry: false },
		request: auth,
	});

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
		request: auth,
	});

	return (
		<PageShell title="Clientes">
			<ListSection
				title="Lista"
				headingId="clientes-lista"
				actions={
					<Button onClick={() => setOpened(true)}>
						Adicionar
					</Button>
				}
			>
				{isPending && (
					<ListTableSkeleton
						columnLabels={[
							"Nome",
							"Documento",
							"Cidade / UF",
							"E-mail",
							"Telefones",
							"Ações",
						]}
						minWidth="640px"
						loadingLabel="Carregando clientes…"
					/>
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

				<Modal
					opened={opened}
					onClose={() => setOpened(false)}
					title="Novo cliente"
					centered
					size="lg"
				>
					<CreateCustomerForm />
				</Modal>
			</ListSection>
		</PageShell>
	);
}