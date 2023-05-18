const { SlashCommandBuilder } = require('discord.js');
const stupitify = require("../../stupitify");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(__filename.slice(__dirname.length + 1, -3))
        .setDescription(stupitify('i am very stupit'))
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to make stupit')
                .setRequired(true)),
    async execute(interaction) {
        interaction.reply(stupitify(interaction.options.getString('input')));
    },
};