const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const trim = (str, max, link) => (str.length > max ? `${str.slice(0, max - 3 - 1 - 6 - 2 - link.length)}... [more](${link})` : str);
const { request } = require('undici');

module.exports = {
    description: 'search the urban dictionary',
    data: new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('term')
                .setDescription('term to search')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const term = interaction.options.getString('term');
        const query = new URLSearchParams({ term });
        const dictResult = await request(`https://api.urbandictionary.com/v0/define?${query}`);
        let { list } = await dictResult.body.json();
        let page = 0;
        const buttons = new ActionRowBuilder();
        buttons.addComponents(...[
            new ButtonBuilder()
                .setCustomId("first")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:leftleft:1125705948799963207>"),
            new ButtonBuilder()
                .setCustomId("prev")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:left:1125408011310080041>"),
            new ButtonBuilder()
                .setCustomId("next")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:right:1125408009217122355>"),
            new ButtonBuilder()
                .setCustomId("last")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:rightright:1125705897272934512>"),
            new ButtonBuilder()
                .setCustomId("page")
                .setStyle(ButtonStyle.Secondary)
                .setLabel("Page")
        ]);
        if (!list.length) {
            return interaction.editReply("No results found");
        }

        const changePage = async (i, page) => {
            const definition = list[page].definition.replace(/[[\]]+/g, '');
            const example = list[page].example.replace(/[[\]]+/g, '');
            await i.editReply({
                embeds: [
                    {
                        color: 0x7289DA,
                        title: list[page].word,
                        url: list[page].permalink,
                        fields: [
                            { name: 'Definition', value: trim(definition, 1024, list[page].permalink) },
                            { name: 'Example', value: trim(example, 1024, list[page].permalink) },
                            { name: 'Rating', value: `👍 ${list[page].thumbs_up} 👎 ${list[page].thumbs_down}` }
                        ],
                        footer: {
                            icon_url: i.user.avatarURL() || `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5)}.png`,
                            text: `Page ${(Number(page) + 1)}/${list.length}`
                        }
                    }
                ],
                components: (list.length > 1 ? [buttons] : [])
            });
        };

        const definition = list[page].definition.replace(/[[\]]+/g, '');
        const example = list[page].example.replace(/[[\]]+/g, '');
        const message = await interaction.editReply({
            embeds: [
                {
                    color: 0x7289DA,
                    title: list[page].word,
                    url: list[page].permalink,
                    fields: [
                        { name: 'Definition', value: trim(definition, 1024, list[page].permalink) },
                        { name: 'Example', value: trim(example, 1024, list[page].permalink) },
                        { name: 'Rating', value: `👍 ${list[page].thumbs_up} 👎 ${list[page].thumbs_down}` }
                    ],
                    footer: {
                        icon_url: interaction.user.avatarURL() || `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5)}.png`,
                        text: `Page ${(Number(page) + 1)}/${list.length}`
                    }
                }
            ],
            components: (list.length > 1 ? [buttons] : [])
        });
        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 600000 });
        collector.on('collect', async i => {
            if (i.customId === "page") {
                const modal = new ModalBuilder()
                    .setCustomId('pageModal')
                    .setTitle('Page');
                const pageInput = new TextInputBuilder()
                    .setCustomId('pageInput')
                    .setPlaceholder(`Enter a number between 1 and ${list.length}`)
                    .setMaxLength(String(list.length).length)
                    .setMinLength(1)
                    .setLabel("Enter page (must be a number)")
                    .setStyle(TextInputStyle.Short);
                const firstActionRow = new ActionRowBuilder().addComponents(pageInput);

                // Add inputs to the modal
                modal.addComponents(firstActionRow);
                await i.showModal(modal);
                const submitted = await interaction.awaitModalSubmit({
                    time: 2147483647,
                }).catch(error => {
                    console.error(error);
                    return null;
                });
                await submitted.deferReply({
                    ephemeral: true
                });
                let pageInputStr = submitted.fields.getTextInputValue('pageInput');
                const int = parseInt(pageInputStr);
                if (isNaN(int)) {
                    submitted.editReply(`"${pageInputStr}" isnt a number!`);
                } else if (!isNaN(int) && int < 1 || int > list.length) {
                    submitted.editReply(`${pageInputStr} is an invalid number!\nenter a number between 1 and ${list.length}`);
                } else {
                    submitted.deleteReply();
                    page = int - 1;
                    changePage(i, page);
                }
                return;
            }
            await i.deferUpdate();
            page = (i.customId === "next" ? page + 1 : (i.customId === "prev") ? page - 1 : (i.customId === "first" ? 0 : (i.customId === "last") ? list.length - 1 : page));
            page = (page > list.length - 1 ? 0 : page);
            page = (page < 0 ? list.length - 1 : page);

            changePage(i, page);
        });

        collector.on('end', () => {
            interaction.editReply({
                components: []
            });
        });
    },
};