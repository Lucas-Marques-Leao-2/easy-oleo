import type { ReactNode } from "react";

import { MainNav } from "@/components/layout/main-nav";

export default function RootGroupLayout({ children }: { children: ReactNode }) {
	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden bg-white dark:bg-slate-950">
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="h-full w-[150vw] rounded-b-full bg-gradient-to-t from-main/25 from-20% to-transparent to-90% dark:from-main/35 sm:w-full" />
			</div>

			<header className="border-b border-slate-200/90 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
				<div className="mx-auto max-w-5xl">
					<MainNav />
				</div>
			</header>

			<div className="grow">{children}</div>

			<footer className="border-t border-slate-200 py-4 text-center text-xs text-typography-lv3 dark:border-slate-800 dark:text-slate-500">
				Easy Óleo
			</footer>
		</div>
	);
}
