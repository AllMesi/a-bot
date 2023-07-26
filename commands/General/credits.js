const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    description: "Credits and stuff",
    async execute(interaction) {
        const addBot = new ButtonBuilder()
            .setLabel('Add a bot to your server')
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.com/api/oauth2/authorize?client_id=1083260472410775672&permissions=8&scope=bot%20applications.commands");

        const github = new ButtonBuilder()
            .setLabel('Github')
            .setStyle(ButtonStyle.Link)
            .setURL("https://github.com/AllMesi/a-bot");

        const discord = new ButtonBuilder()
            .setLabel('Join the discord server')
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.gg/nZq5g2Rr6S");

        const embed = new EmbedBuilder()
            .setTitle('Credits')
            .setDescription(`a bot made with stupidity by:`)
            .addFields(
                { name: "Owners", value: "[allmesi](https://discord.com/users/956156042398556210)" },
                { name: "Contributors", value: "[cat.boy.](https://discord.com/users/675492571203764236)" },
                { name: "More", value: "[discord.js](https://discord.js.org)\n[Some Random Api](https://some-random-api.com)\n[Cat as a service](https://cataas.com)\n[popcat.xyz](https://popcat.xyz)\n[go kitty go](https://www.youtube.com/watch?v=um0ETkJABmI)\n[Urban Dictionary](https://www.urbandictionary.com)\n[@napi-rs/canvas](https://www.npmjs.com/package/@napi-rs/canvas)\n[node.js](https://nodejs.org/en)\n[http.cat](https://http.cat)\n[imagescript](https://www.npmjs.com/package/imagescript)" }
            )
            .setColor(0x7289DA);

        const row = new ActionRowBuilder()
            .addComponents(addBot, github);

        const row2 = new ActionRowBuilder()
            .addComponents(discord);

        interaction.reply({
            embeds: [embed],
            components: [row, row2]
        });
    },
};