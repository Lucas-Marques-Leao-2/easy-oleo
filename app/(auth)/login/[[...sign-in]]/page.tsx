import { SignIn } from "@clerk/nextjs";

import { AuthClerkShell } from "@/components/auth/auth-clerk-shell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function LoginPage() {
	return (
		<AuthClerkShell
			title="Bem-vindo de volta"
			subtitle="Para entrar na sua conta, por favor, preencha os campos."
			footer={<></>}
		>
			<SignIn
				appearance={clerkAppearance}
				forceRedirectUrl="/"
				signUpUrl="/register"
			/>
		</AuthClerkShell>
	);
}
