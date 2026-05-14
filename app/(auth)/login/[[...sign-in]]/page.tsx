import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

import { AuthClerkShell } from "@/components/auth/auth-clerk-shell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function LoginPage() {
	return (
		<AuthClerkShell
			title="Bem-vindo de volta"
			subtitle="Para entrar na sua conta, por favor, preencha os campos."
			footer={
				<p className="mt-6 text-center text-xs text-slate-600">
					Não tem conta?{" "}
					<Link
						href="/register"
						className="font-medium text-main underline-offset-4 transition-opacity hover:opacity-90 hover:underline"
					>
						Criar conta
					</Link>
				</p>
			}
		>
			<SignIn
				appearance={clerkAppearance}
				forceRedirectUrl="/"
				signUpUrl="/register"
			/>
		</AuthClerkShell>
	);
}
