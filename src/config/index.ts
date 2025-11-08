export const config = {
	token: process.env.DISCORD_TOKEN!,
	clientId: process.env.CLIENT_ID!,
	guildId: process.env.GUILD_ID, // Optional, for development
	mongoUri: process.env.MONGODB_URI, // Optional
	ownerIds: process.env.OWNER_IDS?.split(",") || [],

	colors: {
		primary: 0x0099ff,
		success: 0x00ff00,
		warning: 0xffaa00,
		error: 0xff0000,
	},

	embed: {
		footer: {
			text: "Katsumi",
			iconURL:
				"https://i.pinimg.com/736x/e3/5c/17/e35c17ed7c4cac560743d19596e1453e.jpg",
		},
		timestamp: true,
	},

	permissions: {
		owner: "Owner",
		admin: "Administrator",
	},

	ephemeral: 64,
};
