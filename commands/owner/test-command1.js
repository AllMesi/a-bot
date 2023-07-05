const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const allowed = ["956156042398556210", "675492571203764236"];
const fetch = require("node-fetch");
// const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let timezones;
fetch(`https://worldtimeapi.org/api/timezone`).then(result => {
    result.json().then(array => {
        timezones = array;
    });
});

function formatTime(timeString) {
    const [hourString, minute] = timeString.split(":");
    const hour = +hourString % 24;
    return (hour % 12 || 12) + ":" + minute + (hour < 12 ? " am" : " pm");
}

module.exports = {
    description: 'testing',
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('timezone')
                .setDescription('choose timezone')
                .setRequired(true)
                .setAutocomplete(true)
        ),
    async execute(interaction) {
        if (!allowed.includes(interaction.user.id)) return interaction.reply("how dare you even TRY to use this command you mere mortal");
        await interaction.deferReply();
        const timezone = interaction.options.getString('timezone');
        if (!timezones.includes(timezone)) {
            return await interaction.followUp({
                content: `"${timezone}" is not a valid timezone!`,
                ephemeral: true
            });
        }
        fetch(`https://worldtimeapi.org/api/timezone/${timezone}`).then(result => {
            result.json().then(array => {
                const dateTime = array.datetime.replaceAll("T", ",").replaceAll(array.utc_offset, "").slice(0, -7);
                const dateTimeSplit = dateTime.split(",");
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(timezone.split("/").reverse().map(name => name.replaceAll("_", " ")).join(", "))
                            .setDescription(`Abbreviation: ${array.abbreviation}\nDate: ${dateTimeSplit[0]}\nTime: ${formatTime(dateTimeSplit[1])}\nIs in DST: ${array.dst}`)
                    ]
                });
            });
        });
    },
    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);

        const filtered = timezones.filter(choice => choice.toLowerCase().includes(focusedOption.value.toLowerCase()));

        let options;
        if (filtered.length > 25) {
            options = filtered.slice(0, 25);
        } else {
            options = filtered;
        }

        await interaction.respond(
            options.map(choice => ({ name: choice.split("/").reverse().map(name => name.replaceAll("_", " ")).join(", "), value: choice })),
        );
    },
};