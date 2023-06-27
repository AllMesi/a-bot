const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    description: "Shows info about a github user",
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('username')
                .setDescription('the username of the user')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();
        fetch(`https://api.popcat.xyz/github/${interaction.options.getString('username')}`).then(result => {
            result.json().then(array => {
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: array.name,
                                iconURL: array.avatar
                            })
                            .setDescription(`Account type: ${array.account_type}\nCompany: ${array.company}\nBlog: ${array.blog}\nLocation: ${array.location}\nEmail: ${array.email}\nBio: ${array.bio}\nTwitter: ${array.twitter}\nRepos: ${array.public_repos}\nGists: ${array.public_gists}\nFollowers: ${array.followers}\nFollowing: ${array.following}`)
                            .setFooter({
                                text: "https://popcat.xyz/api",
                                iconURL: "https://cdn.discordapp.com/avatars/804341143092985886/9a8593553f9e8ad6a1276cffdd7ef90a.png"
                            })
                            .setColor(0x7289DA)
                    ]
                });
            });
        });
    },
};