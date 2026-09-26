import { test } from 'node:test';
import assert from 'node:assert/strict';
import { t, resolveLocale } from './index.ts';

test('interpolates placeholders', () => {
  assert.equal(t('en', 'checkout.title', { product: 'VIP' }), 'Checkout — VIP');
});

test('falls back to en for unsupported locale catalogs', () => {
  assert.equal(t('fr', 'common.buy'), 'Buy');
});

test('resolveLocale maps Discord locales', () => {
  assert.equal(resolveLocale('es-ES'), 'es');
  assert.equal(resolveLocale('pt-BR'), 'pt');
  assert.equal(resolveLocale('ja'), 'en');
  assert.equal(resolveLocale(undefined), 'en');
});
