const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ComponentType, ActionRowBuilder } = require('discord.js');

module.exports = {
    description: 'play tictactoe with someone',
    // cooldown: 60,
    data: new SlashCommandBuilder()
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to play tictactoe with')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const user = interaction.options.getUser("user");
        const buttons = new ActionRowBuilder();

        buttons.addComponents(
            new ButtonBuilder()
                .setCustomId("yes")
                .setLabel("Yes")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("no")
                .setLabel("No")
                .setStyle(ButtonStyle.Danger)
        );
        const message = await interaction.editReply({
            content: `<@!${user.id}>, <@!${interaction.user.id}> requested a game of tictactoe with you\nDo you accept? You have 10 minutes to accept or decline...`,
            components: [buttons]
        });
        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 600000 });
        collector.on('collect', async i => {
            if (i.user.id !== user.id) {
                return await i.reply({
                    content: "Not for you...",
                    ephemeral: true
                });
            }
            if (i.customId === "yes") {
                let oppositeTurn = false;
                let winCombinations = [
                    [[0, 0], [0, 1], [0, 2]],
                    [[1, 0], [1, 1], [1, 2]],
                    [[2, 0], [2, 1], [2, 2]],
                    [[0, 0], [1, 0], [2, 0]],
                    [[0, 1], [1, 1], [2, 1]],
                    [[0, 2], [1, 2], [2, 2]],
                    [[0, 0], [1, 1], [2, 2]],
                    [[0, 2], [1, 1], [2, 0]]
                ];
                let board = [
                    [[false, false], [false, false], [false, false]],
                    [[false, false], [false, false], [false, false]],
                    [[false, false], [false, false], [false, false]]
                ];
                let moveCount = 0;

                const rows = [new ActionRowBuilder(), new ActionRowBuilder(), new ActionRowBuilder()];

                rows[0].addComponents(
                    new ButtonBuilder()
                        .setCustomId("11")
                        .setLabel("\u200b")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId("12")
                        .setLabel("\u200b")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId("13")
                        .setLabel("\u200b")
                        .setStyle(ButtonStyle.Secondary)
                );

                rows[1].addComponents(
                    new ButtonBuilder()
                        .setCustomId("21")
                        .setLabel("\u200b")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId("22")
                        .setLabel("\u200b")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId("23")
                        .setLabel("\u200b")
                        .setStyle(ButtonStyle.Secondary)
                );

                rows[2].addComponents(
                    new ButtonBuilder()
                        .setCustomId("31")
                        .setLabel("\u200b")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId("32")
                        .setLabel("\u200b")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId("33")
                        .setLabel("\u200b")
                        .setStyle(ButtonStyle.Secondary)
                );
                await interaction.editReply({
                    content: `<@${i.user.id}> accepted`,
                    components: []
                });
                collector.stop();
                const username = interaction.user.username;
                const message = await interaction.editReply({
                    content: `it is <@!${interaction.user.id}>${(username.charAt(username.length - 1) === "s" ? "'" : "'s")} turn\n<@!${interaction.user.id}>: :o:\n<@!${user.id}>: :x:\n`,
                    components: rows
                });
                const boardCollector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 600000 });
                let editBoard = async (boardInteraction, row, col) => {
                    if (board[row][col][0] === true) {
                        return await boardInteraction.reply({
                            content: "Invalid spot...",
                            ephemeral: true
                        });
                    } else {
                        board[row][col] = [true, oppositeTurn];
                    }
                    moveCount++;
                    rows[row].setComponents(
                        new ButtonBuilder()
                            .setCustomId(`${row + 1}1`)
                            .setLabel("\u200b")
                            .setEmoji((board[row][0][0] ? (board[row][0][1] ? "❌" : "⭕") : {}))
                            .setDisabled(board[row][0][0])
                            .setStyle((board[row][0][0] ? (board[row][0][1] ? ButtonStyle.Danger : ButtonStyle.Success) : ButtonStyle.Secondary))
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId(`${row + 1}2`)
                            .setLabel("\u200b")
                            .setEmoji((board[row][1][0] ? (board[row][1][1] ? "❌" : "⭕") : {}))
                            .setDisabled(board[row][1][0])
                            .setStyle((board[row][1][0] ? (board[row][1][1] ? ButtonStyle.Danger : ButtonStyle.Success) : ButtonStyle.Secondary))
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId(`${row + 1}3`)
                            .setLabel("\u200b")
                            .setEmoji((board[row][2][0] ? (board[row][2][1] ? "❌" : "⭕") : {}))
                            .setDisabled(board[row][2][0])
                            .setStyle((board[row][2][0] ? (board[row][2][1] ? ButtonStyle.Danger : ButtonStyle.Success) : ButtonStyle.Secondary))
                            .setStyle(ButtonStyle.Secondary)
                    );
                    const turnUser = (oppositeTurn ? user : interaction.user);
                    const username = turnUser.username;
                    await boardInteraction.deferUpdate();
                    if (moveCount >= 5) {
                        // what the fuck this took me like 3 hours
                        for (let i = 0; i < winCombinations.length; i++) {
                            const one = board[winCombinations[i][0][0]][winCombinations[i][0][1]][0];
                            const two = board[winCombinations[i][1][0]][winCombinations[i][1][1]][0];
                            const three = board[winCombinations[i][2][0]][winCombinations[i][2][1]][0];
                            const four = board[winCombinations[i][0][0]][winCombinations[i][0][1]][1];
                            const five = board[winCombinations[i][1][0]][winCombinations[i][1][1]][1];
                            const six = board[winCombinations[i][2][0]][winCombinations[i][2][1]][1];
                            if (one && two && three && four == oppositeTurn && five == oppositeTurn && six == oppositeTurn) {
                                return await interaction.editReply({
                                    content: `<@!${(oppositeTurn ? user.id : interaction.user.id)}> won!`,
                                    components: rows
                                });
                            }
                        }
                    }
                    oppositeTurn = !oppositeTurn;
                    await interaction.editReply({
                        content: `it is <@!${turnUser.id}>${(username.charAt(username.length - 1) === "s" ? "'" : "'s")} turn\n<@!${interaction.user.id}>: :o:\n<@!${user.id}>: :x:\n`,
                        components: rows
                    });
                };
                boardCollector.on('collect', async boardInteraction => {
                    if (!oppositeTurn && boardInteraction.user.id === user.id) {
                        return await boardInteraction.reply({
                            content: `<@${interaction.user.id}> needs to pick...`,
                            ephemeral: true
                        });
                    } else if (oppositeTurn && boardInteraction.user.id === interaction.user.id) {
                        return await boardInteraction.reply({
                            content: `<@${user.id}> needs to pick...`,
                            ephemeral: true
                        });
                    }

                    editBoard(boardInteraction, Number(boardInteraction.customId.charAt(0)) - 1, Number(boardInteraction.customId.charAt(1)) - 1);
                });

                boardCollector.on('end', () => {
                    interaction.editReply({
                        components: []
                    });
                });
            } else if (i.customId === "no") {
                interaction.editReply({
                    content: `<@${i.user.id}> declined`,
                    components: []
                });
                collector.stop();
            }
        });

        collector.on('end', () => {
            interaction.editReply({
                components: []
            });
        });
    }
};