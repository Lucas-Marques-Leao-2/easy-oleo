import { SignUp } from "@clerk/nextjs";

import { AuthClerkShell } from "@/components/auth/auth-clerk-shell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function RegisterPage() {
	return (
		<AuthClerkShell
			title="Criar conta"
			subtitle="Para cadastrar-se, por favor, preencha os campos."
			footer={<></>}
		>
			<SignUp
				appearance={clerkAppearance}
				forceRedirectUrl="/"
				signInUrl="/login"
			/>
		</AuthClerkShell>
	);
}
