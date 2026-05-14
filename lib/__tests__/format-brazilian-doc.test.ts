import { describe, expect, it } from "vitest";

import { formatCpfOrCnpjDocument } from "../format-brazilian-doc";

describe("formatCpfOrCnpjDocument", () => {
	it("formata 11 dígitos como CPF com máscara", () => {
		expect(formatCpfOrCnpjDocument("12345678909")).toBe("123.456.789-09");
		expect(formatCpfOrCnpjDocument("123.456.789-09")).toBe("123.456.789-09");
	});

	it("formata 14 dígitos como CNPJ com máscara", () => {
		expect(formatCpfOrCnpjDocument("11222333000181")).toBe("11.222.333/0001-81");
		expect(formatCpfOrCnpjDocument("11.222.333/0001-81")).toBe("11.222.333/0001-81");
	});

	it("não é CPF nem CNPJ: devolve o texto original sem alterar dígitos a menos", () => {
		expect(formatCpfOrCnpjDocument("1234567890")).toBe("1234567890");
		expect(formatCpfOrCnpjDocument("123456789012")).toBe("123456789012");
		expect(formatCpfOrCnpjDocument("")).toBe("");
		expect(formatCpfOrCnpjDocument("abc")).toBe("abc");
	});
});
