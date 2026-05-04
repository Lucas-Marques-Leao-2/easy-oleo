import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
	darkMode: "class",
	important: true,
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				main: {
					dark: "#14214E",
					DEFAULT: "#4361EE",
				},
				typography: {
					lv1: "#0B090A",
					lv2: "#2B2B2B",
					lv3: "#808080",
					lv4: "#AAAAAA",
					lv5: "#D4D4D4",
				},
			},
		},
	},
	plugins: [
		plugin(function pluginInner({ matchUtilities, theme }) {
			matchUtilities(
				{
					"text-shadow": (value: string) => ({
						textShadow: value,
					}),
				},
				{ values: theme("textShadow") },
			);
		}),
	],
};

export default config;
