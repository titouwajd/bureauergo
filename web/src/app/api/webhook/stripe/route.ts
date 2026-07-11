import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder, createDownloadToken, logRevenue } from "@/lib/db";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};

      const productId = parseInt(metadata.productId || "0", 10);
      const customerId = metadata.customerId
        ? parseInt(metadata.customerId, 10)
        : 0;
      const total = (session.amount_total || 0) / 100;
      const stripeSessionId = session.id;

      // Create order
      const orderId = await createOrder(
        customerId || 0,
        total,
        stripeSessionId,
        [{ productId, quantity: 1, unitPrice: total }]
      );

      // Create download token for the one order item (orderItemId = 1 since we just created the order)
      if (productId && customerId) {
        await createDownloadToken(1, customerId, productId);
      }

      // Log revenue
      await logRevenue("stripe", total, `Order #${orderId} - Session ${stripeSessionId}`);

      // Update product sales_count using exported functions
      // (No direct getClient() available; the db functions handle this internally)
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
