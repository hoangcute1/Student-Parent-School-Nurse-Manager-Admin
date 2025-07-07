/**
 * JWT token utilities for extracting user information
 */

interface JwtPayload {
  sub: string; // user ID
  email: string;
  role: string;
  iat?: number; // issued at
  exp?: number; // expiration
}

/**
 * Decode JWT token without verification (client-side only)
 * This is safe for extracting user info since we're not verifying the token
 */
export function decodeJWT(token: string): JwtPayload | null {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded) as JwtPayload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

/**
 * Get user ID from JWT token
 */
export function getUserIdFromToken(token: string): string | null {
  const payload = decodeJWT(token);
  return payload?.sub || null;
}

/**
 * Get user role from JWT token
 */
export function getUserRoleFromToken(token: string): string | null {
  const payload = decodeJWT(token);
  return payload?.role || null;
}

/**
 * Get user email from JWT token
 */
export function getUserEmailFromToken(token: string): string | null {
  const payload = decodeJWT(token);
  return payload?.email || null;
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * Get all user info from JWT token
 */
export function getUserInfoFromToken(token: string): {
  userId: string | null;
  email: string | null;
  role: string | null;
  isExpired: boolean;
} {
  const payload = decodeJWT(token);

  if (!payload) {
    return {
      userId: null,
      email: null,
      role: null,
      isExpired: true,
    };
  }

  return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
    isExpired: isTokenExpired(token),
  };
}
