const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription("missed the joke")
        .addUserOption(option => option.setName('user').setDescription('user')),
    async execute(interaction) {
        await interaction.deferReply();
        const avatar = (interaction.options.getUser("user") || interaction.user).displayAvatarURL({ extension: 'png' });
        const image = new AttachmentBuilder(`https://api.popcat.xyz/jokeoverhead?image=${avatar}`, {
            name: "jokeoverhead.png"
        });

        await interaction.editReply({
            content: "provided by <https://popcat.xyz>",
            files: [image]
        });
    },
};