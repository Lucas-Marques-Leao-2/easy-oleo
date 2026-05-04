"use client";

import { InputBase, TextInput } from "@mantine/core";
import type { ComponentProps } from "react";
import { memo } from "react";
import { IMaskInput } from "react-imask";

type CpfInputProps = Omit<ComponentProps<typeof TextInput>, "onChange" | "ref" | "value"> & {
	onChange?: (value: string) => void;
	value?: string;
};

export const CpfInput = memo(function CpfInput({ onChange, value, ...props }: CpfInputProps) {
	return (
		<InputBase
			{...props}
			component={IMaskInput}
			label={props.label ?? "CPF"}
			mask="000.000.000-00"
			value={value ?? ""}
			onAccept={(_val, mask) => onChange?.(mask.unmaskedValue)}
			placeholder={props.placeholder ?? "000.000.000-00"}
		/>
	);
});
