const link = 'https://cataas.com/cat?json=true';
const fetch = require("node-fetch");

module.exports = {
    description: "cataas",
    async execute(interaction) {
        await interaction.deferReply();
        const response = await fetch(link);
        const { tags, url } = await response.json();
        await interaction.editReply({
            embeds: [
                {
                    image: {
                        url: `https://cataas.com${url}`
                    },
                    footer: {
                        icon_url: interaction.user.avatarURL(),
                        text: `Tags: ${(tags.length === 0 ? "No tags" : tags.join(", "))} | https://cataas.com`
                    },
                    color: 0x7289DA
                }
            ]
        });
    },
};