const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

const Log = require('../models/Log');
const Source = require('../models/Source');

const embedEntryLog = require('./embedEntryLog');

module.exports = {
    async execute(confirmation, sourceId, collectorFilter) {
        try {
            // Build modal
            const logExistingSourceModal = new ModalBuilder()
                .setCustomId('logExistingSourceModal')
                .setTitle('Log Existing Source');
            const duration = new TextInputBuilder()
                .setCustomId('duration')
                .setLabel('Time (in minutes)')
                .setStyle(TextInputStyle.Short);
            
            const firstAction = new ActionRowBuilder().addComponents(duration);

            logExistingSourceModal.addComponents(firstAction);

            // Prompt user with modal
            await confirmation.showModal(logExistingSourceModal);
            const logConfirmation = await confirmation.awaitModalSubmit({ filter: collectorFilter, time: 30000 });

            if (logConfirmation) {
                const duration = logConfirmation.fields.getTextInputValue('duration');
                
                const log = await Log.createLog(sourceId, confirmation.user.id, duration);

                const source = await Source.findOne({ where: { sourceId: sourceId } });

                const embed = embedEntryLog.execute(log, source, logConfirmation);

                logConfirmation.update({ embeds: [embed], components: [] });
            }
        } catch (error) {
            console.log(error);
            confirmation.editReply({ content: 'Something went wrong. Please try again. Or bug mikumino to create more detailed error messages.', components: [], embeds: [] });
        }
    }
}
