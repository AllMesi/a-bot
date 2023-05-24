const link = 'https://some-random-api.com/facts/bird';
const fetch = require("node-fetch");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription('BIRB!'),
    async execute(interaction) {
        await interaction.deferReply();
        const response = await fetch(link);
        const data = await response.text();
        await interaction.editReply({
            embeds: [
                {
                    title: "Random birb fact",
                    description: JSON.parse(data).fact,
                    footer: {
                        icon_url: interaction.user.avatarURL(),
                        text: interaction.user.tag + " • fact by " + link
                    },
                    color: 0x7289DA
                }
            ]
        });
    },
};