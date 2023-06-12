const link = 'https://some-random-api.com/animal/panda';
const fetch = require("node-fetch");

module.exports = {
    description: "pamda",
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
                        text: fact
                    },
                    color: 0x7289DA
                }
            ]
        });
    },
};