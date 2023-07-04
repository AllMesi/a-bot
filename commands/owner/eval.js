const capcon = require('capture-console');
const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const allowed = ["956156042398556210", "675492571203764236"];
const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
const neatStack = require('neat-stack');

const clean = async (text, interaction) => {
    if (text && text.constructor.name == "Promise")
        text = await text;

    if (typeof text !== "string")
        text = require("util").inspect(text, { depth: 1 });

    text = text.replace(/`/g, "`" + String.fromCharCode(8203));
    text = text.replaceAll(interaction.client.token, "[REDACTED]");

    return text;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setDescription('evaluation. you evaluator. you')
        .addBooleanOption(option =>
            option.setName('no_embed')
                .setDescription('output the result without an embed')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('async')
                .setDescription('wrap the code in an async block')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('no_ansi')
                .setDescription('strip all ansi from the output')
                .setRequired(false)),
    async execute(interaction) {
        if (!allowed.includes(interaction.user.id)) return interaction.reply("how dare you even TRY to use this command you mere mortal");
        const modal = new ModalBuilder()
            .setCustomId('evalModel')
            .setTitle('Eval');

        const codeInput = new TextInputBuilder()
            .setCustomId('codeInput')
            .setLabel("Enter code:")
            .setStyle(TextInputStyle.Paragraph);

        const code = new ActionRowBuilder().addComponents(codeInput);
        modal.addComponents(code);

        await interaction.showModal(modal);
        const submitted = await interaction.awaitModalSubmit({
            time: 2147483647,
        }).catch(error => {
            console.error(error);
            return null;
        });
        await submitted.deferReply();
        var output = '';
        capcon.startCapture(process.stdout, function (stdout) {
            output += stdout;
        });
        let codeText = submitted.fields.getTextInputValue('codeInput');
        const noAnsi = interaction.options.getBoolean("no_ansi");
        try {
            // Evaluate (execute) our input
            if (interaction.options.getBoolean("async")) {
                codeText = `(async () => {\n\t${codeText.replaceAll("\n", "\n\t")}\n})();`;
            }
            await eval(codeText);

            // Put our eval result through the function
            // we defined above
            const cleaned = await clean(output, interaction);

            if (output !== '') {
                if (!interaction.options.getBoolean("no_embed")) {
                    await submitted.editReply({
                        embeds: [
                            {
                                title: "Eval Result",
                                fields: [
                                    {
                                        name: "Input",
                                        value: `\`\`\`js\n${trim(codeText, 1000)}\n\`\`\``
                                    },
                                    {
                                        name: "Output",
                                        value: `\`\`\`ansi\n${trim((noAnsi ? cleaned.replace(
                                            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '') : cleaned), 1000)}\n\`\`\``
                                    }
                                ],
                                color: 0x00ff00
                            }
                        ]
                    });
                } else {
                    await submitted.editReply(trim((noAnsi ? cleaned.replace(
                        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '') : cleaned), 1000));
                }
            } else {
                await submitted.deleteReply();
            }
        } catch (err) {
            if (!interaction.options.getBoolean("no_embed")) {
                const error = neatStack(err);
                await submitted.editReply({
                    embeds: [
                        {
                            title: "Eval Result",
                            fields: [
                                {
                                    name: "Input",
                                    value: `\`\`\`js\n${trim(codeText, 1000)}\n\`\`\``
                                },
                                {
                                    name: "Output",
                                    value: `\`\`\`ansi\n\u001b[31mError!\u001b[0m\n\n${trim((noAnsi ? error.replace(
                                        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '') : error), 1000)}\n\`\`\``
                                }
                            ],
                            color: 0xff0000
                        }
                    ]
                });
            } else {
                await submitted.editReply(trim((noAnsi ? err.replace(
                    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '') : err), 1024));
            }
        }
        capcon.stopCapture(process.stdout);
    },
};
