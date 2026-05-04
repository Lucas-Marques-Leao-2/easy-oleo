"use client";

import { Controller, useForm } from "react-hook-form";

import { CepInput } from "@/components/ui/cep-input";
import { CpfCnpjInput } from "@/components/ui/cpf-cnpj-input";
import { apiErrorMessage } from "@/lib/api-error-message";
import {
	getCustomersControllerFindAllQueryKey,
	useCustomersControllerCreate,
} from "@/openapi/client/customers/customers";
import type { CreateCustomerDto } from "@/openapi/client/models/createCustomerDto";
import { Button, Group, Select, Stack, TagsInput, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";

type CreateCustomerFormValues = Omit<CreateCustomerDto, "phones"> & {
	phones: string[];
};

function toCreateCustomerDto(values: CreateCustomerFormValues): CreateCustomerDto {
	const doc = values.document.replace(/\D/g, "");
	return {
		type: values.type,
		name: values.name.trim(),
		document: doc,
		street: values.street.trim(),
		number: values.number.trim(),
		complement: values.complement?.trim() || undefined,
		district: values.district?.trim() || undefined,
		city: values.city.trim(),
		state: values.state.trim().toUpperCase(),
		zipCode: values.zipCode.replace(/\D/g, ""),
		email: values.email.trim(),
		phones: values.phones.length ? values.phones : undefined,
	};
}

const defaultValues: CreateCustomerFormValues = {
	type: "PF",
	name: "",
	document: "",
	street: "",
	number: "",
	complement: "",
	district: "",
	city: "",
	state: "AL",
	zipCode: "",
	email: "",
	phones: [],
};

export function CreateCustomerForm() {
	const queryClient = useQueryClient();

	const form = useForm<CreateCustomerFormValues>({
		defaultValues,
		mode: "onBlur",
	});

	const { control } = form;

	const create = useCustomersControllerCreate({
		mutation: {
			onSuccess: () => {
				void queryClient.invalidateQueries({
					queryKey: getCustomersControllerFindAllQueryKey(),
				});
				form.reset(defaultValues);
				notifications.show({
					color: "teal",
					title: "Cliente",
					message: "Cadastro realizado.",
				});
			},
			onError: err => {
				notifications.show({
					color: "red",
					title: "Erro",
					message: apiErrorMessage(err),
				});
			},
		},
	});

	return (
		<form
			onSubmit={form.handleSubmit(async values => {
				await create.mutateAsync({ data: toCreateCustomerDto(values) });
			})}
		>
			<Stack gap="sm">
				<Select
					label="Tipo"
					data={[
						{ value: "PF", label: "Pessoa física" },
						{ value: "PJ", label: "Pessoa jurídica" },
					]}
					value={form.watch("type") ?? "PF"}
					onChange={v => form.setValue("type", v === "PJ" || v === "PF" ? v : "PF")}
				/>
				<TextInput
					label="Nome / razão social"
					required
					{...form.register("name", { required: "Obrigatório." })}
				/>
				<Group grow>
					<Controller
						name="document"
						control={control}
						rules={{ required: "Obrigatório." }}
						render={({ field, fieldState }) => (
							<CpfCnpjInput
								label="CPF ou CNPJ"
								required
								error={fieldState.error?.message}
								value={field.value}
								onChange={field.onChange}
							/>
						)}
					/>
					<Controller
						name="zipCode"
						control={control}
						rules={{ required: "Obrigatório." }}
						render={({ field, fieldState }) => (
							<CepInput
								label="CEP"
								required
								error={fieldState.error?.message}
								value={field.value}
								onChange={field.onChange}
							/>
						)}
					/>
				</Group>
				<Group grow>
					<TextInput
						label="Logradouro"
						required
						{...form.register("street", { required: "Obrigatório." })}
					/>
					<TextInput
						label="Número"
						required
						{...form.register("number", { required: "Obrigatório." })}
					/>
				</Group>
				<Group grow>
					<TextInput
						label="Complemento"
						{...form.register("complement")}
					/>
					<TextInput
						label="Bairro"
						{...form.register("district")}
					/>
				</Group>
				<Group grow>
					<TextInput
						label="Cidade"
						required
						{...form.register("city", { required: "Obrigatório." })}
					/>
					<TextInput
						label="UF"
						maxLength={2}
						required
						{...form.register("state", { required: "Obrigatório." })}
					/>
				</Group>
				<TextInput
					label="E-mail"
					type="email"
					required
					{...form.register("email", { required: "Obrigatório." })}
				/>
				<Controller
					name="phones"
					control={control}
					render={({ field, fieldState }) => (
						<TagsInput
							label="Telefones"
							description="Um telefone por pill (11 dígitos com DDD)."
							placeholder="82999998888"
							splitChars={[" ", ",", ";"]}
							error={fieldState.error?.message}
							value={field.value ?? []}
							onChange={field.onChange}
						/>
					)}
				/>
				<Group justify="flex-end">
					<Button
						loading={create.isPending}
						type="submit"
					>
						Adicionar
					</Button>
				</Group>
			</Stack>
		</form>
	);
}
