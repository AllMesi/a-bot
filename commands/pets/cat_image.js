const link = 'https://cataas.com/cat?json=true';
const fetch = require("node-fetch");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription('omgomg cat'),
    async execute(interaction) {
        await interaction.deferReply();
        const response = await fetch(link);
        const data = await response.text();
        await interaction.editReply({
            embeds: [
                {
                    title: "Random cat picture",
                    image: {
                        url: "https://cataas.com" + JSON.parse(data).url
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