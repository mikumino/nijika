const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const promptContentType = require('./promptContentType');
const embedEntryLog = require('./embedEntryLog');
const User = require('../models/User');
const Source = require('../models/Source');
const Log = require('../models/Log');

module.exports = {
    async execute(confirmation, collectorFilter) {
        try {
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
                .setRequired(false)
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

            if (oneTimeConfirmation.message.id !== confirmation.message.id) {
                throw new Error('Modal message ID does not match original message ID.');
            }

            if (oneTimeConfirmation) {
                // Extract fields from modal submission and assign to variables
                const title = oneTimeConfirmation.fields.getTextInputValue('oneTimeTitle');
                const description = oneTimeConfirmation.fields.getTextInputValue('oneTimeDescription');
                let duration = oneTimeConfirmation.fields.getTextInputValue('oneTimeTime')

                // Strip whitespace and check if duration is valid
                duration = duration.replace(/\s/g, '');
                if (!duration.match(/^\d+$/) && !(parseInt(duration) > 0)) {
                    confirmation.editReply({ content: 'Invalid duration. Please try again.', components: [], embeds: [] });
                    return;
                }

                // Get or create user
                const [user, created] = await User.findOrCreate({ where: { userId: typeConfirmation.user.id } });

                // Create one time source
                const source = await Source.create({ sourceName: title, sourceDescription: description, sourceType: contentType, userId: user.userId, oneTime: true, totalDuration: duration });

                // Create log
                const log = await Log.createLog(source.sourceId, user.userId, duration);

                // Send confirmation
                const embed = embedEntryLog.execute(log, source, typeConfirmation);

                oneTimeConfirmation.update({ embeds: [embed], components: [] });
            }
        } catch (error) {
            console.error(error);
            confirmation.editReply({ content: 'No response given in the timeframe, canceling interaction.', embeds: [], components: [] });
        }
    }
}