const Canvas = require('@napi-rs/canvas');
const { AttachmentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');

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
        const newText = async (interaction) => {
            const buttons = new ActionRowBuilder();
            buttons.addComponents(
                new ButtonBuilder()
                    .setCustomId("newText")
                    .setLabel("New")
                    .setStyle(ButtonStyle.Secondary)
            );
            const modal = new ModalBuilder()
                .setCustomId('imageModal')
                .setTitle('Make text image');

            const xInput = new TextInputBuilder()
                .setCustomId('textXInput')
                .setLabel("Enter x of text:")
                .setStyle(TextInputStyle.Short);

            const yInput = new TextInputBuilder()
                .setCustomId('textYInput')
                .setLabel("Enter y of text:")
                .setStyle(TextInputStyle.Short);

            const textInput = new TextInputBuilder()
                .setCustomId('imageTextInput')
                .setLabel("Enter text:")
                .setStyle(TextInputStyle.Paragraph);

            const x = new ActionRowBuilder().addComponents(xInput);
            const y = new ActionRowBuilder().addComponents(yInput);
            const text = new ActionRowBuilder().addComponents(textInput);
            modal.addComponents(x, y, text);

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
            const canvas = Canvas.createCanvas(1280, 720);
            const context = canvas.getContext('2d');

            context.fillStyle = '#000000';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = '#ffffff';
            context.font = "30px Arial";
            const [textx, texty] = [submitted.fields.getTextInputValue('textXInput'), submitted.fields.getTextInputValue('textYInput')];
            const intx = parseInt(textx);
            const inty = parseInt(texty);
            if (isNaN(intx)) {
                return await submitted.editReply(`"${textx}" isnt a number!`);
            }
            if (isNaN(inty)) {
                return await submitted.editReply(`"${texty}" isnt a number!`);
            }

            fillTextMultiLine(context, submitted.fields.getTextInputValue('imageTextInput'), intx, inty + 30);

            const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'text.png' });

            const message = await submitted.editReply({ files: [attachment], components: [buttons] });

            const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 600000 });
            collector.on('collect', async i => {
                newText(i);
            });

            collector.on('end', () => {
                submitted.editReply({
                    components: []
                });
            });
        };
        await newText(interaction);
    },
};