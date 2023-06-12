const { SlashCommandBuilder } = require('discord.js');
const { genRandLetters } = require("../../randomStuff");

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription('Tries to make a random flag'),
    async execute(interaction) {
        await interaction.reply(`:flag_${genRandLetters(2)}:`);
    },
};