// src/index.ts

import { config as conf } from "@dotenvx/dotenvx";
import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { config } from "./config";
import { loadCommands } from "./handlers/commands";
import { loadEvents } from "./handlers/events";
import { ExtendedClient } from "./types";
import { connectDatabase } from "./utils/database";
import logger from "./utils/logger";

conf({
	quiet: true,
});

async function initializeBot() {
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.MessageContent,
		],
		partials: [
			Partials.Channel,
			Partials.GuildMember,
			Partials.Message,
			Partials.User,
		],
	}) as ExtendedClient;

	client.commands = new Collection();
	client.cooldowns = new Collection();
	client.logger = logger;
	client.config = config;

	logger.info("Initializing bot...");
	await loadEvents(client);
	await loadCommands(client);
	logger.info("Handlers loaded successfully.");

	await connectDatabase();

	process.on("unhandledRejection", (error) => {
		logger.error("Unhandled promise rejection:", error);
	});

	process.on("uncaughtException", (error) => {
		logger.error("Uncaught exception:", error);
		process.exit(1);
	});

	client.login(config.token);
}

initializeBot().catch((error) => {
	logger.error("Failed to initialize bot:", error);
	process.exit(1);
});
