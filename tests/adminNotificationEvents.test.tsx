import React from 'react';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { ADMIN_EVENT_CATEGORIES, resolveAdminEventPreferences } from '../src/data/adminNotificationEvents';
import { AdminNotificationPreferences } from '../src/components/AdminNotificationPreferences';

test('event IDs are unique and stable-format; critical defaults are enabled', () => {
  const events = ADMIN_EVENT_CATEGORIES.flatMap((category) => category.events);
  assert.equal(new Set(events.map((event) => event.id)).size, events.length);
  for (const event of events) {
    assert.match(event.id, /^[a-z]+(?:_[a-z]+)+$/);
    if (event.severity === 'critical') assert.equal(event.defaultEnabled, true);
  }
});
test('saved Off values survive and new event defaults are added', () => {
  const result = resolveAdminEventPreferences({ food_recall: false, cart_product_added: true, unknown: true });
  assert.equal(result.food_recall, false);
  assert.equal(result.cart_product_added, true);
  assert.equal(result.data_export_requested, true);
  assert.equal('unknown' in result, false);
  assert.equal(Object.keys(result).length, ADMIN_EVENT_CATEGORIES.flatMap((category) => category.events).length);
});
test('all requested customer events exist as accessible switches before integration', () => {
  const html = renderToStaticMarkup(<AdminNotificationPreferences onSave={async () => {}} />);
  for (const id of ['user_registered', 'user_deleted', 'data_export_requested', 'cart_product_added', 'payment_confirmed', 'newsletter_subscribed', 'newsletter_unsubscribed']) {
    assert.ok(html.includes(`aria-labelledby="event-${id}"`), id);
  }
  assert.equal((html.match(/role="switch"/g) || []).length, ADMIN_EVENT_CATEGORIES.flatMap((category) => category.events).length);
  assert.match(html, /Eventi da collegare/);
  assert.match(html, /non attivano ancora invii automatici/);
  assert.match(html, /bg-green-700/);
  assert.match(html, /bg-red-700/);
});
