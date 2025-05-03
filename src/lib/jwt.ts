import { SignJWT } from 'jose';

export async function generateJwtToken() {
    const token = process.env.N8N_FLOW_AUTHORIZATION_SECRET_KEY;

    if (!token) {
        throw new Error("N8N_FLOW_AUTHORIZATION_SECRET_KEY is not defined in environment variables.");
    }
    const secret = new TextEncoder().encode(token);

    const alg = 'HS256';

    const jwt = await new SignJWT({
        // Optional payload fields if needed
    })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('5m') // Expires in 5 minutes
        .sign(secret);

    return jwt;
}
