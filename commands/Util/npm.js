const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const pop = require("popcat-wrapper");

module.exports = {
    description: "Shows info about an npm package",
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('package')
                .setDescription('the name of the package')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();
        pop.npm(interaction.options.getString('package')).then(array => {
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(array.name)
                        .setDescription(`Description: ${array.description}\nVersion: ${array.version}\nAuthor: ${array.author}\nMaintainers: ${array.maintainers}\nRepo: ${array.repository}\nTags: ${array.keywords}\nDownloads this year: ${array.downloads_this_year}`)
                        .setFooter({
                            text: "https://popcat.xyz/api",
                            iconURL: "https://cdn.discordapp.com/avatars/804341143092985886/9a8593553f9e8ad6a1276cffdd7ef90a.png"
                        })
                        .setColor(0x7289DA)
                ]
            });
        });
    },
};