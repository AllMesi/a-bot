const link = 'https://some-random-api.com/animal/fox';
const fetch = require("node-fetch");

module.exports = {
    description: "foxxyy",
    async execute(interaction) {
        await interaction.deferReply();
        const response = await fetch(link);
        const { image, fact } = await response.json();
        await interaction.editReply({
            embeds: [
                {
                    image: {
                        url: image
                    },
                    footer: {
                        icon_url: interaction.user.avatarURL(),
                        text: fact + " | https://some-random-api.com"
                    },
                    color: 0x7289DA
                }
            ]
        });
    },
};