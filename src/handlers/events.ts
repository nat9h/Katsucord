import { readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { ClientEvents } from "discord.js";
import { ExtendedClient } from "../types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function loadEvents(client: ExtendedClient): Promise<void> {
	console.log("Loading events...");
	const eventsPath = join(__dirname, "..", "events");
	const eventFiles = readdirSync(eventsPath).filter((file) =>
		file.endsWith(".ts")
	);

	for (const file of eventFiles) {
		const filePath = join(eventsPath, file);
		try {
			const fileUrl = pathToFileURL(filePath).href;
			const eventModule = await import(fileUrl);
			const event = eventModule.default || eventModule;

			if (event.once) {
				client.once(
					event.name,
					(...args: ClientEvents[keyof ClientEvents]) =>
						event.execute(...args, client)
				);
			} else {
				client.on(
					event.name,
					(...args: ClientEvents[keyof ClientEvents]) =>
						event.execute(...args, client)
				);
			}
			console.log(`-> [Event Loaded] ${event.name}`);
		} catch (error) {
			console.error(`Error loading event at ${filePath}:`, error);
		}
	}
}
