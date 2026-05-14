"use client";

import { createContext, memo, useContext, type PropsWithChildren } from "react";

import { useJwt } from "./jwt-provider";
import { useUsersControllerFindMe } from "@/openapi/client/users/users";
import type { UserResponse } from "@/openapi/client/models/userResponse";

export type UserContextValue = {
	jwt: string | null;
	user: UserResponse | null;
	isMePending: boolean;
	isMeError: boolean;
};

const UserContext = createContext<UserContextValue>({
	jwt: null,
	user: null,
	isMePending: false,
	isMeError: false,
});

export const getAppUserMeQueryKey = () => ["users", "me"] as const;

export const UserProvider = memo(function UserProvider({ children }: PropsWithChildren) {
	const { jwt } = useJwt();

	const meQuery = useUsersControllerFindMe({
		query: {
			enabled: Boolean(jwt),
			retry: false,
		},
		request: jwt ? { headers: { Authorization: `Bearer ${jwt}` } } : undefined,
	});

	const isMePending = Boolean(jwt) && meQuery.isPending;

	return (
		<UserContext.Provider
			value={{
				jwt,
				user: meQuery.data ?? null,
				isMePending,
				isMeError: meQuery.isError,
			}}
		>
			{children}
		</UserContext.Provider>
	);
});

export function useUser() {
	return useContext(UserContext);
}
