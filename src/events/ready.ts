import { ActivityType, Events, User } from "discord.js";
import { ExtendedClient } from "../types";

export default {
	name: Events.ClientReady,
	once: true,
	async execute(client: ExtendedClient): Promise<void> {
		client.logger.info(`Ready! Logged in as ${client.user?.tag}`);

		client.user?.setActivity({
			name: "over the server",
			type: ActivityType.Watching,
		});

		client.logger.info(`Bot is in ${client.guilds.cache.size} servers`);

		if (client.config.ownerIds.length) {
			try {
				const ownerPromises = client.config.ownerIds.map((id) =>
					client.users.fetch(id)
				);
				client.owners = (await Promise.all(ownerPromises)).filter(
					(user): user is User => Boolean(user)
				);
				client.logger.info(
					`Successfully fetched ${client.owners.length} owner(s).`
				);
			} catch (error) {
				client.logger.error(
					"Failed to fetch one or more owners:",
					error
				);
			}
		}
	},
};
