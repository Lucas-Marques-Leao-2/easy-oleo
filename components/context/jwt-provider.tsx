"use client";

// import { useAuth } from "@clerk/nextjs";
import { createContext, memo, useContext, type PropsWithChildren } from "react";

export type JwtContextValue = {
	jwt: string | null;
};

const JwtContext = createContext<JwtContextValue>({ jwt: null });

export const JwtProvider = memo(function JwtProvider({ children }: PropsWithChildren) {
	// const [jwt, setJwt] = useState<string | null>(null);
	// const auth = useAuth();
	//
	// const refreshJwt = useCallback(async () => {
	// 	if (!auth.isLoaded) return;
	// 	if (!auth.isSignedIn) {
	// 		setJwt(null);
	// 		return;
	// 	}
	// 	const token = await auth.getToken({ template: "jwt" });
	// 	setJwt(token);
	// }, [auth]);
	//
	// useEffect(() => {
	// 	void refreshJwt();
	// }, [refreshJwt, auth.isLoaded, auth.isSignedIn, auth.userId]);

	const jwt: string | null = null;

	return <JwtContext.Provider value={{ jwt }}>{children}</JwtContext.Provider>;
});

export function useJwt() {
	return useContext(JwtContext);
}
