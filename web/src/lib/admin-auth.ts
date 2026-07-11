import { NextRequest } from "next/server";

/**
 * Vérifie que la requête provient d'un administrateur authentifié.
 * Vérifie dans l'ordre : cookie admin_token, header Authorization, query param token.
 */
export function verifyAdmin(request: NextRequest): boolean {
  // Vérifier le cookie
  const cookieToken = request.cookies.get("admin_token")?.value;
  if (cookieToken === "admin-session-token") return true;

  // Vérifier le header Authorization
  const authHeader = request.headers.get("authorization");
  if (authHeader === "Bearer admin-session-token") return true;
  if (authHeader === "admin-session-token") return true;

  // Fallback : query param (pratique pour les appels depuis le scraper)
  const { searchParams } = new URL(request.url);
  const queryToken = searchParams.get("token");
  if (queryToken === "admin-session-token") return true;

  return false;
}

/**
 * Hash simple pour stockage futur (utiliser bcrypt en production).
 */
export function hashPassword(password: string): string {
  // Placeholder — en production, utiliser bcrypt
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `sha256:${Math.abs(hash).toString(36)}`;
}

/**
 * Compare un mot de passe avec un hash.
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
