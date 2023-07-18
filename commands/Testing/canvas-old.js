const { ButtonBuilder, ButtonStyle, ComponentType, ActionRowBuilder, AttachmentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
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

const drawTypeArrayToStringArray = (canvas, bg, drawTypeArray) => {
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
                outputStr = `${object.type},${object.x},${object.y},${object.colour || "#ffffff"},${object.id},${object.radius}`;
                break;
            case "rect":
                outputStr = `${object.type},${object.x},${object.y},${object.colour || "#ffffff"},${object.id},${object.w},${object.h}`;
                break;
            case "text":
                outputStr = `${object.type},${object.x},${object.y},${object.colour || "#ffffff"},${object.id},${object.size},${object.content}`;
                break;
        }
        output.objects.push(outputStr);
    }
    return output;
};

module.exports = {
    description: 'do stuff on a canvas idk',
    async execute(interaction) {
        const canvas = Canvas.createCanvas(1280, 720);
        const context = canvas.getContext('2d');
        let curObjectID = -1;
        let drawArray = [];
        let drawTypeArray = [];
        let bg = "#000000";

        const buttons = new ActionRowBuilder();
        const buttons2 = new ActionRowBuilder();
        const buttons3 = new ActionRowBuilder();
        const buttons4 = new ActionRowBuilder();
        buttons.addComponents(
            new ButtonBuilder()
                .setCustomId("text")
                .setLabel("New Text Object")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("rect")
                .setLabel("New Rectangle Object")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("circ")
                .setLabel("New Circle Object")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("delete")
                .setLabel("Delete Object")
                .setStyle(ButtonStyle.Danger)
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
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("update")
                .setLabel("Force Update Canvas")
                .setStyle(ButtonStyle.Secondary)
        );
        buttons4.addComponents(
            new ButtonBuilder()
                .setLabel("@napi-rs/canvas")
                .setStyle(ButtonStyle.Link)
                .setURL("https://www.npmjs.com/package/@napi-rs/canvas")
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

        context.fillStyle = `${bg}`;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.font = "32px Arial";
        for (const func of drawArray) {
            func(context);
        }
        const png = await canvas.encode('png');
        const attachment = new AttachmentBuilder(png, { name: 'canvas.png' });

        const message = await interaction.reply({
            components: [buttons, buttons2, buttons3, buttons4],
            ephemeral: true,
            files: [attachment]
        });
        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 3.6e+6 });

        collector.on("collect", async i => {
            if (i.customId === "text") {
                curObjectID++;
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
                const content = submitted.fields.getTextInputValue('canvasImageTextInput');
                drawArray.push((ctx) => {
                    ctx.fillStyle = `${colour}`;
                    ctx.font = `${ints}px Arial`;
                    let lineHeight = ctx.measureText("M").width * 1.2;
                    fillTextMultiLine(ctx, content, intx, inty + lineHeight);
                });
                drawTypeArray.push({
                    type: "text",
                    x: intx,
                    y: inty,
                    colour: colour,
                    size: ints,
                    content: content,
                    id: curObjectID
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
                    .setValue(String(canvas.width))
                    .setStyle(TextInputStyle.Short);

                const hInput = new TextInputBuilder()
                    .setCustomId('canvasHInput')
                    .setLabel("Enter height of canvas:")
                    .setValue(String(canvas.height))
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
                curObjectID++;
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
                    h: inth,
                    id: curObjectID
                });
                update();
                await submitted.deleteReply();
            } else if (i.customId === "circ") {
                curObjectID++;
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
                    radius: intr,
                    id: curObjectID
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
                            outputStr = `${object.type},${object.x},${object.y},${object.colour || "#ffffff"},${object.size},${object.content}`;
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
            } else if (i.customId === "release") {
                await interaction.editReply({
                    content: "Posting export to sourcebin...",
                    files: [],
                    components: []
                });
                const png = await canvas.encode('png');
                const attachment = new AttachmentBuilder(png, { name: 'canvas.png' });
                const buttons = new ActionRowBuilder();

                await i.deferUpdate();
                const output = drawTypeArrayToStringArray(canvas, bg, drawTypeArray);

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
                const output = drawTypeArrayToStringArray(canvas, bg, drawTypeArray);

                const modal = new ModalBuilder()
                    .setCustomId('canvasEditModal')
                    .setTitle('Edit json');

                const eInput = new TextInputBuilder()
                    .setCustomId('canvasEditInput')
                    .setLabel("Edit content:")
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
                curObjectID = 0;
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
                            curObjectID++;
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
                                radius: object.radius,
                                id: curObjectID
                            });
                            break;
                        case "rect":
                            curObjectID++;
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
                                h: object.h,
                                id: curObjectID
                            });
                            break;
                        case "text":
                            curObjectID++;
                            object.size = Number(objectSplit[4]);
                            object.content = objectSplit[5];
                            drawArray.push((ctx) => {
                                ctx.fillStyle = `${object.colour}`;
                                ctx.font = `${object.size}px Arial`;
                                let lineHeight = ctx.measureText("M").width * 1.2;
                                fillTextMultiLine(ctx, object.content, object.x, object.y + lineHeight);
                            });
                            drawTypeArray.push({
                                type: "text",
                                x: object.x,
                                y: object.y,
                                colour: object.colour,
                                content: object.content,
                                size: object.size,
                                id: curObjectID
                            });
                            break;
                    }
                }
                await submitted.deleteReply();
                update();
            } else if (i.customId === "update") {
                await i.deferUpdate();
                update();
            } else if (i.customId === "delete") {
                let options = [];
                let objects = [];

                for (const object of drawTypeArray) {
                    objects.push(object);
                }

                for (let objectIndex in objects) {
                    const object = objects[objectIndex];
                    switch (object.type) {
                        // case "circ":
                        //     object.radius = Number(objectSplit[4]);
                        //     drawArray.push((ctx) => {
                        //         ctx.fillStyle = `${object.colour}`;
                        //         context.beginPath();
                        //         context.arc(object.x, object.y, object.radius, 0, 2 * Math.PI);
                        //         context.fill();
                        //     });
                        //     drawTypeArray.push({
                        //         type: "circ",
                        //         x: object.x,
                        //         y: object.y,
                        //         colour: object.colour,
                        //         radius: object.radius
                        //     });
                        //     break;
                        // case "rect":
                        //     object.w = Number(objectSplit[4]);
                        //     object.h = Number(objectSplit[5]);
                        //     drawArray.push((ctx) => {
                        //         ctx.fillStyle = `${object.colour}`;
                        //         ctx.fillRect(object.x, object.y, object.w, object.h);
                        //     });
                        //     drawTypeArray.push({
                        //         type: "rect",
                        //         x: object.x,
                        //         y: object.y,
                        //         colour: object.colour,
                        //         w: object.w,
                        //         h: object.h
                        //     });
                        //     break;
                        case "text":
                            options.push(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel('Text object')
                                    .setDescription(`Content: ${object.content}`)
                                    .setValue('textobj' + objectIndex)
                                    .setEmoji("<:t_:1129757531636502538>")
                            );
                            break;
                    }
                }

                const select = new StringSelectMenuBuilder()
                    .setCustomId('starter')
                    .setPlaceholder('Make a selection!')
                    .addOptions(options);

                const row = new ActionRowBuilder()
                    .addComponents(select);

                await i.reply({
                    content: 'Which object do you want to delete?',
                    components: [row],
                    ephemeral: true
                }).then(response => {
                    const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3.6e+6 });
                    
                    collector.on('collect', async selectInteraction => {
                        const selection = selectInteraction.values[0];
                        for (const objectIndex in drawTypeArray) {
                            const object = drawTypeArray[objectIndex];
                            if (object.id === Number(selection.slice(7))) {
                                drawArray.splice(objectIndex);
                                drawTypeArray.splice(objectIndex);
                                await i.deleteReply();
                                update();
                                break;
                            }
                        }
                    });
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