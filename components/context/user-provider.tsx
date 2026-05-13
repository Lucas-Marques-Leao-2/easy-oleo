"use client";

import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { createContext, memo, useContext, type PropsWithChildren } from "react";

import { axiosInstance } from "@/openapi/axios";
import type { UserResponse } from "@/openapi/client/models/userResponse";

import { useJwt } from "./jwt-provider";

export type UserContextValue = {
	jwt: string | null;
	user: UserResponse | null;
};

const UserContext = createContext<UserContextValue>({ jwt: null, user: null });

export const getAppUserMeQueryKey = () => ["users", "me"] as const;

export const UserProvider = memo(function UserProvider({ children }: PropsWithChildren) {
	const { jwt } = useJwt();

	const { data } = useQuery<UserResponse | null>({
		queryKey: [...getAppUserMeQueryKey(), jwt],
		queryFn: async ({ signal }) => {
			try {
				return await axiosInstance<UserResponse>({
					url: "/users/me",
					method: "GET",
					signal,
					headers: { Authorization: `Bearer ${jwt}` },
				});
			} catch (e: unknown) {
				if (isAxiosError(e) && e.response?.status === 404) return null;
				throw e;
			}
		},
		enabled: Boolean(jwt),
		retry: false,
	});

	return (
		<UserContext.Provider value={{ jwt, user: data ?? null }}>{children}</UserContext.Provider>
	);
});

export function useUser() {
	return useContext(UserContext);
}
