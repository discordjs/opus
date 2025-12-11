# @discordjs/opus [![Build](https://github.com/discordjs/opus/workflows/Build/badge.svg)](https://github.com/discordjs/opus/actions?query=workflow%3ABuild) [![Prebuild](https://github.com/discordjs/opus/workflows/Prebuild/badge.svg)](https://github.com/discordjs/opus/actions?query=workflow%3APrebuild)

> Native bindings to libopus v1.5

## Usage

```js
import { OpusEncoder } from '@discordjs/opus';

// Create the encoder.
// Specify 48kHz sampling rate and 2 channel size.
const encoder = new OpusEncoder(48_000, 2);

// Encode and decode.
const encoded = encoder.encode(buffer);
const decoded = encoder.decode(encoded);
```

## Platform support

⚠ Node.js v20 or newer is required.

- Linux x64 & ia32
- Linux arm (RPi 1 & 2)
- Linux arm64 (RPi 3)
- macOS x64
- macOS arm64
- Windows x64
