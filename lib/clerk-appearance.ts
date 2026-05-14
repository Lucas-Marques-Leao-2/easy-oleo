export const clerkAppearance = {
	elements: {
		rootBox: "mx-auto w-full",
		card: "rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10",
		cardBox: "shadow-none",
		footer: "bg-transparent",
		footerAction: "justify-center border-t border-slate-200 !pt-4",
		footerActionText: "!text-slate-600",
		footerActionLink: "!font-medium !text-main hover:!opacity-90",
		header: "hidden",
		headerTitle: "hidden",
		headerSubtitle: "hidden",
		logoBox: "hidden",
		socialButtonsBlockButton:
			"border border-slate-200 bg-white !text-black shadow-sm hover:bg-slate-50",
		socialButtonsBlockButton__google:
			"border border-slate-200 bg-white !text-black shadow-sm hover:bg-slate-50",
		formButtonPrimary: "bg-main font-medium text-white shadow-none hover:opacity-90",
		formFieldInput:
			"!border-slate-200 !bg-white !text-slate-900 !shadow-none placeholder:!text-slate-400",
		formFieldLabel: "!text-slate-700",
		identityPreviewText: "text-slate-800",
		identityPreviewEditButton: "text-main",
		dividerLine: "bg-slate-200",
		dividerText: "!text-slate-500",
	},
	variables: {
		colorBackground: "#ffffff",
		colorInputBackground: "#ffffff",
		colorInputText: "#0f172a",
		colorPrimary: "#4361EE",
		colorText: "#0f172a",
		colorTextSecondary: "#64748b",
		colorNeutral: "#94a3b8",
		borderRadius: "0.75rem",
	},
} as const;
