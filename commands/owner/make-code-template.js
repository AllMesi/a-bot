const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const allowed = ["956156042398556210", "675492571203764236"];
const fs = require("fs");

module.exports = {
    description: 'reloads a command',
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('template_name')
                .setDescription('The template name to create')
                .setRequired(true)),
    async execute(interaction) {
        if (!allowed.includes(interaction.user.id)) return interaction.reply("how dare you even TRY to use this command you mere mortal");
        const templateName = interaction.options.getString('template_name');
        const modal = new ModalBuilder()
            .setCustomId('templateModal')
            .setTitle('Make template');

        const codeInput = new TextInputBuilder()
            .setCustomId('templateCodeInput')
            .setLabel("Enter code:")
            .setStyle(TextInputStyle.Paragraph);

        const code = new ActionRowBuilder().addComponents(codeInput);
        modal.addComponents(code);

        await interaction.showModal(modal);
        const submitted = await interaction.awaitModalSubmit({
            time: 2147483647,
        }).catch(error => {
            console.error(error);
            return null;
        });
        await submitted.deferReply();
        let codeText = submitted.fields.getTextInputValue('templateCodeInput');
        fs.writeFileSync(`./evalCodeTemplates/${templateName}`, codeText);
        await submitted.editReply("Done");
    },
};