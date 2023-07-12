const { ButtonBuilder, ButtonStyle, ComponentType, ActionRowBuilder, AttachmentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { create } = require('sourcebin');

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
        const canvas = Canvas.createCanvas(1280, 720);
        const context = canvas.getContext('2d');
        let drawArray = [];
        let drawTypeArray = [];
        let bg = "#000000";

        const buttons = new ActionRowBuilder();
        const buttons2 = new ActionRowBuilder();
        const buttons3 = new ActionRowBuilder();
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
                .setStyle(ButtonStyle.Secondary)
        );
        buttons2.addComponents(
            new ButtonBuilder()
                .setCustomId("resize")
                .setLabel("Resize Canvas")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("export")
                .setLabel("Export Canvas")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("import")
                .setLabel("Import Canvas")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("bgColour")
                .setLabel("Set Canvas BG Colour")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("edit")
                .setLabel("Edit Canvas JSON")
                .setStyle(ButtonStyle.Danger)
        );
        buttons3.addComponents(
            new ButtonBuilder()
                .setCustomId("release")
                .setLabel("Release Canvas")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("clear")
                .setLabel("Reset Canvas")
                .setStyle(ButtonStyle.Danger)
        );

        let update = async () => {
            context.fillStyle = `${bg}`;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = 'white';
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

        const message = await interaction.reply({
            components: [buttons, buttons2, buttons3],
            ephemeral: true
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
                    .setLabel("Enter colour of text:")
                    .setValue("#ffffff")
                    .setStyle(TextInputStyle.Short);

                const sInput = new TextInputBuilder()
                    .setCustomId('canvasTextSInput')
                    .setLabel("Enter size of text:")
                    .setMaxLength(3)
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
                const colour = submitted.fields.getTextInputValue('canvasTextCInput');
                const contents = submitted.fields.getTextInputValue('canvasImageTextInput');
                drawArray.push((ctx) => {
                    ctx.fillStyle = `${colour}`;
                    ctx.font = `${ints}px Arial`;
                    let lineHeight = ctx.measureText("M").width * 1.2;
                    fillTextMultiLine(ctx, contents, intx, inty + lineHeight);
                });
                drawTypeArray.push({
                    type: "text",
                    x: intx,
                    y: inty,
                    colour: colour,
                    size: ints,
                    contents: contents
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
                    .setLabel("Enter new background colour of canvas:")
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
                    .setLabel("Enter colour of rectangle:")
                    .setValue("#ffffff")
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
                const colour = submitted.fields.getTextInputValue('canvasRectCInput');
                drawArray.push((ctx) => {
                    ctx.fillStyle = `${colour}`;
                    ctx.fillRect(intx, inty, intw, inth);
                });
                drawTypeArray.push({
                    type: "rect",
                    x: intx,
                    y: inty,
                    colour: colour,
                    w: intw,
                    h: inth
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
                    .setLabel("Enter colour of circle:")
                    .setValue("#ffffff")
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
                const colour = submitted.fields.getTextInputValue('canvasCircCInput');
                drawArray.push((ctx) => {
                    ctx.fillStyle = `${colour}`;
                    context.beginPath();
                    context.arc(intx, inty, intr, 0, 2 * Math.PI);
                    context.fill();
                });
                drawTypeArray.push({
                    type: "circ",
                    x: intx,
                    y: inty,
                    colour: colour,
                    radius: intr
                });
                update();
                await submitted.deleteReply();
            } else if (i.customId === "export") {
                await i.deferUpdate();
                let output = {
                    width: canvas.width,
                    height: canvas.height,
                    bg: bg,
                    objects: []
                };

                for (const typeIndex in drawTypeArray) {
                    const object = drawTypeArray[typeIndex];
                    let outputStr = "";
                    switch (object.type) {
                        case "circ":
                            outputStr = `${object.type},${object.x},${object.y},${object.colour || "#ffffff"},${object.radius}`;
                            break;
                        case "rect":
                            outputStr = `${object.type},${object.x},${object.y},${object.colour || "#ffffff"},${object.w},${object.h}`;
                            break;
                        case "text":
                            outputStr = `${object.type},${object.x},${object.y},${object.colour || "#ffffff"},${object.size},${object.contents}`;
                            break;
                    }
                    output.objects.push(outputStr);
                }
                const outputFile = new AttachmentBuilder(Buffer.from(JSON.stringify(output), 'utf-8'), {
                    name: "export.json"
                });
                await interaction.followUp({
                    files: [outputFile],
                    ephemeral: true
                });
            } else if (i.customId === "import") {
                const modal = new ModalBuilder()
                    .setCustomId('canvasImportModal')
                    .setTitle('Import export');

                const eInput = new TextInputBuilder()
                    .setCustomId('canvasImportInput')
                    .setLabel("Enter export contents:")
                    .setStyle(TextInputStyle.Paragraph);

                const e = new ActionRowBuilder().addComponents(eInput);
                modal.addComponents(e);

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
                drawArray = [];
                drawTypeArray = [];
                const content = submitted.fields.getTextInputValue('canvasImportInput');
                const importExport = JSON.parse(content);
                canvas.width = importExport.width;
                canvas.height = importExport.height;
                bg = importExport.bg;
                for (let object of importExport.objects) {
                    const objectSplit = object.split(",");
                    object = [];
                    object.type = objectSplit[0];
                    object.x = Number(objectSplit[1]);
                    object.y = Number(objectSplit[2]);
                    object.colour = objectSplit[3];
                    switch (object.type) {
                        case "circ":
                            object.radius = Number(objectSplit[4]);
                            drawArray.push((ctx) => {
                                ctx.fillStyle = `${object.colour}`;
                                context.beginPath();
                                context.arc(object.x, object.y, object.radius, 0, 2 * Math.PI);
                                context.fill();
                            });
                            drawTypeArray.push({
                                type: "circ",
                                x: object.x,
                                y: object.y,
                                colour: object.colour,
                                radius: object.radius
                            });
                            break;
                        case "rect":
                            object.w = Number(objectSplit[4]);
                            object.h = Number(objectSplit[5]);
                            drawArray.push((ctx) => {
                                ctx.fillStyle = `${object.colour}`;
                                ctx.fillRect(object.x, object.y, object.w, object.h);
                            });
                            drawTypeArray.push({
                                type: "rect",
                                x: object.x,
                                y: object.y,
                                colour: object.colour,
                                w: object.w,
                                h: object.h
                            });
                            break;
                        case "text":
                            object.size = Number(objectSplit[4]);
                            object.contents = objectSplit[5];
                            drawArray.push((ctx) => {
                                ctx.fillStyle = `${object.colour}`;
                                ctx.font = `${object.size}px Arial`;
                                let lineHeight = ctx.measureText("M").width * 1.2;
                                fillTextMultiLine(ctx, object.contents, object.x, object.y + lineHeight);
                            });
                            drawTypeArray.push({
                                type: "text",
                                x: object.x,
                                y: object.y,
                                colour: object.colour,
                                contents: object.contents,
                                size: object.size
                            });
                            break;
                    }
                }
                await submitted.deleteReply();
                update();
            } else if (i.customId === "release") {
                await interaction.editReply({
                    content: "Posting export to sourcebin...",
                    files: [],
                    components: []
                });
                const png = await canvas.encode('png');
                const attachment = new AttachmentBuilder(png, { name: 'canvas.png' });
                const buttons = new ActionRowBuilder();
                let output = {
                    width: canvas.width,
                    height: canvas.height,
                    bg: bg,
                    objects: []
                };

                for (const typeIndex in drawTypeArray) {
                    const object = drawTypeArray[typeIndex];
                    output.objects.push(object);
                }

                const bin = await create(
                    {
                        title: 'a bot release',
                        description: 'a bot release bin',
                        files: [
                            {
                                content: JSON.stringify(output),
                                language: 'json',
                            },
                        ],
                    },
                );

                await interaction.deleteReply();
                buttons.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`reb-${bin.key}`)
                        .setLabel("Export")
                        .setStyle(ButtonStyle.Secondary)
                );

                await interaction.channel.send({
                    embeds: [
                        {
                            title: `Canvas released by ${interaction.user.tag}`,
                            image: {
                                url: "attachment://canvas.png"
                            },
                            footer: {
                                icon_url: interaction.user.avatarURL(),
                                text: "\u200b"
                            },
                            color: 0x7289DA
                        }
                    ],
                    files: [attachment],
                    components: [buttons]
                });
            } else if (i.customId === "clear") {
                await i.deferUpdate();
                bg = "#000000";
                canvas.width = 1280;
                canvas.height = 720;
                drawArray = [];
                drawTypeArray = [];
                update();
            } else if (i.customId === "edit") {
                let output = {
                    width: canvas.width,
                    height: canvas.height,
                    bg: bg,
                    objects: []
                };

                for (const typeIndex in drawTypeArray) {
                    const object = drawTypeArray[typeIndex];
                    let outputStr = "";
                    switch (object.type) {
                        case "circ":
                            outputStr = `${object.type},${object.x},${object.y},${object.colour || "#ffffff"},${object.radius}`;
                            break;
                        case "rect":
                            outputStr = `${object.type},${object.x},${object.y},${object.colour || "#ffffff"},${object.w},${object.h}`;
                            break;
                        case "text":
                            outputStr = `${object.type},${object.x},${object.y},${object.colour || "#ffffff"},${object.size},${object.contents}`;
                            break;
                    }
                    output.objects.push(outputStr);
                }
                const modal = new ModalBuilder()
                    .setCustomId('canvasEditModal')
                    .setTitle('Import export');

                const eInput = new TextInputBuilder()
                    .setCustomId('canvasEditInput')
                    .setLabel("Edit contents:")
                    .setValue(JSON.stringify(output))
                    .setStyle(TextInputStyle.Paragraph);

                const e = new ActionRowBuilder().addComponents(eInput);
                modal.addComponents(e);

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
                drawArray = [];
                drawTypeArray = [];
                const content = submitted.fields.getTextInputValue('canvasEditInput');
                const importExport = JSON.parse(content);
                canvas.width = importExport.width;
                canvas.height = importExport.height;
                bg = importExport.bg;
                for (let object of importExport.objects) {
                    const objectSplit = object.split(",");
                    object = [];
                    object.type = objectSplit[0];
                    object.x = Number(objectSplit[1]);
                    object.y = Number(objectSplit[2]);
                    object.colour = objectSplit[3];
                    switch (object.type) {
                        case "circ":
                            object.radius = Number(objectSplit[4]);
                            drawArray.push((ctx) => {
                                ctx.fillStyle = `${object.colour}`;
                                context.beginPath();
                                context.arc(object.x, object.y, object.radius, 0, 2 * Math.PI);
                                context.fill();
                            });
                            drawTypeArray.push({
                                type: "circ",
                                x: object.x,
                                y: object.y,
                                colour: object.colour,
                                radius: object.radius
                            });
                            break;
                        case "rect":
                            object.w = Number(objectSplit[4]);
                            object.h = Number(objectSplit[5]);
                            drawArray.push((ctx) => {
                                ctx.fillStyle = `${object.colour}`;
                                ctx.fillRect(object.x, object.y, object.w, object.h);
                            });
                            drawTypeArray.push({
                                type: "rect",
                                x: object.x,
                                y: object.y,
                                colour: object.colour,
                                w: object.w,
                                h: object.h
                            });
                            break;
                        case "text":
                            object.size = Number(objectSplit[4]);
                            object.contents = objectSplit[5];
                            drawArray.push((ctx) => {
                                ctx.fillStyle = `${object.colour}`;
                                ctx.font = `${object.size}px Arial`;
                                let lineHeight = ctx.measureText("M").width * 1.2;
                                fillTextMultiLine(ctx, object.contents, object.x, object.y + lineHeight);
                            });
                            drawTypeArray.push({
                                type: "text",
                                x: object.x,
                                y: object.y,
                                colour: object.colour,
                                contents: object.contents,
                                size: object.size
                            });
                            break;
                    }
                }
                await submitted.deleteReply();
                update();
            }
        });

        collector.on('end', () => {
            interaction.editReply({
                components: []
            });
        });
    }
};