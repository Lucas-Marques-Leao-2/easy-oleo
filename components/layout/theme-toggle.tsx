"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { HiMoon, HiSun } from "react-icons/hi2";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDark = resolvedTheme === "dark";

	if (!mounted) {
		return (
			<span
				className="inline-block h-9 w-9 shrink-0 rounded-md border border-transparent"
				aria-hidden
			/>
		);
	}

	return (
		<button
			type="button"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
			aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
		>
			{isDark ? (
				<HiSun
					className="h-5 w-5"
					aria-hidden
				/>
			) : (
				<HiMoon
					className="h-5 w-5"
					aria-hidden
				/>
			)}
		</button>
	);
}
