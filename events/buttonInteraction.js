/**
 * @file Button Interaction Handler
 * @author Naman Vrati
 * @since 3.0.0
 * @version 3.3.2
 */

const { Events } = require("discord.js");

module.exports = {
	name: Events.InteractionCreate,

	/**
	 * @description Executes when an interaction is created and handle it.
	 * @author Naman Vrati
	 * @param {import('discord.js').ButtonInteraction & { client: import('../typings').Client }} interaction The interaction which was created
	 */

	async execute(interaction) {
		// Deconstructed client from interaction object.
		const { client } = interaction;

		// Checks if the interaction is a button interaction (to prevent weird bugs)
		
		if (!interaction.isButton()) return;

		// Dynamic customIds (e.g. "redeem:vip") fall back to the handler registered
		// under the prefix before the first colon.
		const command =
			client.buttonCommands.get(interaction.customId) ||
			client.buttonCommands.get(interaction.customId.split(":")[0]);

		// Unregistered ids (e.g. "confirm"/"cancel") belong to local component
		// collectors; replying here would steal the interaction from them.
		if (!command) return;

		// A try to execute the interaction.

		try {
			return await command.execute(interaction);
		} catch (err) {
			console.error(err);
			const payload = { content: "There was an issue while executing that button!", ephemeral: true };
			await (interaction.replied || interaction.deferred
				? interaction.followUp(payload)
				: interaction.reply(payload)
			).catch(() => {});
		}
	},
};
