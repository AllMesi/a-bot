const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const allowed = ["956156042398556210", "675492571203764236"];
const fs = require("fs");

module.exports = {
    description: 'reloads a command',
    async execute(interaction) {
        if (!allowed.includes(interaction.user.id)) return interaction.reply({
            files: ["https://http.cat/401.jpg"]
        });
        const modal = new ModalBuilder()
            .setCustomId('templateModal')
            .setTitle('Make template');

        const nameInput = new TextInputBuilder()
            .setCustomId('templateNameInput')
            .setLabel("Enter name:")
            .setStyle(TextInputStyle.Short);
        const codeInput = new TextInputBuilder()
            .setCustomId('templateCodeInput')
            .setLabel("Enter code:")
            .setStyle(TextInputStyle.Paragraph);

        const code = new ActionRowBuilder().addComponents(codeInput);
        const name = new ActionRowBuilder().addComponents(nameInput);
        modal.addComponents(name, code);

        await interaction.showModal(modal);
        const submitted = await interaction.awaitModalSubmit({
            time: 2147483647,
        }).catch(error => {
            console.error(error);
            return null;
        });
        await submitted.deferReply({
            ephemeral: true
        });
        let codeText = submitted.fields.getTextInputValue('templateCodeInput');
        let templateName = submitted.fields.getTextInputValue('templateNameInput');
        fs.writeFileSync(`./evalCodeTemplates/${templateName}`, codeText);
        await submitted.editReply(`Created template \`${templateName}\`\nWith code:\n\`\`\`js\n${codeText}\n\`\`\``);
    },
};