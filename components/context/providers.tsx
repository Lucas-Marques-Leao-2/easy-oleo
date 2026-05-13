"use client";

import type { ReactNode } from "react";

import { JwtProvider } from "./jwt-provider";
import { MantineProviders } from "./mantine-provider";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { UserProvider } from "./user-provider";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<QueryProvider>
				<JwtProvider>
					<UserProvider>
						<MantineProviders>{children}</MantineProviders>
					</UserProvider>
				</JwtProvider>
			</QueryProvider>
		</ThemeProvider>
	);
}
