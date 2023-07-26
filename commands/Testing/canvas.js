const { Image } = require("imagescript");
const { ActionRowBuilder, ButtonStyle, ButtonBuilder, AttachmentBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

const newModal = (intr) => {
    const newModal = new ModalBuilder();
    const modalFuncs = {
        setID: (id) => {
            newModal.setCustomId(id);
            return modalFuncs;
        },
        setTitle: (tit) => {
            newModal.setTitle(tit);
            return modalFuncs;
        }
    };
    return modalFuncs;  
};

module.exports = {
    async execute(interaction) {
        let image = new Image(1280, 720);
        let drawArray = [];
        const update = () => {
            image = new Image(image.width, image.height);
            image.drawBox(0, 0, image.width, image.height, 0x000000ff);
            for (const func of drawArray) {
                func(image);
            }
            image.encode().then(async png => {
                const attachment = new AttachmentBuilder(Buffer.from(png), { name: 'canvas.png' });
                await interaction.editReply({
                    ephemeral: true,
                    files: [attachment],
                    embeds: [
                        {
                            description: "Total Objects: 0",
                            image: {
                                url: "attachment://canvas.png"
                            },
                            footer: {
                                text: `${image.width}x${image.height}`
                            },
                            color: 0x7289DA
                        }
                    ]
                });
            });
        };
        image.drawBox(0, 0, image.width, image.height, 0x000000ff);
        image.encode().then(async png => {
            const attachment = new AttachmentBuilder(Buffer.from(png), { name: 'canvas.png' });
            const buttons = new ActionRowBuilder();
            const buttons2 = new ActionRowBuilder();
            const buttons3 = new ActionRowBuilder();
            buttons.addComponents(
                new ButtonBuilder()
                    .setCustomId("canvas-text")
                    .setLabel("New Text Object")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("canvas-rect")
                    .setLabel("New Rectangle Object")
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("<:canvbox:1131549256059207710>"),
                new ButtonBuilder()
                    .setCustomId("canvas-circ")
                    .setLabel("New Circle Object")
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("<:canvcirc:1131549242616467456>"),
                new ButtonBuilder()
                    .setCustomId("canvas-delete")
                    .setLabel("Delete Object")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("❌")
            );
            buttons2.addComponents(
                new ButtonBuilder()
                    .setCustomId("canvas-update")
                    .setLabel("Force Update")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("canvas-resize")
                    .setLabel("Resize")
                    .setStyle(ButtonStyle.Secondary)
            );
            const message = await interaction.reply({
                ephemeral: true,
                components: [buttons, buttons2],
                files: [attachment],
                embeds: [
                    {
                        description: "Total Objects: 0",
                        image: {
                            url: "attachment://canvas.png"
                        },
                        footer: {
                            text: `${image.width}x${image.height}`
                        },
                        color: 0x7289DA
                    }
                ]
            });
            const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 3.6e+6 });

            collector.on("collect", async i => {
                switch (i.customId) {
                    case "canvas-update":
                        await i.deferUpdate();
                        update();
                        break;
                    case "canvas-resize":
                        const modal = new ModalBuilder()
                            .setCustomId('canvasResizeModal')
                            .setTitle('Resize canvas');

                        const wInput = new TextInputBuilder()
                            .setCustomId('canvasWInput')
                            .setLabel("Enter width of canvas:")
                            .setValue(String(image.width))
                            .setStyle(TextInputStyle.Short);

                        const hInput = new TextInputBuilder()
                            .setCustomId('canvasHInput')
                            .setLabel("Enter height of canvas:")
                            .setValue(String(image.height))
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
                        image.resize(intw, inth);
                        update();
                        await submitted.deleteReply();
                        break;
                }
            });
        });
    }
};