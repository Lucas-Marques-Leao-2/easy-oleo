"use client";

import { InputBase, TextInput } from "@mantine/core";
import type { ComponentProps } from "react";
import { memo } from "react";
import { IMaskInput } from "react-imask";

type CnpjInputProps = Omit<ComponentProps<typeof TextInput>, "onChange" | "ref" | "value"> & {
	onChange?: (value: string) => void;
	value?: string;
};

export const CnpjInput = memo(function CnpjInput({ onChange, value, ...props }: CnpjInputProps) {
	return (
		<InputBase
			{...props}
			component={IMaskInput}
			label={props.label ?? "CNPJ"}
			mask="00.000.000/0000-00"
			value={value ?? ""}
			onAccept={(_val, mask) => onChange?.(mask.unmaskedValue)}
			placeholder={props.placeholder ?? "00.000.000/0000-00"}
		/>
	);
});
