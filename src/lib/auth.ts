import jwt from "jsonwebtoken";

export function getTokenFromRequest(req: Request): string | null {
  const cookie = req.headers.get("cookie") ?? "";
  const m = cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
  // If you later switch to Authorization header:
  // return req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? null;
}

export function getUserId(req: Request): number | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    return userId;
  } catch {
    return null;
  }
}
