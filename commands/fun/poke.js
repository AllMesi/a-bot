const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(__filename.slice(__dirname.length + 1, -3))
        .setDescription('poke someone.... ye')
        .addUserOption(option =>
            option.setName("pokepoke")
                .setDescription("The person to poke")
                .setRequired(true)),
    async execute(interaction) {
        interaction.options.getUser("pokepoke").send(`<@${interaction.user.id}> poked you xd`);
        await interaction.reply({
            content: `you poked <@${interaction.options.getUser("pokepoke").id}> xd`,
            ephemeral: true
        });
    },
};