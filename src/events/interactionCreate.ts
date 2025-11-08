import { Collection, Events, Interaction } from "discord.js";
import { ExtendedClient } from "../types";
import { editReply, Embed, reply } from "../utils/embeds";
import { checkPermissions } from "../utils/permissions";

export default {
	name: Events.InteractionCreate,
	async execute(
		interaction: Interaction,
		client: ExtendedClient
	): Promise<void> {
		if (!interaction.isChatInputCommand()) {
			return;
		}

		const command = client.commands.get(interaction.commandName);
		if (!command) {
			client.logger.error(
				`No command matching ${interaction.commandName} was found.`
			);
			return;
		}

		if (command.permissions) {
			const hasPermission = await checkPermissions(
				interaction,
				client,
				command.permissions
			);
			if (!hasPermission) {
				return;
			}
		}

		const { cooldowns } = client;
		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name)!;
		const cooldownAmount = (command.cooldown || 3) * 1000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime =
				timestamps.get(interaction.user.id)! + cooldownAmount;
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				await reply(interaction, {
					embeds: [
						new Embed().warning(
							"Cooldown",
							`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.data.name}\` command.`
						),
					],
					flags: [client.config.ephemeral],
				});
				return;
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(
			() => timestamps.delete(interaction.user.id),
			cooldownAmount
		);

		try {
			await command.execute(interaction);
		} catch (error) {
			client.logger.error(
				`Error executing ${interaction.commandName}:`,
				error
			);
			const errorEmbed = new Embed().error(
				"Command Error",
				"There was an error while executing this command!"
			);

			if (interaction.replied || interaction.deferred) {
				await editReply(interaction, { embeds: [errorEmbed] });
			} else {
				await reply(interaction, {
					embeds: [errorEmbed],
					flags: [client.config.ephemeral],
				});
			}
		}
	},
};
