const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
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
        )
        .addIntegerOption(option =>
            option.setName("delete_time")
                .setDescription("If this has a numbers then delete the message after the amount of seconds")
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(2147483647)
        ),
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });
        const deleteTime = interaction.options.getInteger("delete_time");
        let deleteMessage;
        if (!interaction.options.getString("message_reply_id")) {
            deleteMessage = interaction.guild.channels.cache.get((interaction.options.getChannel("channel") ? interaction.options.getChannel("channel").id : null) || interaction.channel.id).send({
                content: interaction.options.getString('input')
            }).then(message => {
                deleteMessage = message;
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
                    }).then(message => {
                        deleteMessage = message;
                    });
                });
        }
        if (typeof deleteTime === "number") {
            interaction.editReply({
                content: `Time left: <t:${Math.floor(new Date().getTime() / 1000) + deleteTime}:R>`,
                ephemeral: true
            });
            setTimeout(async () => {
                interaction.deleteReply();
                deleteMessage.delete();
            }, deleteTime * 1000);
        } else {
            interaction.deleteReply();
        }
    },
};