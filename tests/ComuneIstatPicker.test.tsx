import React from 'react';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { ComuneIstatPicker } from '../src/components/ComuneIstatPicker';

test('registration municipality fields render without StoreProvider after OTP', () => {
  const html = renderToStaticMarkup(
    <form>
      <ComuneIstatPicker label="Comune di Nascita" value="" onSelect={() => {}} showCap={false} required />
      <ComuneIstatPicker label="Comune di Residenza" value="" onSelect={() => {}} required />
    </form>
  );
  assert.match(html, /Comune di Nascita/);
  assert.match(html, /Comune di Residenza/);
  assert.equal((html.match(/<input/g) || []).length, 2);
  assert.match(html, /bg-white text-stone-900/);
});

test('profile municipality picker preserves the supplied dark theme and value', () => {
  const html = renderToStaticMarkup(
    <ComuneIstatPicker theme="braciami" label="Comune" value="Cento" provinceSigla="FE" onSelect={() => {}} />
  );
  assert.match(html, /bg-stone-800 text-white/);
  assert.match(html, /value="Cento"/);
  assert.match(html, /FE/);
});
