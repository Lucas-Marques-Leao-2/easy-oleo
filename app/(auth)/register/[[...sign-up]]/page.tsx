import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

import { AuthClerkShell } from "@/components/auth/auth-clerk-shell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function RegisterPage() {
	return (
		<AuthClerkShell
			title="Criar conta"
			subtitle="Para cadastrar-se, por favor, preencha os campos."
			footer={
				<p className="mt-6 text-center text-xs text-slate-600">
					Já tem conta?{" "}
					<Link
						href="/login"
						className="font-medium text-main underline-offset-4 transition-opacity hover:opacity-90 hover:underline"
					>
						Entrar
					</Link>
				</p>
			}
		>
			<SignUp
				appearance={clerkAppearance}
				forceRedirectUrl="/"
				signInUrl="/login"
			/>
		</AuthClerkShell>
	);
}
