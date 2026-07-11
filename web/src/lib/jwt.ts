import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'ergozone-jwt-secret-dev-only';

export function signToken(payload: object): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { customerId: number; email: string } {
  return jwt.verify(token, SECRET) as { customerId: number; email: string };
}
