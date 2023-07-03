const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription('poke someone.... ye')
        .addUserOption(option =>
            option.setName("pokepoke")
                .setDescription("The person to poke")
                .setRequired(true)),
    async execute(interaction) {
        interaction.options.getUser("pokepoke").send(`<@${interaction.user.id}> poked you xd`);
        interaction.reply({
            content: `you poked <@${interaction.options.getUser("pokepoke").id}> xd`,
            ephemeral: true
        });
    },
};