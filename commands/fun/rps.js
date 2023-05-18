const acceptedReplies = ['rock', 'paper', 'scissors'];
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription('rock paper scissors')
        .addStringOption(option =>
            option.setName("rpsr")
                .setDescription("Rock paper or scissors")
                .setRequired(true)
                .addChoices(
                    { name: 'Rock', value: 'rock' },
                    { name: 'Paper', value: 'paper' },
                    { name: 'Scissors', value: 'scissors' },
                )),
    async execute(interaction) {
        const random = Math.floor((Math.random() * acceptedReplies.length));
        const result = acceptedReplies[random];

        const choice = interaction.options.getString("rpsr");
        if (!choice) return interaction.reply(`How to play: \`/rps <rock|paper|scissors>\``);
        if (!acceptedReplies.includes(choice)) return interaction.reply(`Only these responses are accepted: \`${acceptedReplies.join(', ')}\``);

        if (result === choice) return interaction.reply("It's a tie! We had the same choice.");

        switch (choice) {
            case 'rock': {
                if (result === 'paper') return interaction.reply(`I won! I chose ${result}`);
                else return interaction.reply(`You won! I chose ${result}`);
            }
            case 'paper': {
                if (result === 'scissors') return interaction.reply(`I won! I chose ${result}`);
                else return interaction.reply(`You won! I chose ${result}`);
            }
            case 'scissors': {
                if (result === 'rock') return interaction.reply(`I won! I chose ${result}`);
                else return interaction.reply(`You won! I chose ${result}`);
            }
            default: {
                return interaction.reply(`Only these responses are accepted: \`${acceptedReplies.join(', ')}\``);
            }
        }
    },
};