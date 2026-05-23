export type Locale = "en" | "es";

export const defaultLocale: Locale = "en";
export const locales: Locale[] = ["en", "es"];

export const ui = {
	en: {
		home: "Home",
		docs: "Docs",
		about: "About",
		lastUpdated: "Updated",
		prev: "Previous",
		next: "Next",
		onThisPage: "On This Page",
		documentation: "Documentation",
		enterDocs: "Enter Knowledge Base",
		returnHome: "Return to Safety",
		siteDescription: "Documentation for firelands-next - WoW Cataclysm Emulator (4.3.4)",
		docsIntro:
			"Explore the complete Firelands Core documentation. Click any card below to dive into the topic you need.",
		docsHint: "Pro tip: Start with Getting Started if you're new!",
		errorTitle: "Plane stabilized... in Nothingness",
		errorMessage:
			"It seems you have wandered beyond the Firelands. The knowledge you seek has evaporated into the magmatic void.",
	},
	es: {
		home: "Inicio",
		docs: "Docs",
		about: "Acerca de",
		lastUpdated: "Actualizado",
		prev: "Anterior",
		next: "Siguiente",
		onThisPage: "En Esta Página",
		documentation: "Documentación",
		enterDocs: "Entrar a la Base de Conocimiento",
		returnHome: "Volver a un lugar seguro",
		siteDescription: "Documentación para firelands-next - Emulador de WoW Cataclysm (4.3.4)",
		docsIntro:
			"Explora la documentación completa de Firelands Core. Haz clic en cualquier tarjeta para profundizar en el tema que necesitas.",
		docsHint: "Consejo: ¡Comienza con Comenzar si eres nuevo!",
		errorTitle: "Plano estabilizado... en la Nada",
		errorMessage:
			"Parece que te has adentrado más allá de las Tierras de Fuego. El conocimiento que buscas se ha evaporado en el vacío magmático.",
	},
} as const;

export type UiKey = keyof (typeof ui)["en"];

export function t(locale: Locale, key: UiKey): string {
	return ui[locale][key];
}
