"use client";

import type { AxiosRequestConfig } from "axios";

import { useJwt } from "@/components/context/jwt-provider";

export function useApiAuth(): AxiosRequestConfig | undefined {
	const { jwt } = useJwt();
	if (!jwt) return undefined;
	return { headers: { Authorization: `Bearer ${jwt}` } };
}
