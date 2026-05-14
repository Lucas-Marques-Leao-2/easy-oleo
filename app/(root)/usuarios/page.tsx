"use client";

import { ListSection, PageShell } from "@/components/layout/page-layout";
import { useUser } from "@/components/context/user-provider";
import { useApiAuth } from "@/hooks/use-api-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { apiErrorMessage } from "@/lib/api-error-message";
import { formatCPF } from "@/lib/format-brazilian-doc";
import type { UserResponseRole } from "@/openapi/client/models/userResponseRole";
import {
	getUsersControllerFindAllQueryKey,
	useUsersControllerFindAll,
	useUsersControllerRemove,
} from "@/openapi/client/users/users";
import { Button, Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import { CreateUserForm } from "./_components/create-user-form";

const ROLE_LABELS_PT: Record<UserResponseRole, string> = {
	ATTENDANT: "Atendente",
	SELLER: "Vendedor(a)",
	ADMIN: "Administrador(a)",
};

export default function UsersPage() {
	const queryClient = useQueryClient();
	const auth = useApiAuth();
	const { user: appUser, isMePending, isMeError, jwt } = useUser();
	const { isAtLeast } = useUserRole();
	const [opened, setOpened] = useState(false);

	const canManageUsers = isAtLeast("ADMIN");

	const {
		data: rows = [],
		isPending,
		isError,
		error,
		refetch,
	} = useUsersControllerFindAll({
		query: { retry: false, enabled: Boolean(auth) && canManageUsers },
		request: auth,
	});

	const remove = useUsersControllerRemove({
		mutation: {
			onSuccess: () => {
				void queryClient.invalidateQueries({
					queryKey: getUsersControllerFindAllQueryKey(),
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

	if (jwt && isMePending) {
		return (
			<PageShell title="Usuários">
				<p className="text-sm text-typography-lv2 dark:text-slate-400">Carregando permissões…</p>
			</PageShell>
		);
	}

	if (jwt && (isMeError || !appUser)) {
		return (
			<PageShell title="Usuários">
				<p className="text-sm text-red-600 dark:text-red-400" role="alert">
					Não foi possível carregar seu perfil na API. Verifique o webhook Clerk ou tente novamente.
				</p>
				<Button component={Link} href="/" variant="light" className="mt-4">
					Voltar ao início
				</Button>
			</PageShell>
		);
	}

	if (appUser && !canManageUsers) {
		return (
			<PageShell title="Usuários">
				<p className="text-sm text-typography-lv2 dark:text-slate-300" role="status">
					Apenas administradores podem listar e gerenciar usuários.
				</p>
				<Button component={Link} href="/" variant="light" className="mt-4">
					Voltar ao início
				</Button>
			</PageShell>
		);
	}

	return (
		<PageShell title="Usuários">
			<ListSection
				title="Lista"
				headingId="usuarios-lista"
				actions={
					<Button onClick={() => setOpened(true)}>
						Adicionar
					</Button>
				}
			>
				{isPending && (
					<p className="text-sm text-typography-lv2 dark:text-slate-400">
						Carregando…
					</p>
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
										Nome
									</th>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										E-mail
									</th>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										CPF
									</th>
									<th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
										Perfil
									</th>
									<th
										className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
										aria-label="Ações"
									/>
								</tr>
							</thead>
							<tbody>
								{rows.map(row => (
									<tr
										key={row.id}
										className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
									>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{row.name}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{row.email}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{formatCPF(row.cpf)}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											{ROLE_LABELS_PT[row.role]}
										</td>
										<td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
											<Button
												type="button"
												variant="light"
												color="red"
												size="xs"
												loading={remove.isPending}
												onClick={() => void remove.mutateAsync({ id: row.id })}
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

				<Modal opened={opened} onClose={() => setOpened(false)} title="Novo usuário" centered size="xl">
					<CreateUserForm onSuccess={() => setOpened(false)} />
				</Modal>
			</ListSection>
		</PageShell>
	);
}
