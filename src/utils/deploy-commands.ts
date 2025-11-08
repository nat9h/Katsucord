import { readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { config } from "@dotenvx/dotenvx";
import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { Command } from "../types";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function deployCommands() {
	const commands: any[] = [];
	const foldersPath = join(__dirname, "..", "commands");
	const commandFolders = readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandsPath = join(foldersPath, folder);
		const commandFiles = readdirSync(commandsPath).filter((file) =>
			file.endsWith(".ts")
		);

		for (const file of commandFiles) {
			const filePath = join(commandsPath, file);
			try {
				const fileUrl = pathToFileURL(filePath).href;
				const commandModule = await import(fileUrl);
				const command: Command =
					commandModule.command ||
					commandModule.default ||
					commandModule;

				if ("data" in command && "execute" in command) {
					if (command.data instanceof SlashCommandBuilder) {
						commands.push(command.data.toJSON());
					} else {
						commands.push(command.data);
					}
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

	const rest = new REST({ version: "10" }).setToken(
		process.env.DISCORD_TOKEN!
	);

	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`
		);

		let data: any;
		if (process.env.GUILD_ID) {
			data = await rest.put(
				Routes.applicationGuildCommands(
					process.env.CLIENT_ID!,
					process.env.GUILD_ID!
				),
				{ body: commands }
			);
		} else {
			data = await rest.put(
				Routes.applicationCommands(process.env.CLIENT_ID!),
				{ body: commands }
			);
		}

		console.log(
			`Successfully reloaded ${data.length} application (/) commands.`
		);
	} catch (error) {
		console.error("Error deploying commands:", error);
	}
}

deployCommands();
