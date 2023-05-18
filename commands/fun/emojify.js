const { SlashCommandBuilder } = require('discord.js');

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription('emojifies a string')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to emojify')
                .setRequired(true)),
    async execute(interaction) {
        var regTable = [];
        const input = interaction.options.getString('input');
        for (let i = 0; i < input.length; i++) {
            const char = input.charAt(i);
            if (isLetter(char)) {
                regTable.push(":regional_indicator_" + char + ":");
            } else if (char == "?") {
                regTable.push(":grey_question:");
            } else if (char == "!") {
                regTable.push(":grey_exclamation:");
            } else if (char == "0") {
                regTable.push(":zero:");
            } else if (char == "1") {
                regTable.push(":one:");
            } else if (char == "2") {
                regTable.push(":two:");
            } else if (char == "3") {
                regTable.push(":three:");
            } else if (char == "4") {
                regTable.push(":four:");
            } else if (char == "5") {
                regTable.push(":five:");
            } else if (char == "6") {
                regTable.push(":six:");
            } else if (char == "7") {
                regTable.push(":seven:");
            } else if (char == "8") {
                regTable.push(":eight:");
            } else if (char == "9") {
                regTable.push(":nine:");
            } else {
                regTable.push(char);
            }
        }
        interaction.reply(regTable.join(""));
    }
};