const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName('triggered')
                .setDescription('trigger someone')
                .addUserOption(option => option.setName('user').setDescription('The user to trigger')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('comrade')
                .setDescription('o7')
                .addUserOption(option => option.setName('user').setDescription('user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('gay')
                .setDescription('not homophobic')
                .addUserOption(option => option.setName('user').setDescription('user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('jail')
                .setDescription('oh no')
                .addUserOption(option => option.setName('user').setDescription('user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('passed')
                .setDescription('success')
                .addUserOption(option => option.setName('user').setDescription('user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('wasted')
                .setDescription('D:')
                .addUserOption(option => option.setName('user').setDescription('user'))),
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();

        await interaction.deferReply();
        const avatar = (interaction.options.getUser("user") || interaction.user).displayAvatarURL({ extension: 'png' });

        switch (subCommand) {
            case "triggered": {
                const image = new AttachmentBuilder(`https://some-random-api.com/canvas/overlay/triggered/?avatar=${avatar}`, {
                    name: "triggered.gif"
                });

                await interaction.editReply({
                    files: [image]
                });
                break;
            }
            case "comrade": {
                const image = new AttachmentBuilder(`https://some-random-api.com/canvas/overlay/comrade/?avatar=${avatar}`, {
                    name: "comrade.png"
                });

                await interaction.editReply({
                    files: [image]
                });
                break;
            }
            case "gay": {
                const image = new AttachmentBuilder(`https://some-random-api.com/canvas/overlay/gay/?avatar=${avatar}`, {
                    name: "gay.png"
                });

                await interaction.editReply({
                    files: [image]
                });
                break;
            }
            case "jail": {
                const image = new AttachmentBuilder(`https://some-random-api.com/canvas/overlay/jail/?avatar=${avatar}`, {
                    name: "jail.png"
                });

                await interaction.editReply({
                    files: [image]
                });
                break;
            }
            case "passed": {
                const image = new AttachmentBuilder(`https://some-random-api.com/canvas/overlay/passed/?avatar=${avatar}`, {
                    name: "passed.png"
                });

                await interaction.editReply({
                    files: [image]
                });
                break;
            }
            case "wasted": {
                const image = new AttachmentBuilder(`https://some-random-api.com/canvas/overlay/wasted/?avatar=${avatar}`, {
                    name: "wasted.png"
                });

                await interaction.editReply({
                    files: [image]
                });
                break;
            }
        }
    },
};