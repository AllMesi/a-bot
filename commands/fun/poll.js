const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription('Make a poll')
        .addStringOption(option =>
            option.setName("title")
                .setDescription("The title of the poll")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("option1")
                .setDescription("Option 1 of the poll")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("option2")
                .setDescription("Option 2 of the poll")
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        interaction.editReply({
            embeds: [
                {
                    color: 0x7289DA,
                    title: interaction.options.getString('title'),
                    description: `Option 1: ${interaction.options.getString('option1')}\nOption 2: ${interaction.options.getString('option2')}`
                }
            ]
        }).then(async msg => {
            msg.react("1️⃣");
            msg.react("2️⃣");
        });
    },
};