const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            if (interaction.isAutocomplete()) {
                await command.autocomplete(interaction);
            }
            else if (interaction.isChatInputCommand()) {
                await command.execute(interaction);
            }
        } catch (error) {
            console.error(error);
        }

	},
};