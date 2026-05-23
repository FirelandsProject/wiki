import type { CollectionEntry } from "astro:content";
import {
	docSlugFromId,
	filterDocsByLocale,
	sortDocs,
	type DocSlug,
} from "../i18n/utils";
import type { Locale } from "../i18n/ui";

export type DocNavProps = {
	post: CollectionEntry<"docs">;
	prevPost: CollectionEntry<"docs"> | null;
	nextPost: CollectionEntry<"docs"> | null;
	locale: Locale;
	slug: DocSlug | string;
};

export function buildDocNav(
	posts: CollectionEntry<"docs">[],
	locale: Locale,
): DocNavProps[] {
	const sorted = sortDocs(filterDocsByLocale(posts, locale));

	return sorted.map((post, index) => ({
		post,
		prevPost: index > 0 ? sorted[index - 1] : null,
		nextPost: index < sorted.length - 1 ? sorted[index + 1] : null,
		locale,
		slug: docSlugFromId(post.id),
	}));
}

export function getDocNavEntry(
	posts: CollectionEntry<"docs">[],
	locale: Locale,
	slug: string,
): DocNavProps | undefined {
	return buildDocNav(posts, locale).find((entry) => entry.slug === slug);
}
