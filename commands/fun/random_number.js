const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription('A random number from [number1] to [number2]')
        .addIntegerOption(option =>
            option.setName("from")
            .setDescription("number 1")
        )
        .addIntegerOption(option =>
            option.setName("to")
            .setDescription("number 2")
        ),
    async execute(interaction) {
        const n1 = interaction.options.getInteger("from") || 0;
        const n2 = interaction.options.getInteger("to") || 100;
        await interaction.reply(`Random number between ${n1} and ${n2}: ${Math.floor(Math.random() * (n2 - n1 + 1) + n2)}`);
    },
};