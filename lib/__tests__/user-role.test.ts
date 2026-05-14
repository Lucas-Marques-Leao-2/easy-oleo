import { describe, expect, it } from "vitest";

import {
	normalizeAppRole,
	userRoleIs,
	userRoleIsAtLeast,
	userRoleIsLower,
} from "@/hooks/use-user-role";

describe("user-role", () => {
	it("normalizeAppRole reconhece roles da API", () => {
		expect(normalizeAppRole("ADMIN")).toBe("ADMIN");
		expect(normalizeAppRole("SELLER")).toBe("SELLER");
		expect(normalizeAppRole("ATTENDANT")).toBe("ATTENDANT");
		expect(normalizeAppRole(null)).toBeNull();
		expect(normalizeAppRole("UNKNOWN")).toBeNull();
	});

	it("userRoleIsAtLeast reflete hierarquia ADMIN > SELLER > ATTENDANT", () => {
		expect(userRoleIsAtLeast("ADMIN", "ADMIN")).toBe(true);
		expect(userRoleIsAtLeast("ADMIN", "SELLER")).toBe(true);
		expect(userRoleIsAtLeast("SELLER", "SELLER")).toBe(true);
		expect(userRoleIsAtLeast("SELLER", "ADMIN")).toBe(false);
		expect(userRoleIsAtLeast("ATTENDANT", "SELLER")).toBe(false);
		expect(userRoleIsAtLeast(null, "ATTENDANT")).toBe(false);
	});

	it("userRoleIsLower alinha ao paten (sem role → false)", () => {
		expect(userRoleIsLower(null, "ADMIN")).toBe(false);
		expect(userRoleIsLower("SELLER", "ADMIN")).toBe(true);
		expect(userRoleIsLower("ADMIN", "ADMIN")).toBe(false);
	});

	it("userRoleIs", () => {
		expect(userRoleIs("SELLER", "SELLER")).toBe(true);
		expect(userRoleIs("SELLER", "ADMIN")).toBe(false);
	});
});
