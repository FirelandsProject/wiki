import type { CollectionEntry } from "astro:content";
import type { Locale } from "./ui";

export const DOC_ORDER = [
	"getting-started",
	"architecture",
	"contributing",
	"developer-setup",
	"database",
	"modules-shared",
	"modules-domain",
	"modules-application",
	"modules-infrastructure",
	"modules-executables",
	"modules-tools-build",
	"gossip-npc-text",
	"lua-scripting",
	"testing",
	"devtools",
	"extractors",
	"vmap-pipeline",
	"storm-lib",
	"gm-commands",
	"gm-tickets",
	"roadmap",
	"cpp20-migration",
] as const;

export type DocSlug = (typeof DOC_ORDER)[number];

export function getLocaleFromPath(pathname: string): Locale {
	return pathname.includes("/es/") || pathname.endsWith("/es") ? "es" : "en";
}

export function localePath(locale: Locale, segment: string, base: string): string {
	const normalized = segment.startsWith("/") ? segment : `/${segment}`;
	if (locale === "en") {
		return `${base}${normalized}`.replace(/\/+/g, "/") || "/";
	}
	return `${base}/es${normalized}`.replace(/\/+/g, "/");
}

export function docUrl(locale: Locale, slug: string, base: string): string {
	return localePath(locale, `/docs/${slug}/`, base);
}

export function switchLocalePath(currentPath: string, targetLocale: Locale, base: string): string {
	const withoutBase = currentPath.startsWith(base)
		? currentPath.slice(base.length) || "/"
		: currentPath;

	if (targetLocale === "en") {
		const enPath = withoutBase.replace(/^\/es(\/|$)/, "/").replace(/\/+/g, "/") || "/";
		return `${base}${enPath}`.replace(/\/+/g, "/") || "/";
	}

	if (withoutBase.startsWith("/es/") || withoutBase === "/es") {
		return `${base}${withoutBase}`.replace(/\/+/g, "/");
	}

	const esPath = withoutBase === "/" ? "/es/" : `/es${withoutBase}`;
	return `${base}${esPath}`.replace(/\/+/g, "/");
}

export function parseDocId(id: string): { locale: Locale; slug: string } {
	const [locale, ...rest] = id.split("/");
	return { locale: locale as Locale, slug: rest.join("/") };
}

export function filterDocsByLocale(
	posts: CollectionEntry<"docs">[],
	locale: Locale,
): CollectionEntry<"docs">[] {
	return posts.filter((p) => p.id.startsWith(`${locale}/`));
}

export function sortDocs(posts: CollectionEntry<"docs">[]): CollectionEntry<"docs">[] {
	return [...posts].sort((a, b) => {
		const slugA = parseDocId(a.id).slug;
		const slugB = parseDocId(b.id).slug;
		const aIndex = DOC_ORDER.indexOf(slugA as DocSlug);
		const bIndex = DOC_ORDER.indexOf(slugB as DocSlug);
		return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
	});
}

export function docSlugFromId(id: string): string {
	return parseDocId(id).slug;
}
