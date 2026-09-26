import { REST, Routes } from 'discord.js';
import { env } from './env.js';
import { commands } from './commands/index.js';

// Registers slash commands. Guild-scoped in dev (instant), global otherwise (up to 1h to propagate).
const rest = new REST().setToken(env.DISCORD_TOKEN);
const body = commands.map((c) => c.data.toJSON());

const route = env.DISCORD_DEV_GUILD_ID
  ? Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_DEV_GUILD_ID)
  : Routes.applicationCommands(env.DISCORD_CLIENT_ID);

await rest.put(route, { body });
console.log(
  `Registered ${body.length} command(s) ${env.DISCORD_DEV_GUILD_ID ? 'to dev guild' : 'globally'}.`,
);
