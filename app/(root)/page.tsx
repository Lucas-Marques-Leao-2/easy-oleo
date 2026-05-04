import Link from "next/link";

import { MODULE_LINKS } from "./_config/nav";

export default function HomePage() {
	return (
		<main className="relative z-0 mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10">
			<header>
				<h1 className="text-2xl font-bold tracking-tight text-typography-lv1 dark:text-slate-100">
					Easy Óleo — distribuição de óleo automotivo
				</h1>
				<p
					className="mt-4 rounded-lg border border-amber-300/80 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-700/50 dark:bg-amber-950/40 dark:text-amber-100"
					role="status"
				>
					<strong>Easy Óleo:</strong> nesta versão de desenvolvimento, alguns módulos usam dados em memória (
					<code className="rounded bg-amber-100/80 px-1 dark:bg-amber-900/60">useState</code>) e não a API.
				</p>
			</header>

			<section aria-labelledby="modules-heading">
				<h2
					id="modules-heading"
					className="mb-4 text-base font-semibold text-typography-lv2 dark:text-slate-300"
				>
					Acesso rápido
				</h2>
				<ul className="grid gap-3 sm:grid-cols-2">
					{MODULE_LINKS.map(m => (
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
			</section>
		</main>
	);
}
