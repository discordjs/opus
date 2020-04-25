# @discordjs/opus 
> Native bindings to libopus v1.3

## Usage

```js
const { OpusEncoder } = require('@discodjs/opus');

// Create the encoder.
// Specify 48kHz sampling rate and 2 channel size.
const encoder = new OpusEncoder(48000, 2);

// Encode and decode.
const encoded = encoder.encode(buffer, 48000 / 100);
const decoded = encoder.decode(encoded, 48000 / 100);
```

## Platform support

- Linux x64 & ia32
- Linux arm (RPi 1 & 2)
- Linux arm64 (RPi 3)
- macOS x64
- Windows x64
