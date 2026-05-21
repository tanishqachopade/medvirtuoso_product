import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);

export async function generateToken(payload: {
  userId: string;
  email: string;
  role: string;
}) {
  return await new SignJWT(payload)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(
  token: string
) {
  try {
    const { payload } =
      await jwtVerify(token, secret);

    return payload;
  } catch {
    return null;
  }
}