import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
	formatIsoDatePtBr,
	parseIsoDateToLocalDate,
	todayIsoDateLocal,
} from "../formatters/format-date";

describe("parseIsoDateToLocalDate", () => {
	it("aceita YYYY-MM-DD e monta Date no fuso local (meia-noite)", () => {
		const d = parseIsoDateToLocalDate("2024-03-15");
		expect(d).not.toBeNull();
		expect(d!.getFullYear()).toBe(2024);
		expect(d!.getMonth()).toBe(2);
		expect(d!.getDate()).toBe(15);
		expect(d!.getHours()).toBe(0);
		expect(d!.getMinutes()).toBe(0);
	});

	it("faz trim antes de validar", () => {
		const d = parseIsoDateToLocalDate("  2020-01-02  ");
		expect(d).not.toBeNull();
		expect(d!.getFullYear()).toBe(2020);
		expect(d!.getMonth()).toBe(0);
		expect(d!.getDate()).toBe(2);
	});

	it("retorna null para ISO com hora ou timezone", () => {
		expect(parseIsoDateToLocalDate("2024-01-02T00:00:00.000Z")).toBeNull();
		expect(parseIsoDateToLocalDate("2024-1-02")).toBeNull();
	});

	it("retorna null para string vazia ou lixo", () => {
		expect(parseIsoDateToLocalDate("")).toBeNull();
		expect(parseIsoDateToLocalDate("01/02/2024")).toBeNull();
	});
});

describe("formatIsoDatePtBr", () => {
	it("formata data ISO válida em DD/MM/AAAA", () => {
		expect(formatIsoDatePtBr("2024-03-15")).toBe("15/03/2024");
	});

	it("com entrada que não casa YYYY-MM-DD devolve o próprio texto (fallback)", () => {
		expect(formatIsoDatePtBr("não é data")).toBe("não é data");
	});
});

describe("todayIsoDateLocal", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("retorna a data local atual no formato YYYY-MM-DD", () => {
		vi.setSystemTime(new Date(2026, 4, 13, 14, 30, 0));
		expect(todayIsoDateLocal()).toBe("2026-05-13");
	});
});
