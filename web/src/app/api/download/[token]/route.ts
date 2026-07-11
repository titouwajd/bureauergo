import { NextRequest, NextResponse } from "next/server";
import { validateDownloadToken, markTokenUsed, getProducts } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const tokenData = await validateDownloadToken(token);

    if (!tokenData) {
      return NextResponse.json(
        { error: "Lien de téléchargement invalide" },
        { status: 404 }
      );
    }

    if (tokenData.used_at) {
      return NextResponse.json(
        { error: "Ce lien de téléchargement a déjà été utilisé" },
        { status: 410 }
      );
    }

    if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Ce lien de téléchargement a expiré" },
        { status: 410 }
      );
    }

    // Get product file path via the exported getProducts helper
    const products = await getProducts();
    const product = products.find((p) => p.id === tokenData.product_id);

    if (!product || !product.file_path) {
      return NextResponse.json(
        { error: "Fichier introuvable" },
        { status: 404 }
      );
    }

    const filePath = path.resolve(product.file_path);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Fichier introuvable sur le serveur" },
        { status: 404 }
      );
    }

    // Mark token as used (only after successful file resolution)
    await markTokenUsed(token);

    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": String(fileBuffer.length),
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
