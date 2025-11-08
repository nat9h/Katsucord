import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { config } from "../config";
import { ExtendedClient } from "../types";
import { Embed, reply } from "./embeds";

export async function checkPermissions(
	interaction: ChatInputCommandInteraction,
	client: ExtendedClient,
	permissionType: "owner" | "admin"
): Promise<boolean> {
	if (permissionType === "owner") {
		if (!config.ownerIds.includes(interaction.user.id)) {
			await reply(interaction, {
				embeds: [
					new Embed().error(
						"Access Denied",
						"This command is restricted to the bot owner."
					),
				],
				flags: [config.ephemeral],
			});
			return false;
		}
	}

	if (permissionType === "admin") {
		const member = await interaction.guild?.members.fetch(
			interaction.user.id
		);
		if (
			!member?.permissions.has(PermissionFlagsBits.Administrator) &&
			!config.ownerIds.includes(interaction.user.id)
		) {
			await reply(interaction, {
				embeds: [
					new Embed().error(
						"Access Denied",
						"You need the **Administrator** permission to use this command."
					),
				],
				flags: [config.ephemeral],
			});
			return false;
		}
	}

	return true;
}
