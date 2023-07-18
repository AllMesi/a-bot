const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    async execute(interaction) {
        const select = new StringSelectMenuBuilder()
            .setCustomId('starter')
            .setPlaceholder('Make a selection!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Text object')
                    .setDescription('Content: test')
                    .setValue('textobj')
                    .setEmoji("<:left:1125408011310080041>")
            );

        const row = new ActionRowBuilder()
            .addComponents(select);

        await interaction.reply({
            content: 'Which object do you want to delete?',
            components: [row],
            ephemeral: true
        });
    },
};
