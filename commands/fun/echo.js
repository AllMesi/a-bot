const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(__filename.slice(__dirname.length + 1, -3))
        .setDescription('echo echo echo')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to echo back')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Which channel to send the echo in (default: Current)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('message_reply_id')
                .setDescription('Reply to a message? (default: None)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('message_reply_ping')
                .setDescription('Mention the user that made the message in the reply? (default: True or None)')
                .setRequired(false)
                .setChoices(...[
                    {
                        name: "True",
                        value: "true"
                    },
                    {
                        name: "False",
                        value: "false"
                    }
                ])
        ),
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });
        if (!interaction.options.getString("message_reply_id")) {
            interaction.guild.channels.cache.get((interaction.options.getChannel("channel") ? interaction.options.getChannel("channel").id : null) || interaction.channel.id).send({
                content: interaction.options.getString('input')
            });
        } else {
            const mrp = interaction.options.getString("message_reply_ping");
            interaction.guild.channels.cache.get((interaction.options.getChannel("channel") ? interaction.options.getChannel("channel").id : null) || interaction.channel.id).messages.fetch(interaction.options.getString("message_reply_id"))
                .then(msg => {
                    msg.reply({
                        allowedMentions: {
                            repliedUser: (mrp === "true" ? true : (mrp === "false" ? false : true)) // this is very readable
                        },
                        content: interaction.options.getString('input')
                    });
                });
        }
        await interaction.editReply({
            content: "Done",
            ephemeral: true
        });
    },
};