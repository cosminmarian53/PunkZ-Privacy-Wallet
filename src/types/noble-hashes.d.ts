// Type declarations for @noble/hashes subpath imports
// The package exports use .js extensions in the exports map
declare module '@noble/hashes/sha2.js' {
  export function sha256(data: Uint8Array | string): Uint8Array;
  export function sha224(data: Uint8Array | string): Uint8Array;
}

declare module '@noble/hashes/sha3.js' {
  export function keccak_256(data: Uint8Array | string): Uint8Array;
  export function keccak_512(data: Uint8Array | string): Uint8Array;
  export function sha3_256(data: Uint8Array | string): Uint8Array;
  export function sha3_512(data: Uint8Array | string): Uint8Array;
}
