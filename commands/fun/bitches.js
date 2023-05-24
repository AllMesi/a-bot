const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription("Alot of bitches?")
        .addStringOption(option =>
            option.setName('no')
                .setDescription('text to put at the top')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const no = interaction.options.getString("no");
        const query = new URLSearchParams({ no });
        const image = new AttachmentBuilder(`https://some-random-api.com/canvas/misc/nobitches?no=${query.toString().slice(3)}`, {
            name: "bitches.png"
        });

        await interaction.editReply({
            files: [image]
        });
    },
};