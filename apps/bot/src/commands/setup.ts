import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { prisma } from '@rize/db';
import { t, resolveLocale } from '@rize/i18n';
import type { Command } from './types.js';

/**
 * /setup — first-run wizard. v0 only registers the server; the wallet / Stripe steps land in
 * milestone M1 (see docs/ROADMAP.md).
 */
export const setup: Command = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Set up Rize for this server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),
  async execute(interaction) {
    const locale = resolveLocale(interaction.locale);
    const guild = interaction.guild!;

    await prisma.server.upsert({
      where: { discordId: guild.id },
      create: { discordId: guild.id, name: guild.name, locale },
      update: { name: guild.name, uninstalledAt: null },
    });

    await interaction.reply({ content: t(locale, 'setup.welcome'), ephemeral: true });
  },
};
