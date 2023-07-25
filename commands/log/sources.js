const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const Source = require('../../models/Source');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sources')
        .setDescription('View your sources.'),

    async execute(interaction) {
        // Get all sources for user
        const allSources = await Source.findAll({ where: { userId: interaction.user.id } });

        // Sort allSources by creation date (newest first)
        allSources.sort((a, b) => b.createdAt - a.createdAt);

        let inProgressSources = [];
        let pausedSources = [];
        let completedSources = [];
        
        // Sort sources into arrays based on status
        allSources.forEach(source => {
            if (source.status === "In Progress") {
                inProgressSources.push(source);
            }
            else if (source.status === "Paused") {
                pausedSources.push(source);
            }
            else {
                completedSources.push(source);
            }
        });
 
        inProgressSources.sort((a, b) => b.createdAt - a.createdAt);
        pausedSources.sort((a, b) => b.createdAt - a.createdAt);
        completedSources.sort((a, b) => b.createdAt - a.createdAt);

        // Buttons for page navigation
        const previousButton = new ButtonBuilder()
            .setCustomId('previous')
            .setLabel('Previous')
            .setStyle(ButtonStyle.Primary);
        const nextButton = new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Next')
            .setStyle(ButtonStyle.Primary);

        // Select menu for status filtering
        const select = new StringSelectMenuBuilder()
            .setCustomId('status')
            .setPlaceholder('All')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('All')
                    .setValue('all'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('In Progress')
                    .setValue('inProgress'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Paused')
                    .setValue('paused'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Completed')
                    .setValue('completed')
            );

        // Action rows
        const selectRow = new ActionRowBuilder().addComponents(select);
        const buttonRow = new ActionRowBuilder().addComponents(previousButton, nextButton);

        // description - used for source list
        let description = '';

        // Default embed
        let embed = new EmbedBuilder()
            .setTitle(`${interaction.user.username}'s sources`)
            .setThumbnail(interaction.user.avatarURL())
            .setColor('#ffe17e');

        // Defaults
        let currentPage = 1;
        let maxPages = Math.ceil(inProgressSources.length / 10);
        let sourceIndex = 0;
        let sourceList = allSources;

        // Display sources function
        const displaySources = async () => {
            // Clear description
            description = 'Sources:\n';

            for (let i = sourceIndex; i < 10; i++) {
                if (sourceList[i]) {
                    description += `${sourceList[i].sourceName} / ${sourceList[i].sourceType} / ${sourceList[i].status}\n`;
                }
            }

            // Set embed description
            embed.setDescription(description);

            // Set embed footer
            embed.setFooter({ text: `Page ${currentPage} of ${maxPages}` });
            
            return embed;
        }
        embed = await displaySources();
        // Initial display
        const response = await interaction.reply({ embeds: [embed], components: [selectRow, buttonRow] });

        // Button collector
        const collectorFilter = i => i.user.id === interaction.user.id;
        const collector = response.createMessageComponentCollector({ filter: collectorFilter, time: 60000 });

        collector.on('collect', async i => {
            // Previous button
            if (i.customId === 'previous') {
                // If on first page, go to last page
                if (currentPage === 1) {
                    currentPage = maxPages;
                }
                // Otherwise, go to previous page
                else {
                    currentPage--;
                }
                sourceIndex = (currentPage - 1) * 10;
            }
            // Next button
            else if (i.customId === 'next') {
                // If on last page, go to first page
                if (currentPage === maxPages) {
                    currentPage = 1;
                }
                else {
                    currentPage++;
                }
                sourceIndex = (currentPage - 1) * 10;
            }
            // Status select menu
            else if (i.customId === 'status') {
                // Set sourceList based on status
                if (i.values[0] === 'all') {
                    sourceList = allSources;
                }
                else if (i.values[0] === 'inProgress') {
                    sourceList = inProgressSources;
                }
                else if (i.values[0] === 'paused') {
                    sourceList = pausedSources;
                }
                else {
                    sourceList = completedSources;
                }
                // Reset page number
                currentPage = 1;
                sourceIndex = 0;
                maxPages = Math.ceil(sourceList.length / 10);
            }

            // Update message
            embed = await displaySources();
            i.update({ embeds: [embed] });
        });
        
    }
}