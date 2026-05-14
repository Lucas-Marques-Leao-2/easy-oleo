import { userRoleIsAtLeast } from "@/hooks/use-user-role";

export const MODULE_LINKS = [
	{ href: "/clientes", label: "Clientes" },
	{ href: "/fornecedores", label: "Fornecedores" },
	{ href: "/produtos", label: "Produtos" },
	{ href: "/usuarios", label: "Usuários" },
	{ href: "/pedidos-venda", label: "Pedidos de venda" },
	{ href: "/compras", label: "Compras" },
] as const;

export type ModuleLink = (typeof MODULE_LINKS)[number];

const ADMIN_ONLY_MODULE_HREFS = new Set<string>(["/usuarios"]);

export function moduleLinksVisibleForAppUser(
	appUser: { role: string } | null | undefined,
): ModuleLink[] {
	return MODULE_LINKS.filter(l => {
		if (ADMIN_ONLY_MODULE_HREFS.has(l.href)) {
			return userRoleIsAtLeast(appUser?.role, "ADMIN");
		}
		return true;
	});
}
