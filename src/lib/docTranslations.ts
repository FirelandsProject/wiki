export const DOC_ORDER = [
	"getting-started",
	"architecture",
	"developer-setup",
	"database",
	"lua-scripting",
	"testing",
	"gm-commands",
] as const;

export type DocId = (typeof DOC_ORDER)[number];

export type DocTranslation = {
	en: string;
	es: string;
	descEn: string;
	descEs: string;
};

export const docTranslations: Record<DocId, DocTranslation> = {
	"getting-started": {
		en: "Getting Started",
		es: "Comenzar",
		descEn: "Introduction to Firelands - WoW Cataclysm Emulator",
		descEs: "Introducción a Firelands - Emulador de WoW Cataclysm",
	},
	architecture: {
		en: "Architecture",
		es: "Arquitectura",
		descEn: "Hexagonal architecture, layers, ports, and domain model",
		descEs: "Arquitectura hexagonal, capas, ports y modelo de dominio",
	},
	"developer-setup": {
		en: "Developer Setup",
		es: "Configuración de Desarrollador",
		descEn: "Environment setup, build, configuration, and deployment",
		descEs: "Entorno, compilación, configuración y despliegue",
	},
	database: {
		en: "Database",
		es: "Base de Datos",
		descEn: "Schema, migrations, and persistence adapters",
		descEs: "Esquema, migraciones y adaptadores de persistencia",
	},
	"lua-scripting": {
		en: "Lua Scripting",
		es: "Scripting Lua",
		descEn: "Gameplay scripting with Lua 5.4",
		descEs: "Scripting de gameplay con Lua 5.4",
	},
	testing: {
		en: "Testing",
		es: "Pruebas",
		descEn: "TDD workflow, GoogleTest, and test layout",
		descEs: "Flujo TDD, GoogleTest y estructura de pruebas",
	},
	"gm-commands": {
		en: "GM Commands",
		es: "Comandos GM",
		descEn: "Game Master commands, tickets, and console reference",
		descEs: "Comandos GM, tickets y referencia de consola",
	},
};

export function getDocTitle(id: string, lang: "en" | "es" = "en"): string {
	const entry = docTranslations[id as DocId];
	if (!entry) return id;
	return lang === "es" ? entry.es : entry.en;
}
