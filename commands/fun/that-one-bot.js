module.exports = {
    async execute(interaction) {
        interaction.reply({
            content: "friend bot\nhttps://discord.com/api/oauth2/authorize?client_id=1029797408323936286&permissions=8&scope=applications.commands%20bot",
            ephemeral: true
        });
    },
};