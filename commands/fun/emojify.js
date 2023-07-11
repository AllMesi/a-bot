const { SlashCommandBuilder } = require('discord.js');

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

function isNumber(str) {
    if (typeof str != "string") return false; // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}

const numberNames = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

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
                regTable.push(`:regional_indicator_${char.toLowerCase()}:`);
            } else if (isNumber(char)) {
                regTable.push(`:${numberNames[Number(char)]}:`);
            } else if (char === "?") {
                regTable.push(":grey_question:");
            } else if (char === "!") {
                regTable.push(":grey_exclamation:");
            } else if (char === " ") {
                regTable.push(":black_large_square:");
            } else {
                regTable.push(char);
            }
        }
        regTable.push("\u200b");
        interaction.reply(regTable.join(""));
    }
};