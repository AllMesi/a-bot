const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ComponentType, ActionRowBuilder } = require('discord.js');

module.exports = {
    description: 'this is currently very broken.',
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });
        const rows = [new ActionRowBuilder(), new ActionRowBuilder(), new ActionRowBuilder(), new ActionRowBuilder(), new ActionRowBuilder()];
        let isWhite = [
            [false, false, false, false, false],
            [false, false, false, false, false],
            [false, false, false, false, false],
            [false, false, false, false, false],
            [false, false, false, false, false]
        ];

        for (let i = 0; i < 5; i++) {
            rows[i].addComponents(
                new ButtonBuilder()
                    .setCustomId(`${i + 1}1`)
                    .setEmoji("⬛")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`${i + 1}2`)
                    .setEmoji("⬛")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`${i + 1}3`)
                    .setEmoji("⬛")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`${i + 1}4`)
                    .setEmoji("⬛")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`${i + 1}5`)
                    .setEmoji("⬛")
                    .setStyle(ButtonStyle.Secondary)
            );
        }
        const message = await interaction.editReply({
            components: rows
        });
        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 600000 });

        collector.on("collect", async i => {
            isWhite[Number(i.customId.charAt(0)) - 1][Number(i.customId.charAt(1)) - 1] = !isWhite[Number(i.customId.charAt(0)) - 1][Number(i.customId.charAt(1)) - 1];
            rows[Number(i.customId.charAt(0)) - 1].setComponents(
                new ButtonBuilder()
                    .setCustomId(`${i + 1}1`)
                    .setEmoji((Number(i.customId.charAt(1)) - 1 === 0 ? (isWhite[Number(i.customId.charAt(0)) - 1][Number(i.customId.charAt(1)) - 1] ? "⬜" : "⬛") : rows[Number(i.customId.charAt(0)) - 1].components[0].data.emoji))
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`${i + 1}2`)
                    .setEmoji((Number(i.customId.charAt(1)) - 1 === 1 ? (isWhite[Number(i.customId.charAt(0)) - 1][Number(i.customId.charAt(1)) - 1] ? "⬜" : "⬛") : rows[Number(i.customId.charAt(0)) - 1].components[0].data.emoji))
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`${i + 1}3`)
                    .setEmoji((Number(i.customId.charAt(1)) - 1 === 2 ? (isWhite[Number(i.customId.charAt(0)) - 1][Number(i.customId.charAt(1)) - 1] ? "⬜" : "⬛") : rows[Number(i.customId.charAt(0)) - 1].components[0].data.emoji))
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`${i + 1}4`)
                    .setEmoji((Number(i.customId.charAt(1)) - 1 === 3 ? (isWhite[Number(i.customId.charAt(0)) - 1][Number(i.customId.charAt(1)) - 1] ? "⬜" : "⬛") : rows[Number(i.customId.charAt(0)) - 1].components[0].data.emoji))
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`${i + 1}5`)
                    .setEmoji((Number(i.customId.charAt(1)) - 1 === 4 ? (isWhite[Number(i.customId.charAt(0)) - 1][Number(i.customId.charAt(1)) - 1] ? "⬜" : "⬛") : rows[Number(i.customId.charAt(0)) - 1].components[0].data.emoji))
                    .setStyle(ButtonStyle.Secondary)
            );
            await i.deferUpdate();
            await interaction.editReply({
                components: rows
            });
        });

        collector.on('end', () => {
            interaction.editReply({
                components: []
            });
        });
    }
};