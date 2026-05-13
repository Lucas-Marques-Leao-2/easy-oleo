"use client";

import {
  ListSection,
  PageShell,
  SectionCard,
} from "@/components/layout/page-layout";
import {
  Button,
  Group,
  NumberInput,
  SimpleGrid,
  Stack,
  TextInput,
} from "@mantine/core";
import { useState } from "react";

function isOilLubricantType(type: string): boolean {
  const t = type.trim().toLowerCase();
  return t === "óleo" || t === "oleo";
}

type Row = {
  id: string;
  code: string;
  name: string;
  brand: string;
  type: string;
  viscosity: string;
  unit: string;
  salePrice: number;
  minStock: number;
};

const SEED: Row[] = [
  {
    id: "seed-p1",
    code: "OLEO-5W30-1L",
    name: "Óleo motor sintético 5W30",
    brand: "Mobil",
    type: "óleo",
    viscosity: "5W-30",
    unit: "L",
    salePrice: 45.9,
    minStock: 24,
  },
];

export default function ProductsPage() {
  const [rows, setRows] = useState<Row[]>(SEED);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [viscosity, setViscosity] = useState("");
  const [unit, setUnit] = useState("L");
  const [salePrice, setSalePrice] = useState<number | string>("");
  const [minStock, setMinStock] = useState<number | string>("");

  const showViscosity = isOilLubricantType(type);

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;
    const price = typeof salePrice === "number" ? salePrice : Number(salePrice);
    const min = typeof minStock === "number" ? minStock : Number(minStock);
    setRows((r) => [
      ...r,
      {
        id: crypto.randomUUID(),
        code: code.trim(),
        name: name.trim(),
        brand: brand.trim() || "—",
        type: type.trim() || "—",
        viscosity: showViscosity ? viscosity.trim() : "",
        unit: unit.trim() || "un",
        salePrice: Number.isFinite(price) ? price : 0,
        minStock: Number.isFinite(min) ? min : 0,
      },
    ]);
    setCode("");
    setName("");
    setBrand("");
    setType("");
    setViscosity("");
    setUnit("L");
    setSalePrice("");
    setMinStock("");
  }

  function remove(id: string) {
    setRows((r) => r.filter((x) => x.id !== id));
  }

  return (
    <PageShell
      title="Produtos"
      description="Cadastro local (RF01: código, nome, marca, tipo, viscosidade quando for óleo, unidade, preço de venda, estoque mínimo)."
    >
      <SectionCard title="Novo" titleId="produtos-novo">
        <form onSubmit={add}>
          <Stack gap="sm">
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
              <TextInput
                label="Código"
                required
                value={code}
                onChange={(e) => setCode(e.currentTarget.value)}
              />
              <TextInput
                label="Nome"
                required
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
              />
              <TextInput
                label="Marca"
                value={brand}
                onChange={(e) => setBrand(e.currentTarget.value)}
              />
              <TextInput
                label="Tipo"
                description="Ex.: óleo, graxa, aditivo, fluido, outro (RN28)."
                value={type}
                onChange={(e) => setType(e.currentTarget.value)}
              />
              {showViscosity && (
                <TextInput
                  label="Viscosidade"
                  value={viscosity}
                  onChange={(e) => setViscosity(e.currentTarget.value)}
                />
              )}
              <TextInput
                label="Unidade"
                value={unit}
                onChange={(e) => setUnit(e.currentTarget.value)}
              />
              <NumberInput
                label="Preço venda"
                value={salePrice}
                onChange={setSalePrice}
                min={0}
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator="."
                decimalSeparator=","
              />
              <NumberInput
                label="Estoque mín."
                value={minStock}
                onChange={setMinStock}
                min={0}
                decimalScale={0}
              />
            </SimpleGrid>
            <Group justify="flex-end">
              <Button type="submit">Adicionar</Button>
            </Group>
          </Stack>
        </form>
      </SectionCard>

      <ListSection title="Lista" headingId="produtos-lista">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Código
                </th>
                <th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Nome
                </th>
                <th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Marca
                </th>
                <th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Tipo
                </th>
                <th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Visc.
                </th>
                <th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Un.
                </th>
                <th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Preço
                </th>
                <th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Mín.
                </th>
                <th
                  className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  aria-label="Ações"
                />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr
                  key={p.id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
                    {p.code}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
                    {p.name}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
                    {p.brand}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
                    {p.type}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
                    {p.viscosity.trim() ? p.viscosity : "—"}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
                    {p.unit}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
                    {p.salePrice.toFixed(2)}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
                    {p.minStock}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
                    <Button
                      type="button"
                      variant="light"
                      color="red"
                      size="xs"
                      onClick={() => remove(p.id)}
                    >
                      Remover
                    </Button>
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
