const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { OpusEncoder } = require('../lib/index.js');

// Encoding test
{
  const opus = new OpusEncoder(16_000, 1);
  
  const frame = fs.readFileSync(path.join(__dirname, 'frame.opus'));
  
  const decoded = opus.decode(frame);
  
  const reEncoded = opus.encode(decoded);
  
  assert(decoded.length === 640, 'Decoded frame length is not 640');
  assert(reEncoded.length === 45, 're-encoded frame length is not 45');

  const decodedFloat = opus.decodeFloat(frame);
  
  const reEncodedFloat = opus.encodeFloat(decodedFloat);
  
  // float32 buffer should be 2x the size of int16 buffer
  assert(decodedFloat.length === 1280, 'Decoded float frame length is not 1280');
  // Encoded size differs slightly due to precision differences
  assert(reEncodedFloat.length === 43, 're-encoded float frame length is not 43');
}

// Default values work
{
  new OpusEncoder();
  new OpusEncoder(undefined, undefined);
}

// Invalid values throw
{
  assert.throws(() => new OpusEncoder("16000", 1), /Expected rate to be a number/);
  assert.throws(() => new OpusEncoder(null, "1"), /Expected rate to be a number/);
  assert.throws(() => new OpusEncoder(16000, "1"), /Expected channels to be a number/);
  assert.throws(() => new OpusEncoder(16000, null), /Expected channels to be a number/);
}

console.log('Passed');
