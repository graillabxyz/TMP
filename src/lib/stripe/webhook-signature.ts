import { createHmac, timingSafeEqual } from "node:crypto";

const WEBHOOK_TOLERANCE_SECONDS = 300;

export function verifyStripeWebhookSignature(input: {
  payload: string;
  signature: string;
  secret: string;
}) {
  const parts = input.signature
    .split(",")
    .reduce<Record<string, string[]>>((acc, item) => {
      const [key, value] = item.split("=");

      if (key && value) {
        acc[key] = [...(acc[key] ?? []), value];
      }

      return acc;
    }, {});
  const timestamp = parts.t?.[0];
  const signatures = parts.v1 ?? [];

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const timestampSeconds = Number(timestamp);

  if (
    !Number.isFinite(timestampSeconds) ||
    Math.abs(Date.now() / 1000 - timestampSeconds) > WEBHOOK_TOLERANCE_SECONDS
  ) {
    return false;
  }

  const expected = createHmac("sha256", input.secret)
    .update(`${timestamp}.${input.payload}`)
    .digest("hex");

  return signatures.some((signature) => {
    const expectedBuffer = Buffer.from(expected, "hex");
    const signatureBuffer = Buffer.from(signature, "hex");

    return (
      expectedBuffer.length === signatureBuffer.length &&
      timingSafeEqual(expectedBuffer, signatureBuffer)
    );
  });
}
