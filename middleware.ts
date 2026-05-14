import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/login(.*)", "/register(.*)"]);

export default clerkMiddleware(async (auth, request) => {
	const url = new URL(request.url);

	if (url.pathname === "/sign-in" || url.pathname.startsWith("/sign-in/")) {
		const suffix = url.pathname.slice("/sign-in".length);
		const dest = new URL(`/login${suffix}`, request.url);
		dest.search = url.search;
		return NextResponse.redirect(dest);
	}

	if (url.pathname === "/sign-up" || url.pathname.startsWith("/sign-up/")) {
		const suffix = url.pathname.slice("/sign-up".length);
		const dest = new URL(`/register${suffix}`, request.url);
		dest.search = url.search;
		return NextResponse.redirect(dest);
	}

	const { userId } = await auth();

	if (isPublicRoute(request) && userId) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	if (!isPublicRoute(request)) {
		await auth.protect();
	}
});

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};
