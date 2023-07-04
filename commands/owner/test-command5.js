const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');

module.exports = {
    description: 'testing',
    async execute(interaction) {
        await interaction.deferReply();
        const buttons = new ActionRowBuilder();
        buttons.addComponents(
            new ButtonBuilder()
                .setCustomId("prev")
                .setLabel("Click me!")
                .setStyle(ButtonStyle.Primary)
        );
        interaction.editReply({
            content: "Counting...",
            components: [buttons]
        }).then(message => {
            const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 10000 });
            let click = 0;
            let leaderboard = {};
            collector.on('collect', async i => {
                click++;
                console.log(i.user.username);
                if (leaderboard[i.user.username] === null) {
                    leaderboard[i.user.username] = 1;
                    console.log(i.user.username, +leaderboard[i.user.username], leaderboard[i.user.username], 1);
                } else {
                    leaderboard[i.user.username] = leaderboard[i.user.username] + 1;
                    console.log(i.user.username, +leaderboard[i.user.username], leaderboard[i.user.username], 1);
                }
                await i.update("Counting...");
            });

            collector.on('end', () => {
                let formatted = "";
                for (const username in leaderboard) {
                    console.log(username, leaderboard, leaderboard[username]);
                    formatted += `${username} - ${leaderboard[username]}\n`;
                }
                interaction.editReply({
                    content: `End!\nThe button was clicked a total of ${click} times\nLeaderboard:\n${formatted}`,
                    components: []
                });
            });
        });
    },
};