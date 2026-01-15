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

// Packet loss concealment (PLC) with conceal method
{
  const opus = new OpusEncoder(16_000, 1);

  // Conceal with specific frame_size for proper PLC
  // For 16kHz, 20ms = 320 samples, so we expect 320 * 2 bytes = 640 bytes output
  const plcFrame = opus.conceal(320);
  assert(plcFrame.length === 640, `PLC frame with frame_size=320 should be 640 bytes, got ${plcFrame.length}`);

  // Test with 48kHz decoder
  const opus48 = new OpusEncoder(48_000, 2);
  // For 48kHz stereo, 20ms = 960 samples per channel, output is 960 * 2 channels * 2 bytes = 3840 bytes
  const plcFrame48 = opus48.conceal(960);
  assert(plcFrame48.length === 3840, `PLC frame for 48kHz stereo with frame_size=960 should be 3840 bytes, got ${plcFrame48.length}`);
}

// Forward error correction (FEC) with conceal method
{
  const opus = new OpusEncoder(16_000, 1);
  const frame = fs.readFileSync(path.join(__dirname, 'frame.opus'));

  // Conceal with FEC using a packet (frame_size=320 for 20ms at 16kHz)
  const decoded1 = opus.conceal(320, frame);
  assert(decoded1.length === 640, 'FEC decoded frame length is not 640');

  // Conceal without packet (PLC only)
  const decoded2 = opus.conceal(320);
  assert(decoded2.length === 640, 'PLC decoded frame length is not 640');

  // Conceal with null packet (PLC)
  const decoded3 = opus.conceal(320, null);
  assert(decoded3.length === 640, 'PLC decoded frame length is not 640');
}

console.log('Passed');
