"use client";

import { useAuth } from "@clerk/nextjs";
import {
	createContext,
	memo,
	useCallback,
	useContext,
	useEffect,
	useState,
	type PropsWithChildren,
} from "react";

export type JwtContextValue = {
	jwt: string | null;
};

const JwtContext = createContext<JwtContextValue>({ jwt: null });

export const JwtProvider = memo(function JwtProvider({ children }: PropsWithChildren) {
	const { isLoaded, isSignedIn, userId, getToken } = useAuth();
	const [jwt, setJwt] = useState<string | null>(null);

	const refreshJwt = useCallback(async () => {
		if (!isLoaded) return;
		if (!isSignedIn) {
			setJwt(null);
			return;
		}
		const token = await getToken();
		setJwt(token);
	}, [getToken, isLoaded, isSignedIn, userId]);

	useEffect(() => {
		void refreshJwt();
	}, [refreshJwt]);

	return <JwtContext.Provider value={{ jwt }}>{children}</JwtContext.Provider>;
});

export function useJwt() {
	return useContext(JwtContext);
}
