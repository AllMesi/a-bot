const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription("a cat says something")
        .addStringOption(option =>
            option.setName('text')
                .setDescription('text to make to make the cat say')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const image = new AttachmentBuilder(`https://cataas.com/cat/says/${interaction.options.getString("text")}`, {
            name: "THIS CAT IS SAYING SOMETHING PLS LISTEN.png"
        });

        await interaction.editReply({
            content: "provided by <https://cataas.com>",
            files: [image]
        });
    },
};