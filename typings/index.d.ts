declare module '@discordjs/opus' {
	export class OpusEncoder {
		public constructor(rate?: number, channels?: number);
		public encode(buf: Buffer): Buffer;
		/**
		 * Decodes the given Opus buffer to PCM signed 16-bit little-endian
		 * @param buf Opus buffer
		 */
		public decode(buf: Buffer): Buffer;
		/**
		 * Performs packet loss concealment (PLC) or forward error correction (FEC)
		 * @param frame_size Number of samples per channel to generate. This must be exactly the duration of the missing audio (e.g., 960 for 20ms at 48kHz, 320 for 20ms at 16kHz).
		 * @param packet Optional Opus packet buffer for FEC. If provided, FEC will be used to reconstruct the audio. If omitted, null, or undefined, PLC will generate synthetic audio.
		 */
		public conceal(frame_size: number, packet?: Buffer | null): Buffer;
		public applyEncoderCTL(ctl: number, value: number): void;
		public applyDecoderCTL(ctl: number, value: number): void;
		public setBitrate(bitrate: number): void;
		public getBitrate(): number;
	}
}
