import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CepInput } from "../cep-input";

import { renderWithMantine } from "./render";

describe("CepInput", () => {
	it("define label e placeholder padrão", () => {
		const { getByLabelText, getByPlaceholderText } = renderWithMantine(<CepInput />);
		expect(getByLabelText("CEP")).toBeTruthy();
		expect(getByPlaceholderText("00000-000")).toBeTruthy();
	});

	it("aceita label e placeholder customizados", () => {
		const { getByLabelText, getByPlaceholderText } = renderWithMantine(
			<CepInput
				label="CEP da obra"
				placeholder="_____-___"
			/>,
		);
		expect(getByLabelText("CEP da obra")).toBeTruthy();
		expect(getByPlaceholderText("_____-___")).toBeTruthy();
	});

	it("dispara onChange com apenas dígitos (sem máscara) ao digitar o CEP completo", async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		const { getByLabelText } = renderWithMantine(<CepInput onChange={onChange} />);
		const input = getByLabelText("CEP") as HTMLInputElement;

		await user.clear(input);
		await user.type(input, "01310100");

		expect(onChange.mock.calls.length).toBeGreaterThan(0);
		expect(onChange.mock.calls.at(-1)?.[0]).toBe("01310100");
		expect(input.value).toContain("01310");
		expect(input.value).toContain("100");
	});

	it("exibe valor mascarado quando controlado", () => {
		const { getByLabelText } = renderWithMantine(
			<CepInput
				value="01310100"
				readOnly
			/>,
		);
		const input = getByLabelText("CEP") as HTMLInputElement;
		expect(input.value.replace(/\D/g, "")).toBe("01310100");
	});
});
