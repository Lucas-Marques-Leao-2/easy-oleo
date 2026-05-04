import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Providers } from "@/components/context/providers";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

import "./globals.css";

export const metadata: Metadata = {
	title: "Easy Óleo",
	description: "Easy Óleo - distribuição de óleo automotivo",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="pt-BR"
			{...mantineHtmlProps}
		>
			<head>
				<ColorSchemeScript defaultColorScheme="light" />
			</head>
			<body className="min-h-screen font-sans antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
