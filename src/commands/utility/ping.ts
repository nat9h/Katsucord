import { Command } from "@/types";
import { Embed } from "@/utils/embeds";
import {
	ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from "discord.js";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),
	cooldown: 5,
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply({
			content: "Pinging...",
			flags: [MessageFlags.Ephemeral],
		});

		const sent = await interaction.fetchReply();

		const timeDiff = sent.createdTimestamp - interaction.createdTimestamp;
		const apiLatency = Math.round(interaction.client.ws.ping);

		const embed = new Embed()
			.setTitle("🏓 Pong!")
			.setDescription(
				`Here's the ping information for ${interaction.client.user.username}:`
			)
			.addFields(
				{
					name: "Bot Latency",
				  value: `\`\`\`[ ${timeDiff}ms ]\`\`\``,
					inline: true,
				},
				{
					name: "API Latency",
					value: `\`\`\`[ ${apiLatency}ms ]\`\`\``,
					inline: true,
				}
			)
			.setFooter({
				text: `Requested by ${interaction.user.username}`,
				iconURL: interaction.user.displayAvatarURL(),
			});

		await interaction.editReply({ content: null, embeds: [embed] });
	},
};

export default command;
