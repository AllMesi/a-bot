const link = 'https://random.dog/woof.json';
const fetch = require("node-fetch");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription('DOG !!!!!! !11!1'),
    async execute(interaction) {
        await interaction.deferReply();
        const response = await fetch(link);
        const data = await response.text();
        await interaction.editReply({
            embeds: [
                {
                    title: "Random dog picture",
                    image: {
                        url: JSON.parse(data).url
                    },
                    footer: {
                        icon_url: interaction.user.avatarURL(),
                        text: interaction.user.tag + " • image by " + link
                    },
                    color: 0x7289DA
                }
            ]
        });
    },
};