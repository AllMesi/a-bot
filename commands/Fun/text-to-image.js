const Canvas = require('@napi-rs/canvas');
const { AttachmentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

function fillTextMultiLine(ctx, text, x, y) {
    var lineHeight = ctx.measureText("M").width * 1.2;
    var lines = text.split("\n");
    for (var i = 0; i < lines.length; ++i) {
        ctx.fillText(lines[i], x, y);
        y += lineHeight;
    }
}

module.exports = {
    description: 'image',
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('imageModal')
            .setTitle('Make text image');

        const xInput = new TextInputBuilder()
            .setCustomId('textXInput')
            .setLabel("Enter x of text:")
            .setPlaceholder("5")
            .setRequired(false)
            .setStyle(TextInputStyle.Short);

        const yInput = new TextInputBuilder()
            .setCustomId('textYInput')
            .setLabel("Enter y of text:")
            .setPlaceholder("5")
            .setRequired(false)
            .setStyle(TextInputStyle.Short);

        const wInput = new TextInputBuilder()
            .setCustomId('imageWInput')
            .setLabel("Enter width of image:")
            .setRequired(false)
            .setPlaceholder("1280")
            .setStyle(TextInputStyle.Short);

        const hInput = new TextInputBuilder()
            .setCustomId('imageHInput')
            .setLabel("Enter height of image:")
            .setRequired(false)
            .setPlaceholder("720")
            .setStyle(TextInputStyle.Short);

        const textInput = new TextInputBuilder()
            .setCustomId('imageTextInput')
            .setLabel("Enter text:")
            .setStyle(TextInputStyle.Paragraph);

        const x = new ActionRowBuilder().addComponents(xInput);
        const y = new ActionRowBuilder().addComponents(yInput);
        const w = new ActionRowBuilder().addComponents(wInput);
        const h = new ActionRowBuilder().addComponents(hInput);
        const text = new ActionRowBuilder().addComponents(textInput);
        modal.addComponents(x, y, w, h, text);

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
        const [textx, texty, textw, texth] = [submitted.fields.getTextInputValue('textXInput'), submitted.fields.getTextInputValue('textYInput'), submitted.fields.getTextInputValue('imageWInput'), submitted.fields.getTextInputValue('imageHInput')];
        let intx = parseInt(textx);
        let inty = parseInt(texty);
        let intw = parseInt(textw);
        let inth = parseInt(texth);
        if (isNaN(intx)) {
            intx = 5;
        }
        if (isNaN(inty)) {
            inty = 5;
        }
        if (isNaN(intw)) {
            intw = 1280;
        }
        if (isNaN(inth)) {
            inth = 720;
        }
        if (intw > 2560) {
            return await submitted.editReply("Width cant be more than 2560");
        }
        if (inth > 1440) {
            return await submitted.editReply("Height cant be more than 1440");
        }
        const canvas = Canvas.createCanvas(intw, inth);
        const context = canvas.getContext('2d');

        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#ffffff';
        context.font = "30px Arial";

        fillTextMultiLine(context, submitted.fields.getTextInputValue('imageTextInput'), intx, inty + 30);

        const png = await canvas.encode('png');
        const attachment = new AttachmentBuilder(png, { name: 'text.png' });

        submitted.editReply("ok");
        interaction.followUp({ files: [attachment] });
    },
};