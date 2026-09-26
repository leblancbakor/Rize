import { ping } from './ping.js';
import { setup } from './setup.js';
import type { Command } from './types.js';

export const commands: Command[] = [ping, setup];
export const commandMap = new Map(commands.map((c) => [c.data.name, c]));
