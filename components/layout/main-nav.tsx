"use client";

import { Burger, Drawer, NavLink, Stack } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { IconType } from "react-icons";
import {
	HiArrowDownTray,
	HiBuildingOffice2,
	HiCube,
	HiShoppingCart,
	HiUserGroup,
	HiUsers,
} from "react-icons/hi2";

import { MODULE_LINKS } from "@/lib/nav";

import { ThemeToggle } from "./theme-toggle";

const NAV_ICONS: Record<(typeof MODULE_LINKS)[number]["href"], IconType> = {
	"/clientes": HiUserGroup,
	"/fornecedores": HiBuildingOffice2,
	"/produtos": HiCube,
	"/usuarios": HiUsers,
	"/pedidos-venda": HiShoppingCart,
	"/compras": HiArrowDownTray,
};

function isActivePath(pathname: string, href: string) {
	if (href === "/") return pathname === "/";
	return pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav() {
	const pathname = usePathname();
	const [opened, { toggle, close }] = useDisclosure(false);
	const isDesktop = useMediaQuery("(min-width: 48em)");

	useEffect(() => {
		close();
	}, [pathname, close]);

	useEffect(() => {
		if (isDesktop) close();
	}, [isDesktop, close]);

	return (
		<>
			<div className="flex w-full min-w-0 flex-wrap items-center gap-3 sm:gap-4">
				<Link
					href="/"
					className="shrink-0 text-lg font-semibold text-main dark:text-main"
				>
					Easy Óleo
				</Link>

				<nav
					className="hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-x-1 gap-y-1 md:flex lg:gap-x-2"
					aria-label="Módulos"
				>
					{MODULE_LINKS.map(m => {
						const active = isActivePath(pathname, m.href);
						return (
							<Link
								key={m.href}
								href={m.href}
								className={`rounded-md px-2.5 py-1.5 text-sm transition lg:px-3 ${
									active
										? "bg-main/10 font-medium text-main dark:bg-main/15 dark:text-main"
										: "text-typography-lv2 hover:bg-slate-100 hover:text-main dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-main"
								}`}
							>
								{m.label}
							</Link>
						);
					})}
				</nav>

				<div className="ml-auto flex shrink-0 items-center gap-2">
					<ThemeToggle />
					<Burger
						opened={opened}
						onClick={toggle}
						hiddenFrom="md"
						size="sm"
						aria-label={opened ? "Fechar menu" : "Abrir menu"}
						className="text-typography-lv2 dark:text-slate-200"
					/>
				</div>
			</div>

			<Drawer
				opened={opened}
				onClose={close}
				title="Navegação"
				padding="md"
				size="min(100%, 20rem)"
				position="right"
				hiddenFrom="md"
				zIndex={200}
				overlayProps={{ opacity: 0.45, blur: 2 }}
				classNames={{
					content: "dark:bg-slate-900",
					header: "dark:bg-slate-900 dark:border-slate-800",
					body: "pt-2",
				}}
			>
				<Stack gap={4}>
					{MODULE_LINKS.map(m => {
						const Icon = NAV_ICONS[m.href];
						const active = isActivePath(pathname, m.href);
						return (
							<NavLink
								key={m.href}
								component={Link}
								href={m.href}
								label={m.label}
								leftSection={
									Icon ? (
										<Icon
											className="h-[1.1rem] w-[1.1rem] shrink-0 opacity-90"
											aria-hidden
										/>
									) : null
								}
								active={active}
								onClick={close}
								classNames={{
									root: active
										? "bg-main/12 text-main dark:bg-main/20"
										: undefined,
								}}
							/>
						);
					})}
				</Stack>
			</Drawer>
		</>
	);
}
