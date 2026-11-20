import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";
const serverMock =
  "data:text/javascript," +
  encodeURIComponent(
    "export async function createClient(){return globalThis.checkoutStatusDb}",
  );
registerHooks({
  resolve(s, c, n) {
    return n(
      s === "@/lib/supabase/server"
        ? serverMock
        : s === "next/server"
          ? "next/server.js"
          : s.startsWith("@/")
            ? new URL(`../src/${s.slice(2)}.ts`, import.meta.url).href
            : s,
      c,
    );
  },
});
const { GET } = await import("../src/app/api/stripe/checkout-status/route.ts");
const { NextRequest } = await import("next/server.js");
function setup(
  t,
  {
    user = "owner",
    sessionOwner = "owner",
    payment = "paid",
    dbStatus = "active",
    dbSubscription = "sub_example",
  } = {},
) {
  process.env.STRIPE_SECRET_KEY = "test";
  let reads = 0;
  globalThis.checkoutStatusDb = {
    auth: {
      async getUser() {
        return { data: { user: user ? { id: user } : null } };
      },
    },
    from() {
      const q = {
        select() {
          return q;
        },
        eq() {
          return q;
        },
        async single() {
          return {
            data: {
              stripe_subscription_id: dbSubscription,
              verification_subscription_status: dbStatus,
            },
            error: null,
          };
        },
      };
      return q;
    },
  };
  t.mock.method(globalThis, "fetch", async () => {
    reads++;
    return Response.json({
      id: "cs_test_example",
      status: "complete",
      payment_status: payment,
      subscription: "sub_example",
      metadata: { owner_id: sessionOwner, supplier_id: "supplier" },
    });
  });
  return () => reads;
}
const request = () =>
  new NextRequest(
    "https://example.com/api/stripe/checkout-status?session_id=cs_test_example",
  );
test("confirmation requires authentication before contacting Stripe", async (t) => {
  const reads = setup(t, { user: null });
  assert.equal((await GET(request())).status, 401);
  assert.equal(reads(), 0);
});
test("another account cannot inspect a checkout session", async (t) => {
  setup(t, { sessionOwner: "someone-else" });
  assert.equal((await GET(request())).status, 404);
});
test("paid checkout alone cannot report activation before the matching database subscription is active", async (t) => {
  setup(t, { dbStatus: "inactive" });
  assert.equal((await (await GET(request())).json()).state, "pending");
});
test("old checkout cannot report a different current subscription as activated", async (t) => {
  setup(t, { dbSubscription: "sub_other" });
  assert.equal((await (await GET(request())).json()).state, "pending");
});
test("unpaid checkout cannot report activation", async (t) => {
  setup(t, { payment: "unpaid" });
  assert.equal((await (await GET(request())).json()).state, "pending");
});
test("paid checkout and matching active database membership confirms activation without writes", async (t) => {
  setup(t);
  const r = await GET(request());
  assert.equal((await r.json()).state, "active");
  assert.equal(r.headers.get("cache-control"), "no-store");
});
