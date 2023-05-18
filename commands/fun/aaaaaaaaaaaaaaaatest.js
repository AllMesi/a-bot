const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription('just a lil test'),
    async execute(interaction) {
        await interaction.reply(`</${interaction.commandName}:${interaction.commandId}>`);
    },
};