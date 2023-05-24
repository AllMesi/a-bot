const link = 'https://some-random-api.com/facts/panda';
const fetch = require("node-fetch");

module.exports = {
    description: "panda",
    async execute(interaction) {
        await interaction.deferReply();
        const response = await fetch(link);
        const data = await response.text();
        await interaction.editReply({
            embeds: [
                {
                    title: "Random panda fact",
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