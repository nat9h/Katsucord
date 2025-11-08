import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	InteractionReplyOptions,
	InteractionResponse,
	MessageEditOptions,
} from "discord.js";
import { config } from "../config";
import logger from "./logger";

export class Embed extends EmbedBuilder {
	constructor() {
		super();
		this.setColor(config.colors.primary);
		if (config.embed.footer.text) {
			this.setFooter(config.embed.footer);
		}
		if (config.embed.timestamp) {
			this.setTimestamp();
		}
	}

	public success(title: string, description?: string): this {
		this.setColor(config.colors.success).setTitle(title);
		if (description) this.setDescription(description);
		return this;
	}

	public error(title: string, description?: string): this {
		this.setColor(config.colors.error).setTitle(title);
		if (description) this.setDescription(description);
		return this;
	}

	public warning(title: string, description?: string): this {
		this.setColor(config.colors.warning).setTitle(title);
		if (description) this.setDescription(description);
		return this;
	}
}

export async function reply(
	interaction: ChatInputCommandInteraction,
	options: InteractionReplyOptions
): Promise<InteractionResponse<boolean>> {
	try {
		return await interaction.reply(options);
	} catch (error) {
		logger.error(`Failed to reply to interaction: ${error}`);
		throw error;
	}
}

export async function editReply(
	interaction: ChatInputCommandInteraction,
	options: MessageEditOptions
): Promise<void> {
	try {
		await interaction.editReply(options);
	} catch (error) {
		logger.error(`Failed to edit reply: ${error}`);
		throw error;
	}
}
