import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";

import { verifyStripeWebhookSignature } from "../src/lib/stripe/webhook-signature.ts";

function sign(payload, secret, timestamp) {
  return createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
}

test("accepts a current valid Stripe webhook signature", () => {
  const payload = '{"id":"evt_test","type":"customer.subscription.updated"}';
  const secret = "whsec_test";
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = sign(payload, secret, timestamp);

  assert.equal(
    verifyStripeWebhookSignature({
      payload,
      secret,
      signature: `t=${timestamp},v1=${signature}`,
    }),
    true,
  );
});

test("rejects stale, malformed, and payload-mismatched signatures", () => {
  const payload = '{"id":"evt_test"}';
  const secret = "whsec_test";
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const staleTimestamp = currentTimestamp - 301;

  assert.equal(
    verifyStripeWebhookSignature({
      payload,
      secret,
      signature: `t=${staleTimestamp},v1=${sign(
        payload,
        secret,
        staleTimestamp,
      )}`,
    }),
    false,
  );
  assert.equal(
    verifyStripeWebhookSignature({
      payload,
      secret,
      signature: `t=${currentTimestamp},v1=not-hex`,
    }),
    false,
  );
  assert.equal(
    verifyStripeWebhookSignature({
      payload: `${payload} `,
      secret,
      signature: `t=${currentTimestamp},v1=${sign(
        payload,
        secret,
        currentTimestamp,
      )}`,
    }),
    false,
  );
});
