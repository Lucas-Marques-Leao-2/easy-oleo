"use client";

import { InputBase, TextInput } from "@mantine/core";
import type { ComponentProps } from "react";
import { memo } from "react";
import { IMaskInput } from "react-imask";

type CepInputProps = Omit<ComponentProps<typeof TextInput>, "onChange" | "ref" | "value"> & {
	onChange?: (value: string) => void;
	value?: string;
};

export const CepInput = memo(function CepInput({ onChange, value, ...props }: CepInputProps) {
	return (
		<InputBase
			{...props}
			component={IMaskInput}
			label={props.label ?? "CEP"}
			mask="00000-000"
			value={value ?? ""}
			onAccept={(_val, mask) => onChange?.(mask.unmaskedValue)}
			placeholder={props.placeholder ?? "00000-000"}
		/>
	);
});
