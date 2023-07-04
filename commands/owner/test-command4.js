const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, SlashCommandBuilder } = require('discord.js');
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
        const { list } = await dictResult.body.json();
        let page = 0;
        const buttons = new ActionRowBuilder();
        buttons.addComponents(...[
            new ButtonBuilder()
                .setCustomId("prev")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:left:1125408011310080041>"),
            new ButtonBuilder()
                .setCustomId("next")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:right:1125408009217122355>")
        ]);
        if (!list.length) {
            const message = await interaction.editReply({
                content: "No results found, so have this ig",
                embeds: [
                    {
                        color: 0x7289DA,
                        title: "Go kitty go",
                        url: "https://www.youtube.com/watch?v=um0ETkJABmI",
                        fields: [
                            { name: 'Definition', value: "Dancing Cats - Go Kitty Go! - YouTube.flv" },
                            { name: 'Example', value: "Pump it up, kitty\nJust pump it up, kit-kat\nWhere you at?\nThere you go\nPut two paws on the floor\nTwo in the air and then just\nGo kitty, go kitty\nGo kitty, go, and just\nRide kitty, ride kitty\nRide kitty, roll\nPump it up, kitty\nHey, DJ, play that funky beat\nAll the kittens move ya feet 'cause\nThe music's bumpin', party's pumpin'\nFeel that groove and you gotta do somethin'\nGo kitty, go kitty\nGo kitty, go, and just\nRide kitty, ride kitty\nRide kitty, roll\nGo kitty, go kitty\nGo kitty, go, and just\nRide kitty, ride kitty\nRide kitty, roll\nGo, go, go kitty, go, just\nGo, go, go kitty, go, just\nGo, go, go kitty, go, just\nGo, go, go\nStop" },
                            { name: 'Rating', value: `👍 ${Math.floor(Math.random() * (10000000000 - 100000 + 1) + 100000)} 👎 0` }
                        ],
                        footer: {
                            icon_url: interaction.user.avatarURL(),
                            text: `Page 1/1`
                        }
                    }
                ],
                components: [buttons]
            });
            const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 3600000 });
            collector.on('collect', i => {
                i.update("No results found, so have this ig");
            });

            collector.on('end', () => {
                interaction.editReply({
                    content: "Time has ran out",
                    components: []
                });
            });
            return;
        }

        let definition = list[page].definition;
        let example = list[page].example;
        const matches = definition.match(/(?<=\[)[^\][]*(?=])/g);
        const matches2 = example.match(/(?<=\[)[^\][]*(?=])/g);
        for (let val of matches) {
            const term = val;
            const query = new URLSearchParams({ term });
            const dictResult = await request(`https://api.urbandictionary.com/v0/define?${query}`);
            const { list } = await dictResult.body.json();
            val = `open_bracket${list[page].word}close_bracket(${list[page].permalink})`;
            definition = definition.replace(/\[(.+?)\]/, val);
        }
        definition = definition.replaceAll("open_bracket", "[").replaceAll("close_bracket", "]");
        for (let val of matches2) {
            const term = val;
            const query = new URLSearchParams({ term });
            const dictResult = await request(`https://api.urbandictionary.com/v0/define?${query}`);
            const { list } = await dictResult.body.json();
            val = `open_bracket${list[page].word}close_bracket(${list[page].permalink})`;
            example = example.replace(/\[(.+?)\]/, val);
        }
        example = example.replaceAll("open_bracket", "[").replaceAll("close_bracket", "]");
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
                        icon_url: interaction.user.avatarURL(),
                        text: `Page ${(Number(page) + 1)}/${list.length}`
                    }
                }
            ],
            components: [buttons]
        });
        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 600000 });
        collector.on('collect', async i => {
            await i.deferUpdate();
            page = (i.customId === "next" ? page + 1 : page - 1);
            page = (page > list.length - 1 ? 0 : page);
            page = (page < 0 ? list.length - 1 : page);

            let definition = list[page].definition;
            let example = list[page].example;
            const matches = definition.match(/(?<=\[)[^\][]*(?=])/g);
            const matches2 = example.match(/(?<=\[)[^\][]*(?=])/g);
            if (matches !== null) {
                for (let val of matches) {
                    const term = val;
                    const query = new URLSearchParams({ term });
                    const dictResult = await request(`https://api.urbandictionary.com/v0/define?${query}`);
                    const { list } = await dictResult.body.json();
                    val = `open_bracket${list[page].word}close_bracket(${list[page].permalink})`;
                    definition = definition.replace(/\[(.+?)\]/, val);
                }
                definition = definition.replaceAll("open_bracket", "[").replaceAll("close_bracket", "]");
            } else {
                definition = definition.replace(/[[\]]+/g, '');
            }
            if (matches2 !== null) {
                for (let val of matches2) {
                    const term = val;
                    const query = new URLSearchParams({ term });
                    const dictResult = await request(`https://api.urbandictionary.com/v0/define?${query}`);
                    const { list } = await dictResult.body.json();
                    val = `open_bracket${list[page].word}close_bracket(${list[page].permalink})`;
                    example = example.replace(/\[(.+?)\]/, val);
                }
                example = example.replaceAll("open_bracket", "[").replaceAll("close_bracket", "]");
            } else {
                example = example.replace(/[[\]]+/g, '');
            }
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
                            icon_url: interaction.user.avatarURL(),
                            text: `Page ${(Number(page) + 1)}/${list.length}`
                        }
                    }
                ],
                components: [buttons]
            });
        });

        collector.on('end', () => {
            interaction.editReply({
                content: "Time has ran out",
                components: []
            });
        });
    },
};