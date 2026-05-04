"use client";

import { InputBase, TextInput } from "@mantine/core";
import type { ComponentProps } from "react";
import { memo } from "react";
import { IMaskInput } from "react-imask";

type CpfCnpjInputProps = Omit<ComponentProps<typeof TextInput>, "onChange" | "ref" | "value"> & {
	onChange?: (value: string) => void;
	value?: string;
};

export const CpfCnpjInput = memo(function CpfCnpjInput({
	onChange,
	value,
	...props
}: CpfCnpjInputProps) {
	return (
		<InputBase
			{...props}
			component={IMaskInput}
			label={props.label ?? "CPF/CNPJ"}
			mask={[{ mask: "000.000.000-00" }, { mask: "00.000.000/0000-00" }]}
			value={value ?? ""}
			onAccept={(_val, mask) => onChange?.(mask.unmaskedValue)}
			placeholder={props.placeholder ?? "000.000.000-00"}
		/>
	);
});
