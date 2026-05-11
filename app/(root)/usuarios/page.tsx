"use client";

import {
  ListSection,
  PageShell,
  SectionCard,
} from "@/components/layout/page-layout";
import { CpfInput } from "@/components/ui/cpf-input";
import { formatCPF } from "@/lib/format-brazilian-doc";
import { UpdateUserDtoRole as UserRole } from "@/openapi/client/models";
import { useState } from "react";

type UserRow = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
};

const INITIAL_ROWS: UserRow[] = [
  {
    id: "seed-u1",
    name: "Carla Administradora",
    email: "carla@easyoleo.local",
    cpf: "52998224725",
    role: "ADMIN",
  },
];

const ROLE_LABELS_PT: Record<UserRole, string> = {
  ATTENDANT: "Atendente",
  SELLER: "Vendedor(a)",
  ADMIN: "Administrador(a)",
};

const inputClass =
  "min-w-0 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-typography-lv1 shadow-sm focus:border-main focus:outline-none focus:ring-1 focus:ring-main dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100";

const labelClass =
  "flex flex-col gap-1 text-xs font-medium text-typography-lv2 dark:text-slate-400";

export default function UsersPage() {
  const [rows, setRows] = useState<UserRow[]>(INITIAL_ROWS);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [role, setRole] = useState<UserRole>("ATTENDANT");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim(),
        cpf: cpf.replace(/\D/g, "") || "—",
        role,
      },
    ]);
    setName("");
    setEmail("");
    setCpf("");
    setRole("ATTENDANT");
  }

  function handleRemoveRow(id: string) {
    setRows((prev) => prev.filter((row) => row.id !== id));
  }

  return (
    <PageShell
      title="Usuários"
      description="Lista local em memória nesta tela de desenvolvimento."
    >
      <SectionCard title="Novo" titleId="usuarios-novo">
        <form onSubmit={handleAdd}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className={labelClass}>
              Nome
              <input
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className={labelClass}>
              E-mail
              <input
                className={inputClass}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <div className="min-w-0 sm:col-span-2 lg:col-span-1">
              <CpfInput label="CPF" value={cpf} onChange={setCpf} size="xs" />
            </div>
            <label className={`${labelClass} sm:col-span-2 lg:col-span-1`}>
              Cargo
              <select
                className={inputClass}
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="ATTENDANT">{ROLE_LABELS_PT.ATTENDANT}</option>
                <option value="SELLER">{ROLE_LABELS_PT.SELLER}</option>
                <option value="ADMIN">{ROLE_LABELS_PT.ADMIN}</option>
              </select>
            </label>
            <div className="flex items-end sm:col-span-2 lg:col-span-3">
              <button
                type="submit"
                className="rounded-md border border-main/40 bg-main/10 px-4 py-2 text-sm font-medium text-main transition hover:bg-main/15 dark:bg-main/20 dark:hover:bg-main/25"
              >
                Adicionar
              </button>
            </div>
          </div>
        </form>
      </SectionCard>

      <ListSection title="Lista" headingId="usuarios-lista">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Nome
                </th>
                <th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  E-mail
                </th>
                <th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  CPF
                </th>
                <th className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Cargo
                </th>
                <th
                  className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  aria-label="Ações"
                />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
                    {row.name}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
                    {row.email}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
                    {row.cpf === "—" ? "—" : formatCPF(row.cpf)}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
                    {ROLE_LABELS_PT[row.role]}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 align-top text-typography-lv1 dark:border-slate-700 dark:text-slate-200">
                    <button
                      type="button"
                      className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50"
                      onClick={() => handleRemoveRow(row.id)}
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
