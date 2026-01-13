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

// Packet loss concealment (PLC) with null/undefined
{
  const opus = new OpusEncoder(16_000, 1);

  // Decode with null for packet loss concealment
  const plcFrame = opus.decode(null);
  assert(plcFrame.length > 0, 'PLC frame should have length > 0');

  // Decode with undefined for packet loss concealment
  const plcFrame2 = opus.decode(undefined);
  assert(plcFrame2.length > 0, 'PLC frame should have length > 0');
}

// Forward error correction (FEC) parameter
{
  const opus = new OpusEncoder(16_000, 1);
  const frame = fs.readFileSync(path.join(__dirname, 'frame.opus'));

  // Decode with decode_fec = 0 (default)
  const decoded1 = opus.decode(frame, 0);
  assert(decoded1.length === 640, 'Decoded frame length is not 640');

  // Decode with decode_fec = 1
  const decoded2 = opus.decode(frame, 1);
  assert(decoded2.length === 640, 'Decoded frame length is not 640');

  // Decode with decode_fec as boolean
  const decoded3 = opus.decode(frame, false);
  assert(decoded3.length === 640, 'Decoded frame length is not 640');

  const decoded4 = opus.decode(frame, true);
  assert(decoded4.length === 640, 'Decoded frame length is not 640');
}

console.log('Passed');
