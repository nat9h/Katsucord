import {
	ChatInputCommandInteraction,
	Client,
	Collection,
	SlashCommandBuilder,
	User,
} from "discord.js";
import { config } from "../config";

export interface Command {
	data:
		| SlashCommandBuilder
		| {
				name: string;
				description: string;
				options?: any[];
				toJSON?: () => any;
		  };
	execute(interaction: ChatInputCommandInteraction): Promise<void>;
	cooldown?: number;
	permissions?: "owner" | "admin";
}

export interface ExtendedClient extends Client {
	commands: Collection<string, Command>;
	cooldowns: Collection<string, Collection<string, number>>;
	owners?: User[];
	logger: typeof import("../utils/logger").default;
	config: typeof config;
}

export interface EventProps {
	client: ExtendedClient;
	[key: string]: any;
}

export interface DatabaseConfig {
	uri: string;
	options?: any;
}
