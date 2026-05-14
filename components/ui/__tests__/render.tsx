import { MantineProvider, createTheme } from "@mantine/core";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

const theme = createTheme({});

function UiProviders({ children }: { children: ReactNode }) {
	return (
		<MantineProvider
			theme={theme}
			defaultColorScheme="light"
		>
			{children}
		</MantineProvider>
	);
}

export function renderWithMantine(
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper">,
) {
	return render(ui, { wrapper: UiProviders, ...options });
}
