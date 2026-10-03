import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export class LocalUserConflictError extends Error {}

/**
 * Hashea una contraseña de forma segura usando scrypt con una sal aleatoria.
 * Retorna el resultado en formato `salt:hash` para guardarlo en la base de datos.
 */
export const hashPassword = async (password: string): Promise<string> => {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    
    return `${salt}:${derivedKey.toString('hex')}`;
};

/**
 * Verifica si una contraseña en texto plano coincide con el hash almacenado.
 */
export const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
    const [salt, key] = storedHash.split(':');
    
    if (!salt || !key) {
        return false;
    }

    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    
    return derivedKey.toString('hex') === key;
};