"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useUser } from "@/components/context/user-provider";
import { moduleLinksVisibleForAppUser } from "@/lib/nav";

export function HomeModuleLinks() {
	const { user } = useUser();
	const links = useMemo(() => moduleLinksVisibleForAppUser(user), [user]);

	return (
		<ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{links.map(m => (
				<li key={m.href}>
					<Link
						href={m.href}
						className="flex rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-medium text-main shadow-sm transition hover:border-main/40 hover:bg-main/5 dark:border-slate-700 dark:bg-slate-900/80 dark:text-main dark:hover:bg-main/10"
					>
						{m.label}
					</Link>
				</li>
			))}
		</ul>
	);
}
