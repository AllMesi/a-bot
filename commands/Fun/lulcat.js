const { SlashCommandBuilder } = require('discord.js');
const pop = require("popcat-wrapper");

module.exports = {
    description: "lulcat",
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('text')
                .setDescription('the text to lulcat')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();
        pop.lulcat(interaction.options.getString('text')).then(text => {
            interaction.editReply(text);
        });
    },
};