#!/usr/bin/env node
/**
 * Splits bilingual markdown (lang-en / lang-es spans) into per-locale files.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(__dirname, "../src/content/docs");
const outEn = path.join(docsDir, "en");
const outEs = path.join(docsDir, "es");

const meta = {
	"getting-started": {
		en: { title: "Getting Started", description: "Introduction to Firelands - WoW Cataclysm Emulator" },
		es: { title: "Comenzar", description: "Introducción a Firelands - Emulador de WoW Cataclysm" },
	},
	architecture: {
		en: { title: "Architecture", description: "Hexagonal architecture, layers, ports, and domain model" },
		es: { title: "Arquitectura", description: "Arquitectura hexagonal, capas, ports y modelo de dominio" },
	},
	"developer-setup": {
		en: { title: "Developer Setup", description: "Environment setup, build, configuration, and deployment" },
		es: { title: "Configuración de Desarrollador", description: "Entorno, compilación, configuración y despliegue" },
	},
	database: {
		en: { title: "Database", description: "Schema, migrations, and persistence adapters" },
		es: { title: "Base de Datos", description: "Esquema, migraciones y adaptadores de persistencia" },
	},
	"lua-scripting": {
		en: { title: "Lua Scripting", description: "Gameplay scripting with Lua 5.4" },
		es: { title: "Scripting Lua", description: "Scripting de gameplay con Lua 5.4" },
	},
	testing: {
		en: { title: "Testing", description: "TDD workflow, GoogleTest, and test layout" },
		es: { title: "Pruebas", description: "Flujo TDD, GoogleTest y estructura de pruebas" },
	},
	"gm-commands": {
		en: { title: "GM Commands", description: "Game Master commands, tickets, and console reference" },
		es: { title: "Comandos GM", description: "Comandos GM, tickets y referencia de consola" },
	},
};

function parseFrontmatter(raw) {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!match) return { fm: {}, body: raw };
	const fm = {};
	for (const line of match[1].split("\n")) {
		const m = line.match(/^(\w+):\s*'?(.+?)'?$/);
		if (m) fm[m[1]] = m[2];
	}
	return { fm: match[1], body: match[2] };
}

function extractLocaleBody(body, lang) {
	const other = lang === "en" ? "es" : "en";

	let out = body.replace(
		/^(#{1,6})\s*<span class="lang-en">([\s\S]*?)<\/span><span class="lang-es">([\s\S]*?)<\/span>\s*$/gm,
		(_, hashes, en, es) => `${hashes} ${lang === "en" ? en.trim() : es.trim()}`,
	);

	out = out.replace(
		new RegExp(`<span class="lang-${other}">[\\s\\S]*?<\\/span>`, "g"),
		"",
	);

	out = out.replace(
		new RegExp(`<span class="lang-${lang}">([\\s\\S]*?)<\\/span>`, "g"),
		"$1",
	);

	out = out.replace(/\n{3,}/g, "\n\n").trim();

	if (lang === "es") {
		out = out.replace(/\/wiki\/docs\//g, "/wiki/es/docs/");
	}

	return out;
}

function buildFrontmatter(fmRaw, slug, lang) {
	const dates = {};
	for (const line of fmRaw.split("\n")) {
		if (line.startsWith("pubDate:") || line.startsWith("updatedDate:")) {
			const [k, ...v] = line.split(":");
			dates[k] = v.join(":").trim();
		}
	}
	const { title, description } = meta[slug][lang];
	return `---
title: '${title.replace(/'/g, "''")}'
description: '${description.replace(/'/g, "''")}'
pubDate: ${dates.pubDate || "'2025-01-01'"}
${dates.updatedDate ? `updatedDate: ${dates.updatedDate}` : ""}
---
`.replace(/\nupdatedDate: \s*\n/, "\n");
}

fs.mkdirSync(outEn, { recursive: true });
fs.mkdirSync(outEs, { recursive: true });

const files = fs.readdirSync(docsDir).filter((f) => f.endsWith(".md"));

for (const file of files) {
	const slug = file.replace(/\.md$/, "");
	if (!meta[slug]) continue;

	const raw = fs.readFileSync(path.join(docsDir, file), "utf8");
	const { fm, body } = parseFrontmatter(raw);

	for (const lang of ["en", "es"]) {
		const localeBody = extractLocaleBody(body, lang);
		const content = `${buildFrontmatter(fm, slug, lang)}\n\n${localeBody}\n`;
		const outDir = lang === "en" ? outEn : outEs;
		fs.writeFileSync(path.join(outDir, file), content);
	}

	fs.unlinkSync(path.join(docsDir, file));
	console.log(`Split ${file} → en/${file}, es/${file}`);
}

console.log("Done.");
