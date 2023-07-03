const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const allowed = ["956156042398556210", "675492571203764236"];

module.exports = {
    description: 'testing',
    async execute(interaction) {
        if (!allowed.includes(interaction.user.id)) return interaction.editReply("how dare you even TRY to use this command you mere mortal");
        let buttons = new ActionRowBuilder();
        for (let i = 0; i < 5; i++) {
            buttons.addComponents(new ButtonBuilder()
                .setCustomId("button " + i)
                .setLabel("button " + i)
                .setStyle(ButtonStyle.Success)
            );
        }
        const message = await interaction.reply({
            components: [buttons]
        });
        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 600000 });
        collector.on('collect', i => {
            if (i.user.id === interaction.user.id) {
                i.update(`${i.user.tag} clicked on the ${i.customId} button.`);
            } else {
                i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
            }
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });
    },
};