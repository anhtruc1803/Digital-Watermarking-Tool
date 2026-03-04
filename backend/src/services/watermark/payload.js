export function buildPayload(message) {
  return { message, ts: Date.now() };
}
