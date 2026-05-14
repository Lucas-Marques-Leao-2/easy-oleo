import Link from "next/link";
import type { ReactNode } from "react";

type AuthClerkShellProps = {
	title: string;
	subtitle: string;
	children: ReactNode;
	footer?: ReactNode;
};

export function AuthClerkShell({ title, subtitle, children, footer }: AuthClerkShellProps) {
	return (
		<main className="flex min-h-screen flex-col bg-slate-100 md:flex-row">
			<section className="flex w-full flex-col items-center justify-center px-6 py-8 sm:px-12">
				<div className="mb-4 max-lg:mt-3 w-full text-center md:mb-6">
					<h1 className="text-3xl font-bold tracking-tight text-main md:text-4xl">
						<Link href="/" className="text-main no-underline transition-opacity hover:opacity-90">
							Easy Óleo
						</Link>
					</h1>
				</div>
				<h2 className="mb-3 w-full text-center text-xl font-bold tracking-tight text-slate-900 md:text-3xl">
					{title}
				</h2>
				<p className="mb-5 w-full max-w-md text-pretty text-center text-sm text-slate-600 md:text-base">
					{subtitle}
				</p>
				<div className="flex w-full max-w-md flex-col items-center justify-center gap-4">{children}</div>
				{footer}
			</section>
		</main>
	);
}
