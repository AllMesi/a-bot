const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    description: "Shows command sorted by categories",
    async execute(interaction) {
        var categories = [];
        var buttons = [];
        var buttonRows = [];

        interaction.client.commands.forEach(command => {
            if (!categories.includes(command.category)) {
                categories.push(command.category);
                if (command.category === "Owner") return;
                buttons.push(
                    new ButtonBuilder()
                        .setCustomId("help-" + command.category)
                        .setLabel(command.category)
                        .setStyle(ButtonStyle.Success)
                );
            }
        });

        buttonRows.push(new ActionRowBuilder().addComponents(buttons));

        await interaction.reply({
            components: buttonRows,
            embeds: [{
                title: `Help`,
                description: "Click on a button to show commands for a category",
                color: 0x7289DA
            }]
        });
    },
};