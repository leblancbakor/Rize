import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertTransition, canTransition, InvalidTransitionError } from './invoice-state.ts';

test('happy path', () => {
  assert.ok(canTransition('CREATED', 'AWAITING'));
  assert.ok(canTransition('AWAITING', 'PAID'));
  assert.ok(canTransition('PAID', 'DELIVERED'));
});

test('cannot resurrect an expired invoice', () => {
  assert.throws(() => assertTransition('EXPIRED', 'PAID'), InvalidTransitionError);
});

test('cannot skip payment', () => {
  assert.equal(canTransition('CREATED', 'PAID'), false);
  assert.equal(canTransition('AWAITING', 'DELIVERED'), false);
});
