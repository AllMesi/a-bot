const link = 'https://some-random-api.com/animal/bird';
const fetch = require("node-fetch");

module.exports = {
    description: "birb",
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