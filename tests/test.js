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

// Invalid data types throw
{
	assert.throws(() => new OpusEncoder('16000', 1), /Expected rate to be a number/);
	assert.throws(() => new OpusEncoder(null, '1'), /Expected rate to be a number/);
	assert.throws(() => new OpusEncoder(16000, '1'), /Expected channels to be a number/);
	assert.throws(() => new OpusEncoder(16000, null), /Expected channels to be a number/);
	assert.throws(
		() => new OpusEncoder().encode(new DataView(new ArrayBuffer(3840))),
		/Provided input needs to be a buffer/,
	);
	assert.throws(
		() => new OpusEncoder().decode(new DataView(new ArrayBuffer(0))),
		/Provided input needs to be a buffer/,
	);
}

// Invalid values throw
{
	const opus = new OpusEncoder(48_000, -1);

	assert.throws(() => opus.encode(Buffer.alloc(960 * 2)), /Could not create encoder/);
	assert.throws(() => opus.decode(Buffer.alloc(3)), /Could not create decoder/);
}

// Failing to encode throws
{
	const opus = new OpusEncoder(48_000, 2);

	assert.throws(() => opus.encode(Buffer.alloc(10)), /One or more invalid\/out of range arguments/);
	assert(opus.encode(Buffer.alloc(960 * 2 * 2)).length > 0, 'Encoding a valid frame after an error failed');
}

console.log('Passed');
