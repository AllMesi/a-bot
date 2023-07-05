const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const allowed = ["956156042398556210", "675492571203764236"];
const fetch = require("node-fetch");
// const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatTime(timeString) {
    const [hourString, minute] = timeString.split(":");
    const hour = +hourString % 24;
    return (hour % 12 || 12) + ":" + minute + (hour < 12 ? " am" : " pm");
}

module.exports = {
    description: 'testing',
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('ip')
                .setDescription('type ip')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (!allowed.includes(interaction.user.id)) return interaction.reply("how dare you even TRY to use this command you mere mortal");
        await interaction.deferReply();
        const ip = interaction.options.getString('ip');
        fetch(`https://worldtimeapi.org/api/ip/${ip}`).then(result => {
            result.json().then(array => {
                if (typeof array.error === "string") {
                    return interaction.followUp({
                        content: `"${ip}" is not a valid ip!`,
                        ephemeral: true
                    });
                }
                const dateTime = array.datetime.replaceAll("T", ",").replaceAll(array.utc_offset, "").slice(0, -7);
                const dateTimeSplit = dateTime.split(",");
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(ip)
                            .setDescription(`Abbreviation: ${array.abbreviation}\nDate: ${dateTimeSplit[0]}\nTime: ${formatTime(dateTimeSplit[1])}\nIs in DST: ${array.dst}`)
                    ]
                });
            });
        });
    },
};