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

⚠ Node.js v22 or newer is required.

`@discordjs/opus` should build on any platform supported by Node.js and [node-gyp]. These are built and tested in CI:

- Linux x64 & arm64 (glibc and musl)
- macOS x64 & arm64
- Windows x64 & arm64

## Prebuilt binaries

On install, a prebuilt binary is downloaded if one matches your platform. Otherwise the addon is compiled from source,
which requires the [node-gyp prerequisites] (Python and a C/C++ toolchain).

Prebuilt binaries are published for Node.js 22, 24 and 26 on:

| OS      | Architectures | Notes                                  |
| ------- | ------------- | -------------------------------------- |
| Linux   | x64, arm64    | glibc 2.35, 2.36, 2.39, 2.41, and 2.43 |
| Linux   | x64, arm64    | musl                                   |
| macOS   | x64, arm64    |                                        |
| Windows | x64, arm64    |                                        |

Linux prebuilds match by exact glibc versions and the musl version of the `node:<version>-alpine` images at release
time; other versions build from source.

To always build from source, set `npm_config_build_from_source=true` when installing.

[node-gyp]: https://github.com/nodejs/node-gyp
[node-gyp prerequisites]: https://github.com/nodejs/node-gyp#installation
