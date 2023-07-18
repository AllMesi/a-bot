const { AttachmentBuilder, SlashCommandBuilder } = require("discord.js");
const Canvas = require('@napi-rs/canvas');

const handleUpload = async (attachment) => {
    const response = await fetch(attachment.attachment);
    const data = await response.text();

    return data;
};

module.exports = {
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('text')
                .setDescription('the caption text to put at the top')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('image')
                .setDescription('the image below the caption')
                .setRequired(true)),
    async execute(interaction) {
        const imgdata = await handleUpload(interaction.options.getAttachment('image'));
        const img = await Canvas.loadImage(Buffer.from(imgdata));
        const canvas = Canvas.createCanvas(img.width, img.height + 50);
        const ctx = canvas.getContext('2d');
        var text = interaction.options.getString("text");
        ctx.drawImage(img, 0, 50);
        ctx.font = "bold 30px Arial";
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, 50);
        ctx.fillStyle = 'black';
        ctx.textAlign = "center";
        ctx.fillText(text, canvas.width / 2, 25 + 15);
        ctx.fillStyle = 'white';
        const png = await canvas.encode('png');
        const attachment = new AttachmentBuilder(png, { name: 'canvas.png' });
        await interaction.reply({
            files: [attachment],
            ephemeral: true
        });
    },
};
