import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { normalizeArchiNavigation } from '../scripts/normalize-showcase-interactions.mjs';

test('Archi export menu closes on route changes while Escape cleanup remains intact', () => {
  const fixture = 'const exported=["Header",0,function({locale:t}){let[e,i]=(0,h.useState)(!1),n=(0,l.usePathname)(),s={};return(0,h.useEffect)(()=>{let t=t=>"Escape"===t.key&&i(!1);return window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)},[]),{id:"mobile-nav"}}];';
  const normalized = normalizeArchiNavigation(fixture);
  const effects = [];
  const changes = [];
  const listeners = new Map();
  const context = {
    h: { useState: () => [true, value => changes.push(value)], useEffect: (callback, deps) => effects.push({ callback, deps }) },
    l: { usePathname: () => '/en/quote' },
    window: { addEventListener: (event, listener) => listeners.set(event, listener), removeEventListener: event => listeners.delete(event) },
  };
  vm.runInNewContext(`${normalized}exported[2]({locale:"en"});`, context);
  assert.equal(effects.length, 2);
  assert.equal(effects[0].deps[0], '/en/quote', 'Close effect must depend on the actual route');
  effects[0].callback();
  assert.deepEqual(changes, [false]);
  const cleanup = effects[1].callback();
  listeners.get('keydown')({ key: 'Escape' });
  assert.deepEqual(changes, [false, false]);
  cleanup();
  assert.equal(listeners.size, 0);
  assert.equal(normalizeArchiNavigation(normalized), normalized, 'Repeated sync is idempotent');
  assert.equal(normalizeArchiNavigation('const untouched = 1;'), 'const untouched = 1;');
});

test('Archi normalizer fails visibly when upstream Header structure changes', () => {
  assert.throws(() => normalizeArchiNavigation('"Header",0,function(){return{id:"mobile-nav"}}'), /Header changed/);
});
