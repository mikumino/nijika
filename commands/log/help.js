const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('View available commands.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Nijika')
            .setDescription('[Nijika](https://mikumino.com/personal-guides/nijika) is a Discord bot that lets you log immersion, get experience points, level up, and share your immersion progress with friends.')
            .setImage('https://mikumino.com/_astro/cover.ec34db39_JR1xQ.webp')
            .setColor('#ffe17e')
            .setFields(
                { name: 'Basic Usage', value: '[Link 🔗](https://mikumino.com/personal-guides/nijika/#basic-usage)', inline: true },
                { name: 'Log/Source Commands', value: '[Link 🔗](https://mikumino.com/personal-guides/nijika/#logsource-commands)', inline: true },
                { name: 'Progress Commands', value: '[Link 🔗](https://mikumino.com/personal-guides/nijika/#progress-commands)', inline: true },
                { name: 'Admin Commands', value: '[Link 🔗](https://mikumino.com/personal-guides/nijika/#admin-commands)', inline: true },
            );

        await interaction.reply({ embeds: [embed] });
    }
}