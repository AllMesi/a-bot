const { SlashCommandBuilder } = require('discord.js');
const emojis = ["😄", "😃", "😀", "😊", "😉", "😍", "😘", "😚", "😗", "😙", "😜", "😝", "😛", "😳", "😁", "😔", "😌", "😒", "😞", "😣", "😢", "😂", "😭", "😪", "😥", "😰", "😩", "😫", "😨", "😱", "😠", "😡", "😤", "😖", "😆", "😋", "😷", "😎", "😴", "😵", "😲", "😟", "😦", "😧", "😈", "👿", "😮", "😬", "😐", "😕", "😯", "😶", "😇", "🙂", "🙃", "🙁", "🤔", "🤐", "🤗", "🤓", "😛", "😜", "😝", "😓", "😒", "😔", "😕", "🙄", "🤒", "🤕", "🤢", "🤧", "😷", "🤥", "😺", "😸", "😻", "😽", "😼", "🙀", "😿", "😹", "😾", "👹", "👺", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "🐵", "🐒", "🦍", "🦊", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🕷️", "🦂", "🦀", "🦑", "🐙", "🦐", "🐠", "🐟", "🐡", "🦈", "🐊", "🐢", "🦎", "🐍", "🐲", "🐉", "🌵", "🎄", "🌲", "🌳", "🌴", "🌱", "🌿", "☘️", "🍀", "🎍", "🎋", "🍃", "🍂", "🍁", "🍄", "🌾", "💐", "🌷", "🌹", "🥀", "🌻", "🌼", "🌸", "🌺", "🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🍎", "🍏", "🍐", "🍑", "🍒", "🍓", "🍅", "🥝", "🥑", "🍆", "🥔", "🥕", "🌽", "🌶️", "🥒", "🥦", "🍄", "🥜", "🌰", "🍞", "🥐", "🥖", "🥞", "🧀", "🍖", "🍗", "🥓", "🍔", "🍟", "🍕", "🌭", "🌮", "🌯", "🥙", "🥪", "🍱", "🍲", "🍛", "🍜", "🍝", "🍠", "🍢", "🍣", "🍤", "🍥"];

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription('random emoji'),
    async execute(interaction) {
        await interaction.reply(emojis[Math.floor(Math.random() * emojis.length)]);
    },
};