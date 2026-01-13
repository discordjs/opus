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

  // Decode with null for packet loss concealment (using default MAX_FRAME_SIZE)
  const plcFrame = opus.decode(null);
  assert(plcFrame.length > 0, 'PLC frame should have length > 0');

  // Decode with undefined for packet loss concealment (using default MAX_FRAME_SIZE)
  const plcFrame2 = opus.decode(undefined);
  assert(plcFrame2.length > 0, 'PLC frame should have length > 0');

  // Decode with null and specific frame_size for proper PLC
  // For 16kHz, 20ms = 320 samples, so we expect 320 * 2 bytes = 640 bytes output
  const plcFrame3 = opus.decode(null, 0, 320);
  assert(plcFrame3.length === 640, `PLC frame with frame_size=320 should be 640 bytes, got ${plcFrame3.length}`);

  // Test with 48kHz decoder
  const opus48 = new OpusEncoder(48_000, 2);
  // For 48kHz stereo, 20ms = 960 samples per channel, output is 960 * 2 channels * 2 bytes = 3840 bytes
  const plcFrame48 = opus48.decode(null, 0, 960);
  assert(plcFrame48.length === 3840, `PLC frame for 48kHz stereo with frame_size=960 should be 3840 bytes, got ${plcFrame48.length}`);
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
