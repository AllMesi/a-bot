const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription("oh no")
        .addStringOption(option =>
            option.setName('text')
                .setDescription('text to google')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const text = interaction.options.getString("text");
        const query = new URLSearchParams({ text });
        const image = new AttachmentBuilder(`https://api.popcat.xyz/unforgivable?text=${query.toString().slice(5)}`, {
            name: "sadcat.png"
        });

        await interaction.editReply({
            content: "provided by <https://popcat.xyz>",
            files: [image]
        });
    },
};