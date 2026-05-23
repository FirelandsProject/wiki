import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE } from "../../consts";
import { filterDocsByLocale, docSlugFromId } from "../../i18n/utils";
import { t } from "../../i18n/ui";

export async function GET(context) {
	const locale = "es";
	const posts = filterDocsByLocale(await getCollection("docs"), locale);

	return rss({
		title: `${SITE_TITLE} (ES)`,
		description: t(locale, "siteDescription"),
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/wiki/es/docs/${docSlugFromId(post.id)}/`,
		})),
	});
}
