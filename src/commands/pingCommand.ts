import {SlashCommand} from "../interfaces/slashCommand";
import {CommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {botClient} from "../index";


export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('bong')
        .setDescription('Pings Bongbong and the Discord API, displays latency.'),


    run(interaction: CommandInteraction): void {

        const coloredCircles = {
            green: ':green_circle:',
            yellow: ':yellow_circle:',
            red: ':red_circle:',
            black: ':black_circle:'
        }

        const botMs = Date.now() - interaction.createdTimestamp;
        const discordMs = Math.round(botClient.client.ws.ping);

        let botCircle: string = '';
        let discordCircle: string = '';

        if (botMs < 150) {
            botCircle = coloredCircles.green;
        } else if (botMs > 500) {
            botCircle = coloredCircles.red
        } else {
            botCircle = coloredCircles.yellow
        }

        if (discordMs < 200) {
            discordCircle = coloredCircles.green;
        } else if (discordMs > 500) {
            discordCircle = coloredCircles.red
        } else {
            discordCircle = coloredCircles.yellow
        }

        const latencyEmbed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('Latency')
            .addFields(
                {name: 'Bot latency', value: `${botMs} ${botCircle}`},
                {name: 'Discord API latency:', value: `${discordMs} ${discordCircle}`}
            )
        interaction.reply({content: 'Bong...'}).then(() => {
            void interaction.editReply({content: 'BongBong!', embeds: [latencyEmbed]})
        });
    }

}