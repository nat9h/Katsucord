import { Command } from "@/types";
import { Embed, reply } from "@/utils/embeds";
import {
	ChatInputCommandInteraction,
	GuildMember,
	SlashCommandBuilder,
	User,
} from "discord.js";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("userinfo")
		.setDescription("Displays information about a user.")
		.addUserOption((option) =>
			option
				.setName("target")
				.setDescription("The user to get information about")
				.setRequired(false)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const target = (interaction.options.getUser("target") ||
			interaction.user) as User;
		const member = (interaction.options.getMember("target") ||
			interaction.member) as GuildMember;

		const embed = new Embed()
			.setTitle(`Information about ${target.username}`)
			.setThumbnail(target.displayAvatarURL())
			.addFields(
				{ name: "User Tag", value: target.tag, inline: true },
				{ name: "ID", value: target.id, inline: true },
				{
					name: "Joined Server",
					value: `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>`,
					inline: true,
				},
				{
					name: "Account Created",
					value: `<t:${Math.floor(target.createdTimestamp / 1000)}:R>`,
					inline: true,
				},
				{
					name: "Roles",
					value: member.roles.cache.map((r) => r).join(" ") || "None",
					inline: false,
				}
			);

		await reply(interaction, { embeds: [embed] });
	},
};
