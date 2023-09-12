import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		author:z.string().optional(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
	}),
});

export const collections = { docs };
