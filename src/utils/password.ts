import * as bcrypt from 'bcryptjs';

/**
 * Hash de contraseña con bcrypt
 * @param password - Contraseña en texto plano
 * @returns Hash de la contraseña
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Verificar contraseña contra hash
 * @param password - Contraseña en texto plano
 * @param hash - Hash almacenado
 * @returns true si la contraseña coincide
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
