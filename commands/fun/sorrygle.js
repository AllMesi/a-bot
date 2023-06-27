const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { Sorrygle } = require("sorrygle");
const request = require('request');

module.exports = {
    description: "write sorrygle code and get a midi in return",
    data: new SlashCommandBuilder()
        .addAttachmentOption(option =>
            option.setName("file_code")
                .setDescription("if your code has more than 4000 chars then put it into a file and upload it here")
        ),
    async execute(interaction) {
        const file = interaction.options.getAttachment("file_code");
        let fileContent;
        await interaction.deferReply();
        if (file !== null) {
            await request.get(file.attachment, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    fileContent = body;
                }
            });
            const compiled = Sorrygle.compile(fileContent);

            const midi = new AttachmentBuilder(compiled, {
                name: "output.mid"
            });

            const content = new AttachmentBuilder(fileContent, {
                name: "content.txt"
            });

            try {
                await interaction.editReply({
                    content: `${(fileContent.length > 1994 ? "" : `\`\`\`\n${fileContent}\n\`\`\``)}`,
                    files: [
                        content,
                        midi
                    ]
                });
            } catch (e) {
                await interaction.editReply(e);
            }
            return;
        }

        const modal = new ModalBuilder()
            .setCustomId('codeModal')
            .setTitle('Sorrygle Code');

        const sorrygleCodeInput = new TextInputBuilder()
            .setCustomId('sorrygleCodeInput')
            .setLabel("Enter code:")
            .setStyle(TextInputStyle.Paragraph);

        const code = new ActionRowBuilder().addComponents(sorrygleCodeInput);
        modal.addComponents(code);

        await interaction.showModal(modal);
        const submitted = await interaction.awaitModalSubmit({
            time: 2147483647,
        }).catch(error => {
            console.error(error);
            return null;
        });
        var codeText = submitted.fields.getTextInputValue('sorrygleCodeInput');
        const compiled = Sorrygle.compile(codeText);

        const midi = new AttachmentBuilder(compiled, {
            name: "output.mid"
        });

        try {
            await submitted.editReply({
                content: `\`\`\`\n${(codeText.length > 1900 ? "content too big to show" : codeText)}\n\`\`\``,
                files: [
                    midi
                ]
            });
        } catch (e) {
            await submitted.editReply(e);
        }
    },
};