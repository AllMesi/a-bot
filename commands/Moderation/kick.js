const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription('Kick someone')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the kick')
                .setRequired(false)),
    async execute(interaction) {
        const member = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason") || "No reason provided";
        if (interaction.member.roles.highest.position < member.roles.highest.position)
            return await interaction.reply({
                content: `You cannot kick anyone who has higher roles than you!`,
                ephemeral: true
            });

        if (!member.kickable)
            return await interaction.reply({
                content: `I cant kick this person!`,
                ephemeral: true
            });

        if (member.id === interaction.user.id)
            return await interaction.reply({
                content: "You cant kick yourself!",
                ephemeral: true
            });

        if (interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            await member.kick(reason).then(() => {
                member.send(`You've been kicked from \`${interaction.guild.name}\` for reason: \`${reason}\``).then(() => {
                    interaction.reply({
                        content: `You kicked \`${member.tag}\` for reason: \`${reason}\``,
                        ephemeral: true
                    });
                });
            });
        } else {
            await interaction.reply({
                content: "You dont have the permissions to kick!",
                ephemeral: true
            });
        }
    },
};