import axios, { AxiosError, type AxiosResponse } from "axios";
import { describe, expect, it } from "vitest";

import { apiErrorMessage } from "../api-error-message";

function axiosErrWithResponse<T>(
	message: string,
	response: Partial<AxiosResponse<T>> & Pick<AxiosResponse<T>, "data">,
): AxiosError<T> {
	return new AxiosError(
		message,
		"ERR_BAD_REQUEST",
		undefined,
		undefined,
		{
			status: response.status ?? 400,
			statusText: response.statusText ?? "Bad Request",
			headers: response.headers ?? {},
			config: response.config ?? ({} as AxiosResponse<T>["config"]),
			...response,
		} as AxiosResponse<T>,
	);
}

describe("apiErrorMessage", () => {
	it("extrai message string do corpo da resposta Axios", () => {
		const err = axiosErrWithResponse("Request failed", {
			data: { message: "CPF já cadastrado" },
		});
		expect(axios.isAxiosError(err)).toBe(true);
		expect(apiErrorMessage(err)).toBe("CPF já cadastrado");
	});

	it("junta message[] com ponto e espaço", () => {
		const err = axiosErrWithResponse("Request failed", {
			data: { message: ["Campo A inválido", "Campo B obrigatório"] },
		});
		expect(apiErrorMessage(err)).toBe("Campo A inválido. Campo B obrigatório");
	});

	it("sem message no body usa error.message do Axios", () => {
		const err = axiosErrWithResponse("Network Error", { data: {} });
		expect(apiErrorMessage(err)).toBe("Network Error");
	});

	it("sem response usa error.message ou fallback em português", () => {
		const err = new AxiosError("", "ERR_BAD_REQUEST");
		expect(apiErrorMessage(err)).toBe("Erro na requisição.");
	});

	it("Error genérico retorna message", () => {
		expect(apiErrorMessage(new Error("falhou"))).toBe("falhou");
	});

	it("valor desconhecido retorna mensagem genérica", () => {
		expect(apiErrorMessage("string")).toBe("Não foi possível concluir a operação.");
		expect(apiErrorMessage(null)).toBe("Não foi possível concluir a operação.");
		expect(apiErrorMessage({ foo: 1 })).toBe("Não foi possível concluir a operação.");
	});
});
