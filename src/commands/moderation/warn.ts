import { config } from "@/config";
import { Warn } from "@/models/Warn";
import { Command } from "@/types";
import { Embed, reply } from "@/utils/embeds";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("warn")
		.setDescription("Warns a user for a specified reason.")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The user to warn")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("The reason for the warning")
				.setRequired(true)
		),
	permissions: "admin",
	async execute(interaction: ChatInputCommandInteraction) {
		const user = interaction.options.getUser("user", true);
		const reason = interaction.options.getString("reason", true);

		if (!config.mongoUri) {
			await reply(interaction, {
				embeds: [
					new Embed().error(
						"Database Error",
						"The warn system is not available because no database is connected."
					),
				],
				flags: config.ephemeral,
			});
			return;
		}

		try {
			await new Warn({
				guildId: interaction.guildId,
				userId: user.id,
				moderatorId: interaction.user.id,
				reason: reason,
			}).save();

			const embed = new Embed()
				.success(
					"User Warned",
					`${user.tag} has been warned for: **${reason}**`
				)
				.setFooter({ text: `Moderator: ${interaction.user.tag}` });

			await reply(interaction, { embeds: [embed] });
		} catch (error) {
			console.error(error);
			await reply(interaction, {
				embeds: [
					new Embed().error(
						"Database Error",
						"Could not save the warning to the database."
					),
				],
				flags: config.ephemeral,
			});
		}
	},
};
