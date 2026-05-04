import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/layout/theme-toggle";

import { MODULE_LINKS } from "./_config/nav";

export default function RootGroupLayout({ children }: { children: ReactNode }) {
	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden bg-white dark:bg-slate-950">
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="h-full w-[150vw] rounded-b-full bg-gradient-to-t from-main/25 from-20% to-transparent to-90% dark:from-main/35 sm:w-full" />
			</div>

			<header className="border-b border-slate-200/90 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
				<div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
					<Link
						href="/"
						className="text-lg font-semibold text-main dark:text-main"
					>
						Easy Óleo
					</Link>
					<nav
						className="flex flex-1 flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"
						aria-label="Módulos"
					>
						{MODULE_LINKS.map(m => (
							<Link
								key={m.href}
								href={m.href}
								className="text-typography-lv2 transition hover:text-main dark:text-slate-300 dark:hover:text-main"
							>
								{m.label}
							</Link>
						))}
					</nav>
					<ThemeToggle />
				</div>
			</header>

			<div className="grow">{children}</div>

			<footer className="border-t border-slate-200 py-4 text-center text-xs text-typography-lv3 dark:border-slate-800 dark:text-slate-500">
				Easy Óleo
			</footer>
		</div>
	);
}
