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
                { name: "Owners", value: "allmesi#5039" },
                { name: "Contributors", value: "catboy#7027" }
            )
            .setColor(0xff2d00);

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