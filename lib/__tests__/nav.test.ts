import { describe, expect, it } from "vitest";

import { MODULE_LINKS } from "../nav";

describe("MODULE_LINKS", () => {
	it("lista módulos esperados com href e label", () => {
		expect(MODULE_LINKS).toEqual([
			{ href: "/clientes", label: "Clientes" },
			{ href: "/fornecedores", label: "Fornecedores" },
			{ href: "/produtos", label: "Produtos" },
			{ href: "/usuarios", label: "Usuários" },
			{ href: "/pedidos-venda", label: "Pedidos de venda" },
			{ href: "/compras", label: "Compras" },
		]);
	});

	it("cada href é rota absoluta na app e labels não vazias", () => {
		for (const item of MODULE_LINKS) {
			expect(item.href).toMatch(/^\/[a-z0-9-]+$/);
			expect(item.label.length).toBeGreaterThan(0);
		}
	});

	it("não há href duplicado", () => {
		const hrefs = MODULE_LINKS.map((l) => l.href);
		expect(new Set(hrefs).size).toBe(hrefs.length);
	});
});
