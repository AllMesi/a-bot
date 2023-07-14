const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription('A random number from [number1] to [number2]')
        .addIntegerOption(option =>
            option.setName("min")
                .setDescription("min")
        )
        .addIntegerOption(option =>
            option.setName("max")
                .setDescription("max")
        ),
    async execute(interaction) {
        const min = interaction.options.getInteger("min") || 0;
        const max = interaction.options.getInteger("max") || 100;
        await interaction.reply(`Random number between ${min} and ${max}: ${Math.floor(Math.random() * (max - min + 1) + min)}`);
    },
};