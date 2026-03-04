export const encodePayload = (s) => new TextEncoder().encode(s);
export const decodePayload = (u8) => new TextDecoder().decode(u8);
