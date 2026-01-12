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

## Bun support

Bun does not run lifecycle scripts by default. You can either trust this dependency or run the install script manually. Bun uses the Node 20 N-API prebuilds by default:

```bash
bun pm trust @discordjs/opus
bun install
```

```bash
bun install --ignore-scripts
bun run install
```

If you use a monorepo, run the command in the workspace that installs `@discordjs/opus`.

To run the test suite with Bun, use:

```bash
bun run test:bun
```
