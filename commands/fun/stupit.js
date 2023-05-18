const { SlashCommandBuilder } = require('discord.js');
const { stupitify } = require("../../randomStuff");

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription(stupitify('i am very stupit'))
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to make stupit')
                .setRequired(true)),
    async execute(interaction) {
        interaction.reply(stupitify(interaction.options.getString('input')));
    },
};