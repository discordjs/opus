const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { OpusEncoder } = require('../lib/index.js');

const opus = new OpusEncoder(16_000, 1);

const frame = fs.readFileSync(path.join(__dirname, 'frame.opus'));

const decoded = opus.decode(frame);

const reEncoded = opus.encode(decoded);

assert(decoded.length === 640, 'Decoded frame length is not 640');
assert(reEncoded.length === 45, 're encoded frame length is not 45');

console.log('Passed');
