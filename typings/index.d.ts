declare module '@discordjs/opus' {
	export class OpusEncoder {
		public constructor(rate?: number, channels?: number);
		public encode(buf: Buffer): Buffer;
		/**
		 * Decodes the given Opus buffer to PCM signed 16-bit little-endian
		 * @param buf Opus buffer, or null/undefined for packet loss concealment (PLC)
		 * @param decode_fec Optional flag to enable forward error correction (0 or 1, default 0)
		 * @param frame_size Optional number of samples per channel to decode. For PLC or FEC, this must be exactly the duration of the missing audio (e.g., 960 for 20ms at 48kHz). Defaults to maximum frame size for normal decoding.
		 */
		public decode(buf: Buffer | null | undefined, decode_fec?: number | boolean, frame_size?: number): Buffer;
		public applyEncoderCTL(ctl: number, value: number): void;
		public applyDecoderCTL(ctl: number, value: number): void;
		public setBitrate(bitrate: number): void;
		public getBitrate(): number;
	}
}
