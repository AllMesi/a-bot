const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(__filename.slice(__dirname.length + 1, -3))
        .setDescription('remove ansi from your text')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to remove ansi from')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply(interaction.options.getString("input").replace(
            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''));
    },
};