import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('resolves explicit range', () => {
  assert.deepEqual(api.resolveByteRanges('bytes=2-5', 10), [{ start: 2, end: 5 }]);
});
test('clips open-ended range', () => {
  assert.deepEqual(api.resolveByteRanges('bytes=7-', 10), [{ start: 7, end: 9 }]);
});
test('resolves suffix range', () => {
  assert.deepEqual(api.resolveByteRanges('bytes=-3', 10), [{ start: 7, end: 9 }]);
});
test('ignores unsatisfiable members', () => {
  assert.deepEqual(api.resolveByteRanges('bytes=0-1,20-30', 10), [{ start: 0, end: 1 }]);
});
test('returns empty when all ranges unsatisfiable', () => {
  assert.deepEqual(api.resolveByteRanges('bytes=20-30', 10), []);
});
test('rejects negative resource length', () => {
  assert.throws(() => api.resolveByteRanges('bytes=0-1', -1), RangeError);
});
