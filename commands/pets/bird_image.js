const link = 'https://shibe.online/api/birds';
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
                    title: "Random bird picture",
                    image: {
                        url: JSON.parse(data)[0]
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