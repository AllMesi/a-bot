const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const isValidUrl = urlString => {
    try {
        return Boolean(new URL(urlString));
    }
    catch (e) {
        return false;
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription("Make a bot say something")
        .addStringOption(option =>
            option.setName('content')
                .setDescription('The text in the message')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('has_embed')
                .setDescription('Does the message have an embed? (Default: False)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the embed (Default: None)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The description of the embed (Default: None)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The url on the title of the embed (Default: None)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('footer')
                .setDescription('The footer text (Default: None)')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('footer_pfp')
                .setDescription('Put your pfp next to the footer (Default: False)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('colour')
                .setDescription('Colour of the embed in hex code (Default: None)')
                .setRequired(false))
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
                .setMaxValue(600)
        ),
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });
        // variable hell!!
        const avatar = interaction.user.displayAvatarURL({ extension: 'png' });
        const hasEmbed = interaction.options.getBoolean("has_embed");
        const title = interaction.options.getString("title");
        const description = interaction.options.getString("description");
        const footer = interaction.options.getString("footer") || null;
        const footer_pfp = (interaction.options.getBoolean("footer_pfp") ? avatar : null);
        const colour = interaction.options.getString("colour");
        const url = interaction.options.getString("url");
        const content = interaction.options.getString("content") || "";
        const deleteTime = interaction.options.getInteger("delete_time");
        let deleteMessage;
        if (hasEmbed && title === null) {
            return await interaction.editReply({
                content: "The embed must have a title",
                ephemeral: true
            });
        }
        if (colour !== null && hasEmbed && colour.length !== 6 && colour.length !== 7) {
            return await interaction.editReply({
                content: "Colour must be 6-7 chars",
                ephemeral: true
            });
        }
        if (url !== null && hasEmbed && !isValidUrl(url)) {
            return await interaction.editReply({
                content: "URL must a valid url",
                ephemeral: true
            });
        }
        if (!interaction.options.getString("message_reply_id")) {
            interaction.guild.channels.fetch((interaction.options.getChannel("channel") ? interaction.options.getChannel("channel").id : null) || interaction.channel.id).then(channel => {
                channel.send({
                    content: content,
                    embeds: (hasEmbed ? [
                        new EmbedBuilder()
                            .setTitle(title)
                            .setURL(url)
                            .setDescription(description)
                            .setFooter({
                                text: footer,
                                iconURL: footer_pfp
                            })
                            .setColor(colour)
                    ] : null)
                }).then(message => {
                    deleteMessage = message;
                });
            });
        } else {
            const mrp = interaction.options.getString("message_reply_ping");
            interaction.guild.channels.fetch((interaction.options.getChannel("channel") ? interaction.options.getChannel("channel").id : null) || interaction.channel.id).then(channel => {
                channel.messages.fetch(interaction.options.getString("message_reply_id"))
                    .then(msg => {
                        msg.reply({
                            allowedMentions: {
                                repliedUser: (mrp === "true" ? true : (mrp === "false" ? false : true)) // this is very readable
                            },
                            content: content,
                            embeds: (hasEmbed ? [
                                new EmbedBuilder()
                                    .setTitle(title)
                                    .setURL(url)
                                    .setDescription(description)
                                    .setFooter({
                                        text: footer,
                                        iconURL: footer_pfp
                                    })
                                    .setColor(colour)
                            ] : null)
                        }).then(message => {
                            deleteMessage = message;
                        });
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