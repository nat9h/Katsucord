import { config } from "@/config";
import { Command, ExtendedClient } from "@/types";
import { Embed, reply } from "@/utils/embeds";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Shows a list of all available commands."),
	async execute(interaction: ChatInputCommandInteraction) {
		const client = interaction.client as ExtendedClient;
		const commands = client.commands.map(
			(cmd) => `**/${cmd.data.name}**: ${cmd.data.description}`
		);

		const helpEmbed = new Embed()
			.setTitle(`${client.user?.username} Commands`)
			.setDescription(commands.join("\n") || "No commands available.")
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL(),
			});

		await reply(interaction, {
			embeds: [helpEmbed],
			flags: config.ephemeral,
		});
	},
};
