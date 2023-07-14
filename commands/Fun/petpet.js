const petPetGif = require('pet-pet-gif');
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription("patpatpatpat")
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to pet')
                .setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply();
        
        const avatar = (interaction.options.getUser("user") || interaction.user).displayAvatarURL({ extension: 'png' });

        const animatedGif = await petPetGif(avatar);

        interaction.editReply({
            files: [
                new AttachmentBuilder(animatedGif, {
                    name: "petpet.gif"
                })
            ]
        });
    },
};