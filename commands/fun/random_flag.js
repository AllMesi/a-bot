const { SlashCommandBuilder } = require('discord.js');
const charset = "abcdefghijklmnopqrstuvwxyz";

function generate() {
    return charset.charAt(Math.floor(Math.random() * charset.length)) + charset.charAt(Math.floor(Math.random() * charset.length));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName(__filename.slice(__dirname.length + 1, -3))
        .setDescription('random flag'),
    async execute(interaction) {
        await interaction.reply(":flag_" + generate() + ":");
    },
};