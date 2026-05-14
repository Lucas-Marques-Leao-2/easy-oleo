import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CpfInput } from "../cpf-input";

import { renderWithMantine } from "./render";

describe("CpfInput", () => {
	it("define label e placeholder padrão", () => {
		const { getByLabelText, getByPlaceholderText } = renderWithMantine(<CpfInput />);
		expect(getByLabelText("CPF")).toBeTruthy();
		expect(getByPlaceholderText("000.000.000-00")).toBeTruthy();
	});

	it("aceita label e placeholder customizados", () => {
		const { getByLabelText, getByPlaceholderText } = renderWithMantine(
			<CpfInput
				label="CPF do titular"
				placeholder="___.___.___-__"
			/>,
		);
		expect(getByLabelText("CPF do titular")).toBeTruthy();
		expect(getByPlaceholderText("___.___.___-__")).toBeTruthy();
	});

	it("dispara onChange com 11 dígitos sem máscara", async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		const { getByLabelText } = renderWithMantine(<CpfInput onChange={onChange} />);
		const input = getByLabelText("CPF") as HTMLInputElement;

		await user.clear(input);
		await user.type(input, "12345678909");

		expect(onChange.mock.calls.at(-1)?.[0]).toBe("12345678909");
		expect(input.value.replace(/\D/g, "")).toBe("12345678909");
	});

	it("mantém 11 dígitos no valor controlado", () => {
		const { getByLabelText } = renderWithMantine(
			<CpfInput
				value="12345678909"
				readOnly
			/>,
		);
		const input = getByLabelText("CPF") as HTMLInputElement;
		expect(input.value.replace(/\D/g, "")).toBe("12345678909");
	});
});
