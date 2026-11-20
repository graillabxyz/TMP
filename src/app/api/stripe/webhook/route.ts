import { NextResponse, type NextRequest } from "next/server";
import { retrieveStripeSubscription } from "@/lib/stripe/api";
import { getStripeConfig } from "@/lib/stripe/config";
import {
  blocksNewSubscription,
  getMembershipDetails,
} from "@/lib/stripe/membership";
import { verifyStripeWebhookSignature } from "@/lib/stripe/webhook-signature";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const config = getStripeConfig();
  if (!config.webhookSecret)
    return NextResponse.json(
      { error: "Webhook unavailable." },
      { status: 503 },
    );
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (
    !signature ||
    !verifyStripeWebhookSignature({
      payload,
      signature,
      secret: config.webhookSecret,
    })
  ) {
    return NextResponse.json(
      { error: "Invalid Stripe signature." },
      { status: 400 },
    );
  }
  let event;
  try {
    event = JSON.parse(payload);
    if (
      !event?.id ||
      !Number.isFinite(event.created) ||
      !event.type ||
      !event.data?.object
    )
      throw new Error("Invalid event");
  } catch {
    return NextResponse.json(
      { error: "Invalid Stripe event." },
      { status: 400 },
    );
  }
  try {
    const object = event.data.object;
    const subscriptionId = [
      "checkout.session.completed",
      "checkout.session.async_payment_succeeded",
    ].includes(event.type)
      ? object.subscription
      : [
            "customer.subscription.created",
            "customer.subscription.updated",
            "customer.subscription.deleted",
          ].includes(event.type)
        ? object.id
        : null;
    if (!subscriptionId || typeof subscriptionId !== "string")
      return NextResponse.json({ received: true });

    // Read current Stripe state: delayed events must not restore stale paid access.
    const subscription = await retrieveStripeSubscription(subscriptionId);
    const details = getMembershipDetails(subscription, config);
    const supplierId = subscription.metadata?.supplier_id;
    const ownerId = subscription.metadata?.owner_id;
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id;
    if (!supplierId || !ownerId || !customerId) {
      if (!details) return NextResponse.json({ received: true, ignored: true });
      throw new Error("Membership ownership metadata is missing.");
    }
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("suppliers")
      .select("owner_id, stripe_customer_id, stripe_subscription_id")
      .eq("id", supplierId)
      .single();
    const supplier = data as {
      owner_id: string;
      stripe_customer_id: string | null;
      stripe_subscription_id: string | null;
    } | null;
    if (
      error ||
      !supplier ||
      supplier.owner_id !== ownerId ||
      (supplier.stripe_customer_id &&
        supplier.stripe_customer_id !== customerId)
    ) {
      throw new Error("Stripe membership does not match supplier ownership.");
    }
    if (!details && supplier.stripe_subscription_id !== subscription.id)
      return NextResponse.json({ received: true, ignored: true });
    if (
      supplier.stripe_subscription_id &&
      supplier.stripe_subscription_id !== subscription.id
    ) {
      const current = await retrieveStripeSubscription(
        supplier.stripe_subscription_id,
      );
      if (
        blocksNewSubscription(current.status) ||
        !blocksNewSubscription(subscription.status)
      ) {
        return NextResponse.json({ received: true, ignored: true });
      }
    }
    const rpc = supabase as unknown as {
      rpc: (
        name: string,
        args: Record<string, unknown>,
      ) => Promise<{ error: { message: string } | null }>;
    };
    const result = await rpc.rpc("sync_supplier_stripe_subscription", {
      p_supplier_id: supplierId,
      p_stripe_customer_id: customerId,
      p_stripe_subscription_id: subscription.id,
      p_stripe_status: details?.accessStatus ?? "inactive",
      p_current_period_end: details
        ? new Date(details.endsAt * 1000).toISOString()
        : null,
      p_event_id: event.id,
      p_event_created_at: new Date(event.created * 1000).toISOString(),
    });
    if (result.error) throw new Error(result.error.message);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(
      "Stripe membership synchronization failed",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      { error: "Unable to synchronize membership." },
      { status: 500 },
    );
  }
}
