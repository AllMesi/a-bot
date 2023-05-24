const link = 'https://some-random-api.com/facts/fox';
const fetch = require("node-fetch");

module.exports = {
    description: "i love foxes <3",
    async execute(interaction) {
        await interaction.deferReply();
        const response = await fetch(link);
        const data = await response.text();
        await interaction.editReply({
            embeds: [
                {
                    title: "Random fox fact",
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