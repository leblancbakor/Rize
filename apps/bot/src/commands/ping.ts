import { SlashCommandBuilder } from 'discord.js';
import type { Command } from './types.js';

export const ping: Command = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Check that Rize is alive.'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging…', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(
      `Pong. Round-trip ${latency}ms, gateway ${Math.round(interaction.client.ws.ping)}ms.`,
    );
  },
};
