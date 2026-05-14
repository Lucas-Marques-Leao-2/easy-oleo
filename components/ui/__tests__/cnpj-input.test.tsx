import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CnpjInput } from "../cnpj-input";

import { renderWithMantine } from "./render";

describe("CnpjInput", () => {
	it("define label e placeholder padrão", () => {
		const { getByLabelText, getByPlaceholderText } = renderWithMantine(<CnpjInput />);
		expect(getByLabelText("CNPJ")).toBeTruthy();
		expect(getByPlaceholderText("00.000.000/0000-00")).toBeTruthy();
	});

	it("aceita label e placeholder customizados", () => {
		const { getByLabelText, getByPlaceholderText } = renderWithMantine(
			<CnpjInput
				label="CNPJ da empresa"
				placeholder="__.___.___/____-__"
			/>,
		);
		expect(getByLabelText("CNPJ da empresa")).toBeTruthy();
		expect(getByPlaceholderText("__.___.___/____-__")).toBeTruthy();
	});

	it("dispara onChange com 14 dígitos sem máscara", async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		const { getByLabelText } = renderWithMantine(<CnpjInput onChange={onChange} />);
		const input = getByLabelText("CNPJ") as HTMLInputElement;

		await user.clear(input);
		await user.type(input, "11222333000181");

		expect(onChange.mock.calls.at(-1)?.[0]).toBe("11222333000181");
		expect(input.value.replace(/\D/g, "")).toBe("11222333000181");
	});

	it("mantém 14 dígitos no valor controlado", () => {
		const { getByLabelText } = renderWithMantine(
			<CnpjInput
				value="11222333000181"
				readOnly
			/>,
		);
		const input = getByLabelText("CNPJ") as HTMLInputElement;
		expect(input.value.replace(/\D/g, "")).toBe("11222333000181");
	});
});
