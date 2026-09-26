import en from './locales/en.json' with { type: 'json' };

export const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'de', 'pt'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

type Messages = typeof en;

// Locales other than `en` fall back to `en` until their JSON exists. Adding a language = add a file + an entry here.
const catalogs: Partial<Record<Locale, Messages>> = { en };

/** Dot-path keys of the message catalog, e.g. "checkout.paid". */
type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];
export type MessageKey = Leaves<Messages>;

function lookup(obj: unknown, path: string): string | undefined {
  return path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], obj) as
    string | undefined;
}

/** Map a Discord locale string (e.g. "es-ES", "pt-BR") to a supported locale. */
export function resolveLocale(discordLocale: string | undefined): Locale {
  const base = (discordLocale ?? '').slice(0, 2).toLowerCase();
  return (SUPPORTED_LOCALES as readonly string[]).includes(base)
    ? (base as Locale)
    : DEFAULT_LOCALE;
}

/** Translate `key` for `locale`, interpolating `{name}` placeholders from `vars`. */
export function t(
  locale: Locale,
  key: MessageKey,
  vars: Record<string, string | number> = {},
): string {
  const msg = lookup(catalogs[locale], key) ?? lookup(catalogs.en, key) ?? key;
  return msg.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`));
}
