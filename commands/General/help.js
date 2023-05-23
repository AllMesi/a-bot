const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    description: "Shows command sorted by categories",
    async execute(interaction) {
        var categories = [];
        var buttons = [];

        interaction.client.commands.forEach(command => {
            if (!categories.includes(command.category)) {
                categories.push(command.category);
                if (command.category === "Owner") return;
                buttons.push(
                    new ButtonBuilder()
                        .setCustomId(command.category)
                        .setLabel(command.category)
                        .setStyle(ButtonStyle.Success)
                );
            }
        });

        const row = new ActionRowBuilder()
            .addComponents(buttons);

        await interaction.reply({
            components: [row],
            embeds: [{
                title: `Help`,
                description: "Click on a button to show commands for a category",
                color: 0xff2d00
            }]
        });
    },
};