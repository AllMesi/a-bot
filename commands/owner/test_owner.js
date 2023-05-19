// const { ChannelType, SlashCommandBuilder } = require("discord.js");

// const allowed = ["956156042398556210"];

// module.exports = {
//     data: new SlashCommandBuilder()
//         .addStringOption(option =>
//             option.setName('id')
//                 .setDescription('id')
//                 .setRequired(false)),
//     async execute(interaction) {
//         if (!allowed.includes(interaction.user.id)) return interaction.editReply("how dare you even TRY to use this command you mere mortal");
//         interaction.client.guilds.fetch(interaction.options.getString("id") || interaction.guild.id).then(guild => {
//             const chan = guild.channels.cache
//                 .filter((channel) => channel.type === ChannelType.GuildText)
//                 .first();
//             chan.createInvite()
//                 .then(invite => interaction.reply(`https://discord.gg/${invite.code}`))
//                 .catch(console.error);
//         });
//     },
// };

// no