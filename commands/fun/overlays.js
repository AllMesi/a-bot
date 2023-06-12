const { SlashCommandBuilder } = require('discord.js');

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
                .addUserOption(option => option.setName('user').setDescription('user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('horny')
                .setDescription('???')
                .addUserOption(option => option.setName('user').setDescription('user'))),
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();

        await interaction.deferReply();
        const avatar = (interaction.options.getUser("user") || interaction.user).displayAvatarURL({ extension: 'png' });

        switch (subCommand) {
            case "triggered": {
                await interaction.editReply({
                    files: [`https://some-random-api.com/canvas/overlay/triggered/?avatar=${avatar}`]
                });
                break;
            }
            case "comrade": {
                await interaction.editReply({
                    files: [`https://some-random-api.com/canvas/overlay/comrade/?avatar=${avatar}`]
                });
                break;
            }
            case "gay": {
                await interaction.editReply({
                    files: [`https://some-random-api.com/canvas/overlay/gay/?avatar=${avatar}`]
                });
                break;
            }
            case "jail": {
                await interaction.editReply({
                    files: [`https://some-random-api.com/canvas/overlay/jail/?avatar=${avatar}`]
                });
                break;
            }
            case "passed": {
                await interaction.editReply({
                    files: [`https://some-random-api.com/canvas/overlay/passed/?avatar=${avatar}`]
                });
                break;
            }
            case "wasted": {
                await interaction.editReply({
                    files: [`https://some-random-api.com/canvas/overlay/wasted/?avatar=${avatar}`]
                });
                break;
            }
            case "horny": {
                await interaction.editReply({
                    files: [`https://some-random-api.com/canvas/misc/horny/?avatar=${avatar}`]
                });
                break;
            }
        }
    },
};