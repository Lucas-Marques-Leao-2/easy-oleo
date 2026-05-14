import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import react from "@vitejs/plugin-react";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(rootDir, "."),
		},
	},
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: "lib",
					environment: "node",
					include: ["lib/**/__tests__/**/*.test.ts"],
				},
			},
			{
				extends: true,
				test: {
					name: "ui",
					environment: "jsdom",
					setupFiles: ["./vitest.setup-ui.ts"],
					include: ["components/**/__tests__/**/*.test.{ts,tsx}"],
				},
			},
			{
				extends: true,
				test: {
					name: "browser",
					include: ["**/*.browser.{test,spec}.{ts,tsx}"],
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: "chromium" }],
					},
				},
			},
		],
	},
});
