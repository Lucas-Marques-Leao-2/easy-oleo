"use client";

import { useTheme } from "next-themes";
import { type ReactNode, useEffect } from "react";

import { MantineProvider, createTheme, useMantineColorScheme } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";

const theme = createTheme({
	primaryColor: "indigo",
	defaultRadius: "md",
});

function MantineNextThemesSync() {
	const { resolvedTheme } = useTheme();
	const { setColorScheme } = useMantineColorScheme();

	useEffect(() => {
		if (resolvedTheme === undefined) return;
		setColorScheme(resolvedTheme === "dark" ? "dark" : "light");
	}, [resolvedTheme, setColorScheme]);

	return null;
}

export function MantineProviders({ children }: { children: ReactNode }) {
	return (
		<MantineProvider
			defaultColorScheme="light"
			theme={theme}
		>
			<DatesProvider settings={{ locale: "pt-br" }}>
				<MantineNextThemesSync />
				<Notifications
					position="top-right"
					zIndex={4000}
				/>
				{children}
			</DatesProvider>
		</MantineProvider>
	);
}
