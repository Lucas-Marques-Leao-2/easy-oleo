"use client";

import {
	Button,
	Group,
	Loader,
	Select,
	Stack,
	TagsInput,
	TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { CepInput } from "@/components/ui/cep-input";
import { CpfInput } from "@/components/ui/cpf-input";
import { useApiAuth } from "@/hooks/use-api-auth";
import { apiErrorMessage } from "@/lib/api-error-message";
import { fetchAddressByCep } from "@/lib/viacep";
import {
	getUsersControllerFindAllQueryKey,
	useUsersControllerCreate,
} from "@/openapi/client/users/users";
import type { CreateUserDto } from "@/openapi/client/models/createUserDto";
import type { CreateUserDtoRole } from "@/openapi/client/models/createUserDtoRole";

type FormValues = Omit<CreateUserDto, "phones" | "role"> & {
	phones: string[];
	role: CreateUserDtoRole;
};

function toDto(values: FormValues): CreateUserDto {
	return {
		name: values.name.trim(),
		cpf: values.cpf.replace(/\D/g, ""),
		street: values.street.trim(),
		number: values.number.trim(),
		complement: values.complement?.trim() || undefined,
		district: values.district?.trim() || undefined,
		city: values.city.trim(),
		state: values.state.trim().toUpperCase().slice(0, 2),
		zipCode: values.zipCode.replace(/\D/g, ""),
		email: values.email.trim(),
		role: values.role,
		phones: values.phones.length ? values.phones : undefined,
	};
}

const defaultValues: FormValues = {
	name: "",
	cpf: "",
	street: "",
	number: "",
	complement: "",
	district: "",
	city: "",
	state: "AL",
	zipCode: "",
	email: "",
	phones: [],
	role: "ATTENDANT",
};

export function CreateUserForm({ onSuccess }: { onSuccess?: () => void }) {
	const queryClient = useQueryClient();
	const auth = useApiAuth();

	const form = useForm<FormValues>({
		defaultValues,
		mode: "onBlur",
	});

	const { control } = form;
	const zipCodeWatched = useWatch({ control, name: "zipCode" });
	const [cepLoading, setCepLoading] = useState(false);
	const cepDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const cepRequestSeq = useRef(0);

	useEffect(() => {
		const clean = (zipCodeWatched ?? "").replace(/\D/g, "");
		if (clean.length !== 8) {
			setCepLoading(false);
			return;
		}
		if (cepDebounceRef.current) clearTimeout(cepDebounceRef.current);
		cepDebounceRef.current = setTimeout(() => {
			const seq = ++cepRequestSeq.current;
			const still = form.getValues("zipCode").replace(/\D/g, "");
			if (still !== clean) return;
			void (async () => {
				setCepLoading(true);
				const data = await fetchAddressByCep(clean);
				if (seq !== cepRequestSeq.current) return;
				const stillAfter = form.getValues("zipCode").replace(/\D/g, "");
				if (stillAfter !== clean) {
					setCepLoading(false);
					return;
				}
				if (data) {
					form.setValue("street", data.logradouro?.trim() || "", { shouldDirty: true });
					form.setValue("district", data.bairro?.trim() || "", { shouldDirty: true });
					form.setValue("city", data.localidade?.trim() || "", { shouldDirty: true });
					form.setValue("state", (data.uf || "AL").trim().toUpperCase().slice(0, 2), {
						shouldDirty: true,
					});
				}
				setCepLoading(false);
			})();
		}, 400);
		return () => {
			if (cepDebounceRef.current) clearTimeout(cepDebounceRef.current);
		};
	}, [zipCodeWatched, form]);

	const create = useUsersControllerCreate({
		mutation: {
			onSuccess: () => {
				void queryClient.invalidateQueries({ queryKey: getUsersControllerFindAllQueryKey() });
				form.reset(defaultValues);
				onSuccess?.();
				notifications.show({
					color: "teal",
					title: "Usuário",
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
		request: auth,
	});

	return (
		<form
			onSubmit={form.handleSubmit(async values => {
				await create.mutateAsync({ data: toDto(values) });
			})}
		>
			<Stack gap="sm">
				<TextInput
					label="Nome"
					required
					{...form.register("name", { required: "Obrigatório." })}
				/>
				<Group grow>
					<Controller
						name="cpf"
						control={control}
						rules={{ required: "Obrigatório." }}
						render={({ field, fieldState }) => (
							<CpfInput
								label="CPF"
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
								rightSection={cepLoading ? <Loader size="xs" /> : null}
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
					<TextInput label="Bairro" {...form.register("district")} />
					<TextInput
						label="Cidade"
						required
						{...form.register("city", { required: "Obrigatório." })}
					/>
				</Group>
				<Group grow>
					<TextInput
						label="UF"
						maxLength={2}
						required
						{...form.register("state", { required: "Obrigatório." })}
					/>
					<TextInput
						label="Complemento"
						{...form.register("complement")}
					/>
				</Group>
				<TextInput
					label="E-mail"
					type="email"
					required
					{...form.register("email", { required: "Obrigatório." })}
				/>
				<Select
					label="Perfil"
					data={[
						{ value: "ATTENDANT", label: "Atendente" },
						{ value: "SELLER", label: "Vendedor(a)" },
						{ value: "ADMIN", label: "Administrador(a)" },
					]}
					value={form.watch("role")}
					onChange={v =>
						form.setValue("role", v === "SELLER" || v === "ADMIN" ? v : "ATTENDANT")
					}
				/>
				<Controller
					name="phones"
					control={control}
					render={({ field, fieldState }) => (
						<TagsInput
							label="Telefones"
							description="Um por etiqueta (11 dígitos com DDD)."
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
