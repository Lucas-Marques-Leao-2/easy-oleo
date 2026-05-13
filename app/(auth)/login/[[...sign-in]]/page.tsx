// import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

// const clerkAppearance = {
// 	elements: {
// 		card: "rounded-xl border border-slate-700/80 bg-slate-900/95 shadow-xl shadow-black/20",
// 		cardBox: "shadow-none",
// 		footer: "bg-transparent",
// 		footerAction: "justify-center border-t border-slate-700/60 !pt-4",
// 		headerSubtitle: "text-left text-slate-400",
// 		headerTitle: "text-left text-xl font-semibold text-white",
// 		logoBox: "hidden",
// 		socialButtonsBlockButton__google:
// 			"bg-white text-slate-900 hover:bg-slate-100 border border-slate-200",
// 		formButtonPrimary: "bg-main hover:opacity-95 text-white",
// 		identityPreviewText: "text-slate-200",
// 		identityPreviewEditButton: "text-main",
// 	},
// 	variables: {
// 		colorBackground: "#020617",
// 		colorInputBackground: "#f8fafc",
// 		colorInputText: "#0f172a",
// 		colorPrimary: "#4361EE",
// 		colorText: "#f1f5f9",
// 		colorTextSecondary: "#94a3b8",
// 		colorNeutral: "#64748b",
// 		borderRadius: "0.75rem",
// 	},
// } as const;

export default function LoginPage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center px-4 py-10 md:px-8">
			<div className="mb-8 flex flex-col items-center text-center">
				<Link
					href="/"
					className="mb-4 text-2xl font-bold tracking-tight text-main"
				>
					Easy Óleo
				</Link>
				<h1 className="text-balance text-2xl font-bold text-white md:text-3xl">Bem-vindo de volta</h1>
				<p className="mt-2 max-w-md text-pretty text-sm text-slate-400 md:text-base">
					Entre com sua conta para acessar o painel de distribuição.
				</p>
			</div>
			<div className="flex w-full max-w-md flex-col items-stretch">
				<p className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-8 text-center text-sm text-slate-300">
					Login com Clerk desativado temporariamente.
				</p>
				{/* <SignIn
					appearance={clerkAppearance}
					forceRedirectUrl="/"
					signUpUrl="/register"
				/> */}
				<p className="mt-6 text-center text-xs text-slate-500">
					Não tem conta?{" "}
					<Link
						href="/register"
						className="font-medium text-main underline-offset-4 hover:underline"
					>
						Criar conta
					</Link>
				</p>
			</div>
		</main>
	);
}
