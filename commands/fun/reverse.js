const { SlashCommandBuilder } = require('discord.js');
const { reverse } = require("../../randomStuff");

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription("Reverse some text")
        .addStringOption(option =>
            option.setName("input")
                .setDescription("The string to reverse")
                .setRequired(true)),
    async execute(interaction) {
        interaction.reply(reverse(interaction.options.getString('input')));
    },
};