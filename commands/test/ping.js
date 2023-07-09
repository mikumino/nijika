const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Mukou')
            .setDescription(`Nijika`)
            .setThumbnail('https://cdn.discordapp.com/avatars/1125900859528712212/4ff91215c19043f95527d55c5b9cc491.webp?size=512&width=0&height=0');
        
        const select_menu = new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Make a selection!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Option 1')
                    .setDescription('This is the first option')
                    .setValue('first_option'),
            );

        const row = new ActionRowBuilder()
            .addComponents(select_menu);

        await interaction.reply( { embeds: [embed], components: [row] } );
    }
}