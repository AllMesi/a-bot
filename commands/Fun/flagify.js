const { SlashCommandBuilder } = require('discord.js');

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

function isNumber(str) {
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
}

const numberNames = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
const letters = [
    '\uD83C\uDDE6',
    '\uD83C\uDDE7',
    '\uD83C\uDDE8',
    '\uD83C\uDDE9',
    '\uD83C\uDDEA',
    '\uD83C\uDDEB',
    '\uD83C\uDDEC',
    '\uD83C\uDDED',
    '\uD83C\uDDEE',
    '\uD83C\uDDEF',
    '\uD83C\uDDF0',
    '\uD83C\uDDF1',
    '\uD83C\uDDF2',
    '\uD83C\uDDF3',
    '\uD83C\uDDF4',
    '\uD83C\uDDF5',
    '\uD83C\uDDF6',
    '\uD83C\uDDF7',
    '\uD83C\uDDF8',
    '\uD83C\uDDF9',
    '\uD83C\uDDFA',
    '\uD83C\uDDFB',
    '\uD83C\uDDFC',
    '\uD83C\uDDFD',
    '\uD83C\uDDFE',
    '\uD83C\uDDFF',
];

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription('flagifies a string')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to flagify')
                .setRequired(true)),
    async execute(interaction) {
        let regTable = [];
        const input = interaction.options.getString('input');
        for (let i = 0; i < input.length; i++) {
            const char = input.charAt(i);
            const rawChar = (interaction.options.getBoolean("raw") ? "\\" : "");
            if (isLetter(char)) {
                console.log(char.toLowerCase().charCodeAt(0));
                regTable.push(`${rawChar}${letters[char.toLowerCase().charCodeAt(0) - 97]}`);
            } else if (isNumber(char)) {
                regTable.push(`${rawChar}${numberNames[Number(char)]}`);
            } else if (char === "?") {
                regTable.push(`${rawChar}:grey_question:`);
            } else if (char === "!") {
                regTable.push(`${rawChar}:grey_exclamation:`);
            } else if (char === " ") {
                regTable.push(" ");
            } else {
                regTable.push(char);
            }
        }
        regTable.push("\u200b");
        interaction.reply(regTable.join(""));
    }
};