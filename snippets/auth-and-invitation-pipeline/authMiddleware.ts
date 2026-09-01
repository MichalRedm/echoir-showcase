import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedUserPayload {
  userId: string;
  email: string;
}

// Augment Express Request declaration to include strongly-typed user session context
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserPayload;
      userId?: string;
    }
  }
}

export class UnauthorizedError extends Error {
  readonly statusCode = 401;
  constructor(message = "Authentication required to access this resource") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * JWT Authentication & Context Middleware
 *
 * Extracts Bearer tokens from authorization headers, validates digital signatures,
 * and attaches verified user identity context to the incoming Express request.
 */
export function createAuthMiddleware(jwtSecret: string) {
  return function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new UnauthorizedError("Missing or malformed Authorization header"));
    }

    const token = authHeader.substring(7).trim();

    try {
      const decoded = jwt.verify(token, jwtSecret) as AuthenticatedUserPayload;

      if (!decoded || !decoded.userId) {
        return next(new UnauthorizedError("Invalid token claims"));
      }

      // Attach strongly typed authentication context to the request pipeline
      req.user = decoded;
      req.userId = decoded.userId;

      return next();
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return next(new UnauthorizedError("Session expired. Please sign in again."));
      }
      return next(new UnauthorizedError("Invalid or corrupted authentication token"));
    }
  };
}

export default createAuthMiddleware;
