"use client";

import { CepInput } from "@/components/ui/cep-input";
import { CnpjInput } from "@/components/ui/cnpj-input";
import { useApiAuth } from "@/hooks/use-api-auth";
import { apiErrorMessage } from "@/lib/api-error-message";
import type { CreateSupplierDto } from "@/openapi/client/models/createSupplierDto";
import {
	getSuppliersControllerFindAllQueryKey,
	useSuppliersControllerCreate,
} from "@/openapi/client/suppliers/suppliers";
import { Button, Group, Stack, TagsInput, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

type CreateSupplierFormValues = Omit<CreateSupplierDto, "phones"> & {
	phones: string[];
};

function toCreateSupplierDto(values: CreateSupplierFormValues): CreateSupplierDto {
	return {
		legalName: values.legalName.trim(),
		cnpj: values.cnpj.replace(/\D/g, ""),
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

const defaultValues: CreateSupplierFormValues = {
	legalName: "",
	cnpj: "",
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

export function CreateSupplierForm() {
	const queryClient = useQueryClient();
	const auth = useApiAuth();

	const form = useForm<CreateSupplierFormValues>({
		defaultValues,
		mode: "onBlur",
	});

	const { control } = form;

	const create = useSuppliersControllerCreate({
		mutation: {
			onSuccess: () => {
				void queryClient.invalidateQueries({
					queryKey: getSuppliersControllerFindAllQueryKey(),
				});
				form.reset(defaultValues);
				notifications.show({
					color: "teal",
					title: "Fornecedor",
					message: "Cadastro realizado.",
				});
			},
			onError: (err) => {
				notifications.show({
					color: "red",
					title: "Erro",
					message: apiErrorMessage(err),
				});
			},
		},
		request: auth,
	});

	return (
		<form
			onSubmit={form.handleSubmit(async (values) => {
				await create.mutateAsync({ data: toCreateSupplierDto(values) });
			})}
		>
			<Stack gap="sm">
				<TextInput
					label="Razão social"
					placeholder="Nome da empresa"
					required
					{...form.register("legalName", { required: "Obrigatório." })}
				/>
				<Group grow>
					<Controller
						name="cnpj"
						control={control}
						rules={{ required: "Obrigatório." }}
						render={({ field, fieldState }) => (
							<CnpjInput
								label="CNPJ"
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
				<TextInput label="Bairro" {...form.register("district")} />
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
					<Button loading={create.isPending} type="submit">
						Adicionar
					</Button>
				</Group>
			</Stack>
		</form>
	);
}
