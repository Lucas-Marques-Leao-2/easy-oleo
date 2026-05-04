"use client";

import type { ReactNode } from "react";

import { MantineProviders } from "./mantine-provider";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<QueryProvider>
				<MantineProviders>{children}</MantineProviders>
			</QueryProvider>
		</ThemeProvider>
	);
}
