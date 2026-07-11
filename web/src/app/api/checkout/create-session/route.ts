import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProducts } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

export async function POST(request: NextRequest) {
  try {
    const { productId, customerId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "productId requis" },
        { status: 400 }
      );
    }

    const products = await getProducts();
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: product.title,
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${SITE_URL}/boutique/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/boutique`,
      metadata: {
        productId: String(productId),
        customerId: customerId ? String(customerId) : "",
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Checkout session error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
