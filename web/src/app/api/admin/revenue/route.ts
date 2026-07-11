import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { getRevenueSummary, getMonthlyRevenue, logRevenue } from "@/lib/db";

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const revenueSummary = await getRevenueSummary();
    const monthlyRevenue = await getMonthlyRevenue();

    return NextResponse.json({
      revenueSummary,
      monthlyRevenue,
    });
  } catch (error) {
    console.error("Admin revenue GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { source, amount, description } = await request.json();

    if (!source || amount === undefined) {
      return NextResponse.json(
        { error: "source et amount requis" },
        { status: 400 }
      );
    }

    await logRevenue(source, amount, description);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin revenue POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
