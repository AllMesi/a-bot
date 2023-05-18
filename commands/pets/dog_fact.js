const link = 'https://dogapi.dog/api/v2/facts/';
const fetch = require("node-fetch");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(__filename.slice(__dirname.length + 1, -3))
        .setDescription('doggy woggy'),
    async execute(interaction) {
        await interaction.deferReply();
        const response = await fetch(link);
        const data = await response.text();
        await interaction.editReply({
            embeds: [
                {
                    title: "Random dog fact",
                    description: JSON.parse(data).data[0].attributes.body,
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