import { Client, Events, GatewayIntentBits, MessageFlags } from 'discord.js';
import { env } from './env.js';
import { logger } from './logger.js';
import { commandMap } from './commands/index.js';

const client = new Client({
  // Guilds is enough for slash commands + buttons. DirectMessages is needed for abandoned-cart DMs later.
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
});

client.once(Events.ClientReady, (c) => {
  logger.info({ user: c.user.tag, guilds: c.guilds.cache.size }, 'Rize bot ready');
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commandMap.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    logger.error({ err, command: interaction.commandName }, 'Command failed');
    const payload = { content: 'Something went wrong.', flags: MessageFlags.Ephemeral } as const;
    if (interaction.deferred || interaction.replied) await interaction.followUp(payload);
    else await interaction.reply(payload);
  }
});

client.on(Events.GuildCreate, (guild) => {
  logger.info({ guild: guild.id, name: guild.name }, 'Joined guild');
});

await client.login(env.DISCORD_TOKEN);
