declare module '@discordjs/opus' {
	export class OpusEncoder {
		public constructor(rate?: number, channels?: number);
		public encode(buf: Buffer): Buffer;
		/**
		 * Encodes the given PCM 32-bit little-endian floating point samples (in the range -1.0 to 1.0) to an Opus buffer
		 * @param buf PCM float buffer
		 */
		public encodeFloat(buf: Buffer | Float32Array): Buffer;
		/**
		 * Decodes the given Opus buffer to PCM signed 16-bit little-endian
		 * @param buf Opus buffer
		 */
		public decode(buf: Buffer): Buffer;
		/**
		 * Decodes the given Opus buffer to PCM 32-bit little-endian floating point samples
		 * @param buf Opus buffer
		 */
		public decodeFloat(buf: Buffer): Buffer;
		public applyEncoderCTL(ctl: number, value: number): void;
		public applyDecoderCTL(ctl: number, value: number): void;
		public setBitrate(bitrate: number): void;
		public getBitrate(): number;
	}
}
