import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CpfCnpjInput } from "../cpf-cnpj-input";

import { renderWithMantine } from "./render";

describe("CpfCnpjInput", () => {
	it("define label e placeholder padrão", () => {
		const { getByLabelText, getByPlaceholderText } = renderWithMantine(<CpfCnpjInput />);
		expect(getByLabelText("CPF/CNPJ")).toBeTruthy();
		expect(getByPlaceholderText("000.000.000-00")).toBeTruthy();
	});

	it("aceita label e placeholder customizados", () => {
		const { getByLabelText, getByPlaceholderText } = renderWithMantine(
			<CpfCnpjInput
				label="Documento"
				placeholder="Digite CPF ou CNPJ"
			/>,
		);
		expect(getByLabelText("Documento")).toBeTruthy();
		expect(getByPlaceholderText("Digite CPF ou CNPJ")).toBeTruthy();
	});

	it("dispara onChange com 11 dígitos (CPF) sem máscara", async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		const { getByLabelText } = renderWithMantine(<CpfCnpjInput onChange={onChange} />);
		const input = getByLabelText("CPF/CNPJ") as HTMLInputElement;

		await user.clear(input);
		await user.type(input, "12345678909");

		expect(onChange.mock.calls.at(-1)?.[0]).toBe("12345678909");
		expect(input.value.replace(/\D/g, "")).toBe("12345678909");
	});

	it("dispara onChange com 14 dígitos (CNPJ) sem máscara", async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		const { getByLabelText } = renderWithMantine(<CpfCnpjInput onChange={onChange} />);
		const input = getByLabelText("CPF/CNPJ") as HTMLInputElement;

		await user.clear(input);
		await user.type(input, "11222333000181");

		expect(onChange.mock.calls.at(-1)?.[0]).toBe("11222333000181");
		expect(input.value.replace(/\D/g, "")).toBe("11222333000181");
	});
});
