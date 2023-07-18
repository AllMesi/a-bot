const { AttachmentBuilder } = require("discord.js");
const Canvas = require('@napi-rs/canvas');

module.exports = {
    async execute(interaction) {
        const canvas = Canvas.createCanvas(500, 500);
        const ctx = canvas.getContext('2d');
        var text = "foo bar foo bar";
        ctx.font = "30pt Arial";
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        var width = ctx.measureText(text).width;
        if (width <= 100) {
            ctx.fillText(text, 0, 100);
        } else {
            ctx.save();
            ctx.scale(100 / width, 1);
            ctx.fillText(text, 0, 100);
            ctx.restore();
        }
        const png = await canvas.encode('png');
        const attachment = new AttachmentBuilder(png, { name: 'canvas.png' });
        await interaction.reply({
            files: [attachment],
            ephemeral: true
        });
    },
};
