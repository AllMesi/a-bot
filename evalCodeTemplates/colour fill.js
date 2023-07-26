/* eslint-disable no-undef */
const d = [1280, 720];

const { Image } = require("imagescript");
const { AttachmentBuilder } = require("discord.js");

const image = new Image(d[0], d[1]);
image.fill(() => Math.floor(0xffffffff * Math.random()));

for (const [x, y, color] of image.iterateWithColors()) {
  const [r, g, b, opacity] = Image.colorToRGBA(color);
  if (opacity === 0) image.setPixelAt(x, y, 0x00000000);
  else image.setPixelAt(x, y, Image.rgbaToColor(r, g, b, 255));
}

image.encode().then(array => {
  const buffer = Buffer.from(array);
  const attachment = new AttachmentBuilder(buffer, { name: 'thingy.png' });
  interaction.followUp({
    files: [attachment]
  });
});