const { ButtonBuilder, ButtonStyle, ComponentType, ActionRowBuilder, AttachmentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Canvas = require('@napi-rs/canvas');

function fillTextMultiLine(ctx, text, x, y) {
    var lineHeight = ctx.measureText("M").width * 1.2;
    var lines = text.split("\n");
    for (var i = 0; i < lines.length; ++i) {
        ctx.fillText(lines[i], x, y);
        y += lineHeight;
    }
}

module.exports = {
    description: 'this is currently very broken.',
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });
        const canvas = Canvas.createCanvas(1280, 720);
        const context = canvas.getContext('2d');
        let drawArray = [];
        let bg = "000000";

        const buttons = new ActionRowBuilder();
        const buttons2 = new ActionRowBuilder();
        buttons.addComponents(
            new ButtonBuilder()
                .setCustomId("text")
                .setLabel("New Text Object")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("rect")
                .setLabel("New Rectangle Object")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("circ")
                .setLabel("New Circle Object")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("resize")
                .setLabel("Resize Canvas")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("bgColour")
                .setLabel("Set BG Colour")
                .setStyle(ButtonStyle.Secondary)
        );
        buttons2.addComponents(
            new ButtonBuilder()
                .setCustomId("release")
                .setLabel("Release")
                .setStyle(ButtonStyle.Secondary)
        );

        let update = async () => {
            context.fillStyle = `#${bg}`;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = '#ffffff';
            context.font = "32px Arial";
            for (const func of drawArray) {
                func(context);
            }
            const png = await canvas.encode('png');
            const attachment = new AttachmentBuilder(png, { name: 'canvas.png' });
            await interaction.editReply({
                files: [attachment]
            });
        };

        const message = await interaction.editReply({
            components: [buttons, buttons2]
        });
        update();
        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 3.6e+6 });

        collector.on("collect", async i => {
            if (i.customId === "text") {
                const modal = new ModalBuilder()
                    .setCustomId('canvasTextModal')
                    .setTitle('Make text');

                const xInput = new TextInputBuilder()
                    .setCustomId('canvasTextXInput')
                    .setLabel("Enter x of text:")
                    .setValue("5")
                    .setStyle(TextInputStyle.Short);

                const yInput = new TextInputBuilder()
                    .setCustomId('canvasTextYInput')
                    .setLabel("Enter y of text:")
                    .setValue("5")
                    .setStyle(TextInputStyle.Short);

                const cInput = new TextInputBuilder()
                    .setCustomId('canvasTextCInput')
                    .setLabel("Enter hex colour of text:")
                    .setMaxLength(6)
                    .setMinLength(6)
                    .setValue("ffffff")
                    .setStyle(TextInputStyle.Short);

                const sInput = new TextInputBuilder()
                    .setCustomId('canvasTextSInput')
                    .setLabel("Enter size of text:")
                    .setMaxLength(2)
                    .setMinLength(1)
                    .setValue("32")
                    .setStyle(TextInputStyle.Short);

                const textInput = new TextInputBuilder()
                    .setCustomId('canvasImageTextInput')
                    .setLabel("Enter text:")
                    .setStyle(TextInputStyle.Paragraph);

                const x = new ActionRowBuilder().addComponents(xInput);
                const y = new ActionRowBuilder().addComponents(yInput);
                const text = new ActionRowBuilder().addComponents(textInput);
                const c = new ActionRowBuilder().addComponents(cInput);
                const s = new ActionRowBuilder().addComponents(sInput);
                modal.addComponents(x, y, c, s, text);

                await i.showModal(modal);
                const submitted = await i.awaitModalSubmit({
                    time: 2147483647,
                }).catch(error => {
                    console.error(error);
                    return null;
                });
                await submitted.deferReply({
                    ephemeral: true
                });
                const [textx, texty, texts] = [submitted.fields.getTextInputValue('canvasTextXInput'), submitted.fields.getTextInputValue('canvasTextYInput'), submitted.fields.getTextInputValue('canvasTextSInput')];
                let intx = parseInt(textx);
                let inty = parseInt(texty);
                let ints = parseInt(texts);
                if (isNaN(intx)) {
                    return await submitted.editReply(`"${textx} isnt a number!"`);
                }
                if (isNaN(inty)) {
                    return await submitted.editReply(`"${texty} isnt a number!"`);
                }
                if (isNaN(ints)) {
                    return await submitted.editReply(`"${texts} isnt a number!"`);
                }
                drawArray.push((ctx) => {
                    ctx.fillStyle = `#${submitted.fields.getTextInputValue('canvasTextCInput')}`;
                    ctx.font = `${ints}px Arial`;
                    fillTextMultiLine(ctx, submitted.fields.getTextInputValue('canvasImageTextInput'), intx, inty + (context.font.substring(0, 2).charAt(1) === "p" ? Number(context.font.charAt(0)) : Number(context.font.substring(0, 2))));
                });
                update();
                await submitted.deleteReply();
            } else if (i.customId === "resize") {
                const modal = new ModalBuilder()
                    .setCustomId('canvasResizeModal')
                    .setTitle('Resize canvas');

                const wInput = new TextInputBuilder()
                    .setCustomId('canvasWInput')
                    .setLabel("Enter width of canvas:")
                    .setStyle(TextInputStyle.Short);

                const hInput = new TextInputBuilder()
                    .setCustomId('canvasHInput')
                    .setLabel("Enter height of canvas:")
                    .setStyle(TextInputStyle.Short);

                const w = new ActionRowBuilder().addComponents(wInput);
                const h = new ActionRowBuilder().addComponents(hInput);
                modal.addComponents(w, h);

                await i.showModal(modal);
                const submitted = await i.awaitModalSubmit({
                    time: 2147483647,
                }).catch(error => {
                    console.error(error);
                    return null;
                });
                await submitted.deferReply({
                    ephemeral: true
                });
                const [textw, texth] = [submitted.fields.getTextInputValue('canvasWInput'), submitted.fields.getTextInputValue('canvasHInput')];
                let intw = parseInt(textw);
                let inth = parseInt(texth);
                if (isNaN(intw)) {
                    return await submitted.editReply(`"${textw} isnt a number!"`);
                }
                if (isNaN(inth)) {
                    return await submitted.editReply(`"${texth} isnt a number!"`);
                }
                canvas.width = intw;
                canvas.height = inth;
                update();
                await submitted.deleteReply();
            } else if (i.customId === "bgColour") {
                const modal = new ModalBuilder()
                    .setCustomId('canvasBGColourModal')
                    .setTitle('Change background colour of canvas');

                const cInput = new TextInputBuilder()
                    .setCustomId('canvasBGColourInput')
                    .setLabel("Enter new background colour of canvas in hex:")
                    .setMaxLength(6)
                    .setMinLength(6)
                    .setStyle(TextInputStyle.Short);

                const c = new ActionRowBuilder().addComponents(cInput);
                modal.addComponents(c);

                await i.showModal(modal);
                const submitted = await i.awaitModalSubmit({
                    time: 2147483647,
                }).catch(error => {
                    console.error(error);
                    return null;
                });
                await submitted.deferReply({
                    ephemeral: true
                });
                bg = submitted.fields.getTextInputValue('canvasBGColourInput');
                update();
                await submitted.deleteReply();
            } else if (i.customId === "rect") {
                const modal = new ModalBuilder()
                    .setCustomId('canvasRectModal')
                    .setTitle('Make rectangle');

                const xInput = new TextInputBuilder()
                    .setCustomId('canvasRectXInput')
                    .setLabel("Enter x of rectangle:")
                    .setValue("100")
                    .setStyle(TextInputStyle.Short);

                const yInput = new TextInputBuilder()
                    .setCustomId('canvasRectYInput')
                    .setLabel("Enter y of rectangle:")
                    .setValue("100")
                    .setStyle(TextInputStyle.Short);

                const wInput = new TextInputBuilder()
                    .setCustomId('canvasRectWInput')
                    .setLabel("Enter width of rectangle:")
                    .setValue("100")
                    .setStyle(TextInputStyle.Short);

                const hInput = new TextInputBuilder()
                    .setCustomId('canvasRectHInput')
                    .setLabel("Enter height of rectangle:")
                    .setValue("100")
                    .setStyle(TextInputStyle.Short);

                const cInput = new TextInputBuilder()
                    .setCustomId('canvasRectCInput')
                    .setLabel("Enter hex colour of rectangle:")
                    .setMaxLength(6)
                    .setMinLength(6)
                    .setValue("ffffff")
                    .setStyle(TextInputStyle.Short);

                const x = new ActionRowBuilder().addComponents(xInput);
                const y = new ActionRowBuilder().addComponents(yInput);
                const w = new ActionRowBuilder().addComponents(wInput);
                const h = new ActionRowBuilder().addComponents(hInput);
                const c = new ActionRowBuilder().addComponents(cInput);
                modal.addComponents(x, y, w, h, c);

                await i.showModal(modal);
                const submitted = await i.awaitModalSubmit({
                    time: 2147483647,
                }).catch(error => {
                    console.error(error);
                    return null;
                });
                await submitted.deferReply({
                    ephemeral: true
                });
                const [rectx, recty, rectw, recth] = [submitted.fields.getTextInputValue('canvasRectXInput'), submitted.fields.getTextInputValue('canvasRectYInput'),
                submitted.fields.getTextInputValue('canvasRectWInput'), submitted.fields.getTextInputValue('canvasRectHInput')];
                let intx = parseInt(rectx);
                let inty = parseInt(recty);
                let intw = parseInt(rectw);
                let inth = parseInt(recth);
                if (isNaN(intx)) {
                    return await submitted.editReply(`"${rectx} isnt a number!"`);
                }
                if (isNaN(inty)) {
                    return await submitted.editReply(`"${recty} isnt a number!"`);
                }
                if (isNaN(intw)) {
                    return await submitted.editReply(`"${rectw} isnt a number!"`);
                }
                if (isNaN(inth)) {
                    return await submitted.editReply(`"${recth} isnt a number!"`);
                }
                drawArray.push((ctx) => {
                    ctx.fillStyle = `#${submitted.fields.getTextInputValue('canvasRectCInput')}`;
                    ctx.fillRect(intx, inty, intw, inth);
                });
                update();
                await submitted.deleteReply();
            } else if (i.customId === "circ") {
                const modal = new ModalBuilder()
                    .setCustomId('canvasCircModal')
                    .setTitle('Make circle');

                const xInput = new TextInputBuilder()
                    .setCustomId('canvasCircXInput')
                    .setLabel("Enter x of circle:")
                    .setValue("100")
                    .setStyle(TextInputStyle.Short);

                const yInput = new TextInputBuilder()
                    .setCustomId('canvasCircYInput')
                    .setLabel("Enter y of circle:")
                    .setValue("100")
                    .setStyle(TextInputStyle.Short);

                const rInput = new TextInputBuilder()
                    .setCustomId('canvasCircRInput')
                    .setLabel("Enter radius of circle:")
                    .setValue("100")
                    .setStyle(TextInputStyle.Short);

                const cInput = new TextInputBuilder()
                    .setCustomId('canvasCircCInput')
                    .setLabel("Enter hex colour of circle:")
                    .setMaxLength(6)
                    .setMinLength(6)
                    .setValue("ffffff")
                    .setStyle(TextInputStyle.Short);

                const x = new ActionRowBuilder().addComponents(xInput);
                const y = new ActionRowBuilder().addComponents(yInput);
                const r = new ActionRowBuilder().addComponents(rInput);
                const c = new ActionRowBuilder().addComponents(cInput);
                modal.addComponents(x, y, r, c);

                await i.showModal(modal);
                const submitted = await i.awaitModalSubmit({
                    time: 2147483647,
                }).catch(error => {
                    console.error(error);
                    return null;
                });
                await submitted.deferReply({
                    ephemeral: true
                });
                const [circx, circy, circr] = [submitted.fields.getTextInputValue('canvasCircXInput'), submitted.fields.getTextInputValue('canvasCircYInput'),
                submitted.fields.getTextInputValue('canvasCircRInput')];
                let intx = parseInt(circx);
                let inty = parseInt(circy);
                let intr = parseInt(circr);
                if (isNaN(intx)) {
                    return await submitted.editReply(`"${circx} isnt a number!"`);
                }
                if (isNaN(inty)) {
                    return await submitted.editReply(`"${circy} isnt a number!"`);
                }
                if (isNaN(intr)) {
                    return await submitted.editReply(`"${circr} isnt a number!"`);
                }
                drawArray.push((ctx) => {
                    ctx.fillStyle = `#${submitted.fields.getTextInputValue('canvasCircCInput')}`;
                    context.beginPath();
                    context.arc(intx, inty, intr, 0, 2 * Math.PI);
                    context.fill();
                });
                update();
                await submitted.deleteReply();
            } else if (i.customId === "release") {
                await interaction.deleteReply();
                const png = await canvas.encode('png');
                const attachment = new AttachmentBuilder(png, { name: 'canvas.png' });
                await interaction.followUp({
                    files: [attachment]
                });
            }
        });

        collector.on('end', () => {
            interaction.editReply({
                components: []
            });
        });
    }
};