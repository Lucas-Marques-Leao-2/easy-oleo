"use client";

import {
  ListSection,
  PageShell,
} from "@/components/layout/page-layout";
import { CpfInput } from "@/components/ui/cpf-input";
import { formatCPF } from "@/lib/format-brazilian-doc";
import {
  Button,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  TextInput,
} from "@mantine/core";
import { useState } from "react";

type UserRow = {
  id: string;
  name: string;
  email: string;
  cpf: string;
};

const INITIAL_ROWS: UserRow[] = [
  {
    id: "seed-u1",
    name: "Carla Administradora",
    email: "carla@easyoleo.local",
    cpf: "52998224725",
  },
];

export default function UsersPage() {
  const [rows, setRows] = useState<UserRow[]>(INITIAL_ROWS);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");

  const [opened, setOpened] = useState(false);

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
      },
    ]);

    setName("");
    setEmail("");
    setCpf("");

    setOpened(false);
  }

  function handleRemoveRow(id: string) {
    setRows((prev) => prev.filter((row) => row.id !== id));
  }

  return (
    <PageShell
      title="Usuários"
      description="Lista local (RF09). Perfil/cargo (RN14) fica no cadastro real via API, não neste mock."
    >
      <ListSection
        title="Lista"
        headingId="usuarios-lista"
      >
        <div className="mb-4 flex justify-end">
          <Button onClick={() => setOpened(true)}>
            Adicionar
          </Button>
        </div>

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
                    <Button
                      type="button"
                      variant="light"
                      color="red"
                      size="xs"
                      onClick={() => handleRemoveRow(row.id)}
                    >
                      Remover
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title="Adicionar usuário"
          centered
          size="lg"
        >
          <form onSubmit={handleAdd}>
            <Stack gap="sm">
              <SimpleGrid
                cols={{ base: 1, sm: 2, lg: 3 }}
                spacing="sm"
              >
                <TextInput
                  label="Nome"
                  required
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                />

                <TextInput
                  label="E-mail"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />

                <CpfInput
                  label="CPF"
                  value={cpf}
                  onChange={setCpf}
                />
              </SimpleGrid>

              <Group justify="flex-end">
                <Button type="submit">
                  Adicionar
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </ListSection>
    </PageShell>
  );
}