export interface ByteRange {
  readonly start: number;
  readonly end: number;
}
export function resolveByteRanges(header: string, length: number): ByteRange[] {
  if (typeof header !== 'string') throw new TypeError('Header must be text');
  if (!Number.isSafeInteger(length) || length < 0 || length > Number.MAX_SAFE_INTEGER)
    throw new RangeError('Invalid resource length');
  if (header.length > 8192) throw new RangeError('Header too long');
  const m = /^bytes\s*=\s*(.+)$/i.exec(header.trim());
  if (!m) throw new RangeError('Expected bytes range');
  const parts = m[1]!.split(',');
  if (parts.length > 100) throw new RangeError('Too many ranges');
  const out: ByteRange[] = [];
  for (const raw of parts) {
    const pair = /^\s*(\d*)-(\d*)\s*$/.exec(raw);
    if (!pair || (!pair[1] && !pair[2])) throw new RangeError('Invalid byte range');
    let start: number, end: number;
    if (!pair[1]) {
      const suffix = Number(pair[2]);
      if (!Number.isSafeInteger(suffix)) throw new RangeError('Range too large');
      if (suffix === 0 || length === 0) continue;
      start = Math.max(0, length - suffix);
      end = length - 1;
    } else {
      start = Number(pair[1]);
      end = pair[2] ? Number(pair[2]) : length - 1;
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end))
        throw new RangeError('Range too large');
      if (start >= length || start > end) continue;
      end = Math.min(end, length - 1);
    }
    out.push({ start, end });
  }
  return out;
}
