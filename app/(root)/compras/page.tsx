"use client";

import {
  ListSection,
  PageShell,
  SectionCard,
} from "@/components/layout/page-layout";
import { apiErrorMessage } from "@/lib/api-error-message";
import { useSuppliersControllerFindAll } from "@/openapi/client/suppliers/suppliers";
import { Button, Group, Select, SimpleGrid, Stack } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import {
  formatIsoDatePtBr,
  parseIsoDateToLocalDate,
  todayIsoDateLocal,
} from "@/lib/formatters/format-date";

type Row = {
  id: string;
  purchaseDate: string;
  supplierId: string;
  supplierName: string;
  total: number;
};

export default function PurchasesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [purchaseDate, setPurchaseDate] = useState<string | null>(null);
  const [supplierId, setSupplierId] = useState<string | null>(null);

  const {
    data: suppliers = [],
    isPending: suppliersLoading,
    isError: suppliersError,
    error: suppliersErrorObj,
  } = useSuppliersControllerFindAll();

  const supplierSelectData = useMemo(
    () =>
      suppliers.map((s) => ({
        value: s.id,
        label: s.legalName,
      })),
    [suppliers],
  );

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!supplierId) return;
    const supplier = suppliers.find((s) => s.id === supplierId);
    if (!supplier) return;
    setRows((r) => [
      ...r,
      {
        id: crypto.randomUUID(),
        purchaseDate: purchaseDate || todayIsoDateLocal(),
        supplierId,
        supplierName: supplier.legalName,
        total: 0,
      },
    ]);
    setPurchaseDate(null);
    setSupplierId(null);
  }

  function remove(id: string) {
    setRows((r) => r.filter((x) => x.id !== id));
  }

  return (
    <PageShell
      title="Compras (reposição)"
      description="Fornecedor carregado da API (GET /suppliers). Lista em memória nesta tela."
    >
      <SectionCard title="Novo" titleId="compras-novo">
        <form onSubmit={add}>
          <Stack gap="sm">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              <DatePickerInput
                label="Data"
                placeholder="DD/MM/AAAA"
                value={
                  purchaseDate ? parseIsoDateToLocalDate(purchaseDate) : null
                }
                onChange={(v) =>
                  setPurchaseDate(v ? dayjs(v).format("YYYY-MM-DD") : null)
                }
                valueFormat="DD/MM/YYYY"
                clearable
              />
              <Select
                label="Fornecedor"
                placeholder={
                  suppliersLoading
                    ? "Carregando fornecedores…"
                    : supplierSelectData.length === 0
                      ? "Nenhum fornecedor cadastrado"
                      : "Selecione"
                }
                data={supplierSelectData}
                value={supplierId}
                onChange={setSupplierId}
                searchable
                clearable
                nothingFoundMessage="Nenhum fornecedor encontrado."
                disabled={
                  suppliersLoading ||
                  suppliersError ||
                  supplierSelectData.length === 0
                }
                required
                error={
                  suppliersError && suppliersErrorObj
                    ? apiErrorMessage(suppliersErrorObj)
                    : undefined
                }
              />
            </SimpleGrid>
            <Group justify="flex-end">
              <Button type="submit">Adicionar</Button>
            </Group>
          </Stack>
        </form>
      </SectionCard>

      <ListSection title="Lista" headingId="compras-lista">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Data
                </th>
                <th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Fornecedor
                </th>
                <th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Total
                </th>
                <th
                  className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  aria-label="Ações"
                />
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr
                  key={o.id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
                    {formatIsoDatePtBr(o.purchaseDate)}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
                    {o.supplierName}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
                    {o.total.toFixed(2)}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
                    <button
                      type="button"
                      className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50"
                      onClick={() => remove(o.id)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ListSection>
    </PageShell>
  );
}
