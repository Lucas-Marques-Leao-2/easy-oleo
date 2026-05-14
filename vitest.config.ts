import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: "node",
					environment: "node",
					include: ["**/*.{test,spec}.{ts,tsx}"],
					exclude: [
						"**/node_modules/**",
						"**/.pnpm/**",
						"**/*.browser.{test,spec}.{ts,tsx}",
					],
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
