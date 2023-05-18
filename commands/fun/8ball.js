const ball = [
    "Better not tell you now",
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes definitely",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "No",
    "Signs point to yes",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful",
    "Try again",
    "I have no clue",
    "Ah my bad, I missed that, can you repeat that?",
    "You may rely on it",
];

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(__filename.slice(__dirname.length + 1, -3))
        .setDescription('8ball will tell your future')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The input to 8ball idk')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply({
            embeds: [
                {
                    author: {
                        name: interaction.user.tag,
                        icon_url: interaction.user.avatarURL()
                    },
                    color: 0x0099FF,
                    fields: [
                        {
                            name: "Question",
                            value: `*${interaction.options.getString('question').replaceAll("*", "\\*")}*`
                        },
                        {
                            name: "Answer",
                            value: ball[Math.floor(Math.random() * ball.length)]
                        }
                    ]
                }
            ]
        });
    },
};