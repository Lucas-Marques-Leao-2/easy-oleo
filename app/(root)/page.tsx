import { HomeMain } from "@/components/layout/page-layout";
import { HomeModuleLinks } from "@/components/home/home-module-links";

export default function HomePage() {
	return (
		<HomeMain>
			<header className="space-y-4">
				<h1 className="text-2xl font-bold tracking-tight text-typography-lv1 dark:text-slate-100 sm:text-3xl">
					Easy Óleo — distribuição de óleo automotivo
				</h1>
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
