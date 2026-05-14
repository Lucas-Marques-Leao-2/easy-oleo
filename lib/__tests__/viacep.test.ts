import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchAddressByCep } from "../viacep";

describe("fetchAddressByCep", () => {
	const originalFetch = globalThis.fetch;

	beforeEach(() => {
		vi.stubGlobal("fetch", vi.fn());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		globalThis.fetch = originalFetch;
	});

	function mockFetch(impl: typeof fetch) {
		vi.mocked(globalThis.fetch).mockImplementation(impl as typeof fetch);
	}

	it("retorna null quando o CEP não tem 8 dígitos após limpar", async () => {
		expect(await fetchAddressByCep("0131010")).toBeNull();
		expect(await fetchAddressByCep("013101000")).toBeNull();
		expect(await fetchAddressByCep("")).toBeNull();
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});

	it("normaliza CEP com pontuação e chama ViaCEP com só dígitos", async () => {
		mockFetch(async (url) => {
			expect(String(url)).toBe("https://viacep.com.br/ws/01310100/json/");
			return new Response(JSON.stringify({ erro: true }), { status: 200 });
		});
		await fetchAddressByCep("01310-100");
		expect(globalThis.fetch).toHaveBeenCalledTimes(1);
	});

	it("retorna null quando HTTP não ok", async () => {
		mockFetch(async () => new Response(null, { status: 500 }));
		expect(await fetchAddressByCep("01310100")).toBeNull();
	});

	it("retorna null quando a API sinaliza CEP inexistente (erro: true)", async () => {
		mockFetch(async () =>
			new Response(JSON.stringify({ erro: true }), { status: 200 }),
		);
		expect(await fetchAddressByCep("00000000")).toBeNull();
	});

	it("retorna o payload quando o CEP existe", async () => {
		const body = {
			cep: "01310-100",
			logradouro: "Avenida Paulista",
			complemento: "",
			bairro: "Bela Vista",
			localidade: "São Paulo",
			uf: "SP",
			ibge: "3550308",
			gia: "1004",
			ddd: "11",
			siafi: "7107",
		};
		mockFetch(async () => new Response(JSON.stringify(body), { status: 200 }));
		await expect(fetchAddressByCep("01310100")).resolves.toEqual(body);
	});

	it("retorna null se fetch ou json rejeitar", async () => {
		mockFetch(async () => {
			throw new Error("offline");
		});
		expect(await fetchAddressByCep("01310100")).toBeNull();
	});
});
