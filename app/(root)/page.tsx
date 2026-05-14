import { HomeMain } from "@/components/layout/page-layout";
import { HomeModuleLinks } from "@/components/home/home-module-links";

export default function HomePage() {
	return (
		<HomeMain>
			<header className="space-y-4">
				<h1 className="text-2xl font-bold tracking-tight text-typography-lv1 dark:text-slate-100 sm:text-3xl">
					Easy Óleo — distribuição de óleo automotivo
				</h1>
				<p
					className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
					role="status"
				>
					Acesso restrito a usuários autenticados. O perfil na API é criado/atualizado pelo webhook Clerk
					(configurado no backend).
				</p>
			</header>

			<section aria-labelledby="modules-heading">
				<h2
					id="modules-heading"
					className="mb-4 text-base font-semibold text-typography-lv2 dark:text-slate-300"
				>
					Acesso rápido
				</h2>
				<HomeModuleLinks />
			</section>
		</HomeMain>
	);
}
