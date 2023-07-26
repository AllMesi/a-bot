const { Image } = require("imagescript");
const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder } = require('discord.js');
const allowed = ["956156042398556210", "675492571203764236"];

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription('evaluation. you evaluator. you'),
    async execute(interaction) {
        if (!allowed.includes(interaction.user.id)) {
            return interaction.reply({
                files: ["https://http.cat/403.jpg"]
            });
        }
        const modal = new ModalBuilder()
            .setCustomId('evalModal')
            .setTitle('Eval');

        const codeInput = new TextInputBuilder()
            .setCustomId('codeInput')
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
        let codeText = submitted.fields.getTextInputValue('codeInput');
        codeText = `(async () => {\n\t${codeText.replaceAll("\n", "\n\t")}\n})();`;
        const encoded = await eval(codeText);
        const buffer = Buffer.from(encoded);
        const attachment = new AttachmentBuilder(buffer, { name: 'thingy.png' });
        await submitted.editReply({
            files: [attachment]
        });
    }
};