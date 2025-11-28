import { SignJWT, jwtVerify } from 'jose';

/**
 * Generar token JWT
 * @param payload - Datos del usuario (id, email, role)
 * @param secret - Secreto JWT desde env
 * @returns Token JWT firmado
 */
export async function generateToken(
    payload: { id: string; email: string; role: string },
    secret: string
): Promise<string> {
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(secret);

    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // Token válido por 7 días
        .sign(secretKey);
}

/**
 * Verificar y decodificar token JWT
 * @param token - Token JWT
 * @param secret - Secreto JWT desde env
 * @returns Payload decodificado o null si es inválido
 */
export async function verifyToken(
    token: string,
    secret: string
): Promise<{ id: string; email: string; role: string } | null> {
    try {
        const encoder = new TextEncoder();
        const secretKey = encoder.encode(secret);

        const { payload } = await jwtVerify(token, secretKey);

        return {
            id: payload.id as string,
            email: payload.email as string,
            role: payload.role as string,
        };
    } catch (error) {
        return null;
    }
}
