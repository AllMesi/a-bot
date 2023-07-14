const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

function abbreviateNumber(value) {
    let newValue = value;
    if (value >= 1000) {
        let suffixes = ["", "k", "m", "b", "t"];
        let suffixNum = Math.floor(("" + value).length / 3);
        let shortValue = '';
        for (let precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
            let dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
        newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription("fake tweet")
        .addStringOption(option =>
            option.setName('comment')
                .setDescription('text of the tweet')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to be tweeting as')
        )
        .addStringOption(option =>
            option.setName('theme')
                .setDescription('Dark or light')
                .setRequired(false).setChoices(
                    {
                        name: "Dark",
                        value: "dark"
                    },
                    {
                        name: "Light",
                        value: "light"
                    }
                ))
        .addIntegerOption(option =>
            option.setName("replies")
                .setDescription("replies")
        )
        .addIntegerOption(option =>
            option.setName("retweets")
                .setDescription("retweets")
        )
        .addIntegerOption(option =>
            option.setName("likes")
                .setDescription("likes")
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const theme = interaction.options.getString("theme");
        const user = (interaction.options.getUser("user") || interaction.user);
        const image = new AttachmentBuilder(`https://some-random-api.com/canvas/misc/tweet?avatar=${user.displayAvatarURL({ extension: 'png' })}&comment=${interaction.options.getString("comment")}&displayname=${user.username}&username=${user.username}&theme=${(theme === "dark" ? "dark" : (theme === "light" ? "light" : "dark"))}&replies=${abbreviateNumber(interaction.options.getInteger("replies") || 1000)}&retweets=${abbreviateNumber(interaction.options.getInteger("retweets") || 1000)}&likes=${abbreviateNumber(interaction.options.getInteger("likes") || 1000)}`, {
            name: "tweet.png"
        });

        await interaction.followUp({
            files: [image]
        });
    },
};