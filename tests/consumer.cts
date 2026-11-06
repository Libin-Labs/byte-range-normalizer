import * as api from '@lp-labs/byte-range-normalizer';
import { resolveByteRanges } from '@lp-labs/byte-range-normalizer';
console.log(resolveByteRanges('bytes=0-9,-5', 100));
// @ts-expect-error invalid argument must be rejected by declarations
api.resolveByteRanges('bytes=0-9', 'ten');
