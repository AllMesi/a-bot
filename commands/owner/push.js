const { SlashCommandBuilder } = require('discord.js');
const { exec } = require("child_process");
const allowed = ["956156042398556210"];

module.exports = {
    description: 'push to github',
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The commit text')
                .setRequired(true)),
    async execute(interaction) {
        if (!allowed.includes(interaction.user.id)) {
            return interaction.reply({
                files: ["https://http.cat/403.jpg"]
            });
        }
        await interaction.deferReply();
        exec(`push ${interaction.options.getString('text')}`, () => {
            interaction.editReply("Done");
        });
    },
};