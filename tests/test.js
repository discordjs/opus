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

// Float encoding test
{
	const frame = fs.readFileSync(path.join(__dirname, 'frame.opus'));

	const decoded = new OpusEncoder(16_000, 1).decode(frame);
	const decodedFloat = new OpusEncoder(16_000, 1).decodeFloat(frame);

	assert(decodedFloat.length === 1280, 'Decoded float frame length is not 1280');

	// The float output matches the 16-bit output to within a single 16-bit step.
	for (let index = 0; index < decoded.length / 2; index++) {
		const expected = decoded.readInt16LE(index * 2) / 32_768;
		assert(Math.abs(decodedFloat.readFloatLE(index * 4) - expected) <= 1 / 32_768, `Sample ${index} differs`);
	}

	const opus = new OpusEncoder(16_000, 1);
	const reEncoded = opus.encodeFloat(decodedFloat);
	assert(reEncoded.length === 45, 're-encoded float frame length is not 45');

	// Typed arrays and buffers that aren't aligned to 4 bytes are accepted
	const samples = new Float32Array(
		decodedFloat.buffer.slice(decodedFloat.byteOffset, decodedFloat.byteOffset + decodedFloat.length),
	);
	assert(new OpusEncoder(16_000, 1).encodeFloat(samples).equals(reEncoded), 'Float32Array input differs');

	const unaligned = Buffer.alloc(decodedFloat.length + 1);
	decodedFloat.copy(unaligned, 1);
	assert(new OpusEncoder(16_000, 1).encodeFloat(unaligned.subarray(1)).equals(reEncoded), 'Unaligned input differs');
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
	assert.throws(
		() => new OpusEncoder().encodeFloat(new DataView(new ArrayBuffer(7680))),
		/Provided input needs to be a buffer/,
	);
	assert.throws(
		() => new OpusEncoder().decodeFloat(new DataView(new ArrayBuffer(0))),
		/Provided input needs to be a buffer/,
	);
	assert.throws(() => new OpusEncoder().encodeFloat(), /Expected 1 argument/);
	assert.throws(() => new OpusEncoder().decodeFloat(), /Expected 1 argument/);
}

// Invalid values throw
{
	const opus = new OpusEncoder(48_000, -1);

	assert.throws(() => opus.encode(Buffer.alloc(960 * 2)), /Could not create encoder/);
	assert.throws(() => opus.decode(Buffer.alloc(3)), /Could not create decoder/);
	assert.throws(() => opus.encodeFloat(Buffer.alloc(960 * 4)), /Could not create encoder/);
	assert.throws(() => opus.decodeFloat(Buffer.alloc(3)), /Could not create decoder/);
}

// Failing to encode throws
{
	const opus = new OpusEncoder(48_000, 2);

	assert.throws(() => opus.encode(Buffer.alloc(10)), /One or more invalid\/out of range arguments/);
	assert(opus.encode(Buffer.alloc(960 * 2 * 2)).length > 0, 'Encoding a valid frame after an error failed');
}

// Failing to encode floats throws
{
	const opus = new OpusEncoder(48_000, 2);

	assert.throws(() => opus.encodeFloat(Buffer.alloc(10)), /One or more invalid\/out of range arguments/);
	assert.throws(
		() => opus.encodeFloat(Buffer.alloc(6 * 960 * 2 * 4 + 8)),
		/One or more invalid\/out of range arguments/,
	);
	assert(opus.encodeFloat(Buffer.alloc(960 * 2 * 4)).length > 0, 'Encoding a valid float frame after an error failed');
}

// Failing to decode floats throws
{
	const opus = new OpusEncoder(48_000, 2);

	assert.throws(() => opus.decodeFloat(Buffer.from([0xff, 0xff, 0xff])), /The compressed data passed is corrupted/);
}

// Float round trip at 48kHz stereo
{
	const opus = new OpusEncoder(48_000, 2);
	const decoded = opus.decodeFloat(opus.encodeFloat(Buffer.alloc(960 * 2 * 4)));

	assert(decoded.length === 960 * 2 * 4, 'Round-tripped float frame length is not 7680');
}

console.log('Passed');
