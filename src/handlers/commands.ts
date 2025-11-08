import { readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { ExtendedClient } from "../types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function loadCommands(client: ExtendedClient): Promise<void> {
	console.log("Loading commands...");
	const commandsPath = join(__dirname, "..", "commands");
	const commandFolders = readdirSync(commandsPath);

	for (const folder of commandFolders) {
		const folderPath = join(commandsPath, folder);
		const commandFiles = readdirSync(folderPath).filter((file) =>
			file.endsWith(".ts")
		);

		for (const file of commandFiles) {
			const filePath = join(folderPath, file);
			try {
				const fileUrl = pathToFileURL(filePath).href;
				const commandModule = await import(fileUrl);
				const command =
					commandModule.command ||
					commandModule.default ||
					commandModule;

				if ("data" in command && "execute" in command) {
					client.commands.set(command.data.name, command);
					console.log(`-> [Command Loaded] ${command.data.name}`);
				} else {
					console.log(
						`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
					);
				}
			} catch (error) {
				console.error(`Error loading command at ${filePath}:`, error);
			}
		}
	}
}
