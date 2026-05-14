"use client";

import { useMemo } from "react";

import { useUser } from "@/components/context/user-provider";

export const APP_ROLE_PRIORITIES = {
	ADMIN: 2,
	SELLER: 1,
	ATTENDANT: 0,
} as const;

export type AppRole = keyof typeof APP_ROLE_PRIORITIES;

export function normalizeAppRole(role: string | null | undefined): AppRole | null {
	if (!role) return null;
	const key = role.trim().toUpperCase();
	if (key in APP_ROLE_PRIORITIES) return key as AppRole;
	return null;
}

export function userRoleIs(userRole: string | null | undefined, target: AppRole): boolean {
	return normalizeAppRole(userRole) === target;
}

export function userRoleIsAtLeast(userRole: string | null | undefined, required: AppRole): boolean {
	const r = normalizeAppRole(userRole);
	if (!r) return false;
	return APP_ROLE_PRIORITIES[r] >= APP_ROLE_PRIORITIES[required];
}

export function userRoleIsLower(userRole: string | null | undefined, other: AppRole): boolean {
	const r = normalizeAppRole(userRole);
	if (!r) return false;
	return APP_ROLE_PRIORITIES[r] < APP_ROLE_PRIORITIES[other];
}

export function useUserRole() {
	const { user } = useUser();

	return useMemo(() => {
		const role = normalizeAppRole(user?.role);
		return {
			role,
			is: (target: AppRole) => userRoleIs(user?.role, target),
			isAtLeast: (required: AppRole) => userRoleIsAtLeast(user?.role, required),
			isLower: (other: AppRole) => userRoleIsLower(user?.role, other),
		};
	}, [user?.role]);
}
