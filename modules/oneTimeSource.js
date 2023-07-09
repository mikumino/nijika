const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const promptContentType = require('./promptContentType');
const User = require('../models/User');
const Source = require('../models/Source');
const Log = require('../models/Log');

module.exports = {
    async execute(confirmation, collectorFilter) {
        // Build menu for selecting content type
        typeConfirmation = await promptContentType.execute(confirmation, collectorFilter);
        const contentType = typeConfirmation.values[0];

        const oneTimeMenu = new ModalBuilder()
            .setCustomId('oneTimeModal')
            .setTitle('One Time Source');
        const oneTimeTitle = new TextInputBuilder()
            .setCustomId('oneTimeTitle')
            .setLabel('Title')
            .setStyle(TextInputStyle.Short);
        const oneTimeDescription = new TextInputBuilder()
            .setCustomId('oneTimeDescription')
            .setLabel('Description')
            .setStyle(TextInputStyle.Paragraph);
        const oneTimeTime = new TextInputBuilder()
            .setCustomId('oneTimeTime')
            .setLabel('Time (in minutes)')
            .setStyle(TextInputStyle.Short)

        const firstActionOneTime = new ActionRowBuilder().addComponents(oneTimeTitle);
        const secondActionOneTime = new ActionRowBuilder().addComponents(oneTimeDescription);
        const thridActionOneTime = new ActionRowBuilder().addComponents(oneTimeTime);

        oneTimeMenu.addComponents(firstActionOneTime, secondActionOneTime, thridActionOneTime);

        await typeConfirmation.showModal(oneTimeMenu);

        const oneTimeConfirmation = await confirmation.awaitModalSubmit({ filter: collectorFilter, time: 30000 });

        if (oneTimeConfirmation) {
            // Extract fields from modal submission and assign to variables
            const title = oneTimeConfirmation.fields.getTextInputValue('oneTimeTitle');
            const description = oneTimeConfirmation.fields.getTextInputValue('oneTimeDescription');
            const time = oneTimeConfirmation.fields.getTextInputValue('oneTimeTime')

            // Get or create user
            const [user, created] = await User.findOrCreate({ where: { userId: typeConfirmation.user.id } });

            // Send confirmation
            oneTimeConfirmation.update({ content: `Source "${title}" for ${time} minutes was successfully logged!`, components: [] });
        }

    }
}