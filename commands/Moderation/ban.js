const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription('Ban someone')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the ban')
                .setRequired(false)),
    async execute(interaction) {
        const member = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason") || "No reason provided";
        if (interaction.member.roles.highest.position < member.roles.highest.position)
            return await interaction.reply({
                content: `You cannot ban anyone who has higher roles than you!`,
                ephemeral: true
            });

        if (!member.bannable)
            return await interaction.reply({
                content: `I cant ban this person!`,
                ephemeral: true
            });

        if (member.id === interaction.user.id)
            return await interaction.reply({
                content: "You cant ban yourself!",
                ephemeral: true
            });

        if (interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            await member.ban(reason);
            await member.send(`You've been banned from \`${interaction.guild.name}\` for reason: \`${reason}\``);
            return await interaction.reply({
                content: `You banned \`${member.tag}\` for reason: \`${reason}\``,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: "You dont have the permissions to ban!",
                ephemeral: true
            });
        }
    },
};