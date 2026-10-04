/**
 * Shared type definitions for baileys-caller.
 *
 * @author ShellTear
 */

/** Audio stream configuration reported by the WASM. */
export type AudioConfig = {
  sampleRate: number;
  channels: number;
  bitsPerSample: number;
  framesPerChunk: number;
};

/** Options for placing a call. */
export type CallOptions = {
  /** Phone number, digits only (e.g. `"12345678901"`). */
  to: string;
  /** Audio source: file path to MP3/WAV, `"silence"`, or `"stream"` (feed via `call.sendAudio`). */
  audioSource?: string;
  /** Auto-hangup after N ms (default: 120000). */
  durationMs?: number;
};

export type CallDirection = "incoming" | "outgoing";

/** Caller details for an inbound call. */
export type IncomingCallInfo = {
  callId: string;
  /** Caller JID (often a `@lid` JID). */
  from: string;
  /** Caller phone number (digits) when WhatsApp discloses it. */
  fromPhone?: string;
  pushName?: string;
  isVideo: boolean;
  offline: boolean;
};

/** Events emitted by an `ActiveCall`. */
export type CallEvents = {
  /** Raw WASM call state change. */
  state: (state: CallState) => void;
  ringing: () => void;
  connected: () => void;
  /** 16 kHz mono Float32 PCM frame from the remote peer. */
  audio: (pcm: Float32Array) => void;
  /** Reason: `"hangup"` | `"timeout"` | `"rejected"` | `"remote_end"` | `"disconnect"` | etc. */
  ended: (reason: string) => void;
  error: (err: Error) => void;
};

/** Top-level SDK configuration. */
export type VoipSdkConfig = {
  /** Path to a Baileys multi-file auth state directory. */
  authDir: string;
  /** Print the pairing QR in the terminal (default: true). Listen to `client.on("qr")` to render it yourself. */
  printQrInTerminal?: boolean;
  /** Uplink source for inbound calls (default `"stream"` — feed via `call.sendAudio`). */
  incomingAudioSource?: string;
  /** Auto-hangup inbound calls N ms after they are answered (default: 0 = never). */
  incomingDurationMs?: number;
  /**
   * Extra options for Baileys' `makeWASocket` (e.g. `browser`, `shouldSyncHistoryMessage`).
   * A function receives the loaded Baileys module (for helpers such as `Browsers`).
   * `auth`, `version` and `logger` are always set by the client.
   */
  socketOptions?: Record<string, unknown> | ((baileys: any) => Record<string, unknown>);
};

/** Mirrors the WhatsApp WASM `CallState` enum. */
export const CallState = {
  Idle: 0,
  Calling: 1,
  PreacceptReceived: 2,
  ReceivedCall: 3,
  AcceptSent: 4,
  AcceptReceived: 5,
  Active: 6,
  ActiveElsewhere: 7,
  Ending: 13,
} as const;
export type CallState = (typeof CallState)[keyof typeof CallState];

/** Relay list update payload from WASM call event 156. */
export type RelayListUpdate = {
  relay_key: string;
  relay_tokens: string[];
  auth_tokens?: string[];
  enable_edgeray_dtls_active_mode?: boolean;
  relays: ReadonlyArray<{
    relay_id: number;
    relay_name: string;
    token_id: number;
    auth_token_id?: number;
    addresses: ReadonlyArray<{
      protocol: number;
      ipv4?: string;
      ipv6?: string;
      port?: number;
      port_v6?: number;
    }>;
  }>;
};
