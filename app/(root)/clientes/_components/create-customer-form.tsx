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
import { CpfCnpjInput } from "@/components/ui/cpf-cnpj-input";
import { useApiAuth } from "@/hooks/use-api-auth";
import { apiErrorMessage } from "@/lib/api-error-message";
import { fetchAddressByCep } from "@/lib/viacep";
import {
  getCustomersControllerFindAllQueryKey,
  useCustomersControllerCreate,
} from "@/openapi/client/customers/customers";
import type { CreateCustomerDto } from "@/openapi/client/models/createCustomerDto";

type CreateCustomerFormValues = Omit<CreateCustomerDto, "phones"> & {
  phones: string[];
};

function toCreateCustomerDto(
  values: CreateCustomerFormValues,
): CreateCustomerDto {
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
  const auth = useApiAuth();

  const form = useForm<CreateCustomerFormValues>({
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
          form.setValue("street", data.logradouro?.trim() || "", {
            shouldDirty: true,
          });
          form.setValue("district", data.bairro?.trim() || "", {
            shouldDirty: true,
          });
          form.setValue("city", data.localidade?.trim() || "", {
            shouldDirty: true,
          });
          form.setValue(
            "state",
            (data.uf || "AL").trim().toUpperCase().slice(0, 2),
            {
              shouldDirty: true,
            },
          );
        } else {
          notifications.show({
            color: "yellow",
            title: "CEP",
            message: "Não foi possível localizar este CEP.",
          });
        }
        setCepLoading(false);
      })();
    }, 400);

    return () => {
      if (cepDebounceRef.current) clearTimeout(cepDebounceRef.current);
    };
  }, [zipCodeWatched, form]);

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
          onChange={(v) =>
            form.setValue("type", v === "PJ" || v === "PF" ? v : "PF")
          }
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
