import type { NextApiRequest, NextApiResponse } from 'next';
import { decrypt } from '@/lib/session'; // Usamos tu función decrypt
import { env } from '@/lib/config/env';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieValue = req.cookies[env.SESSION_COOKIE_NAME];

  if (!cookieValue) {
    return res.status(401).json({ error: 'No hay una sesión activa.' });
  }

  try {
    const sessionPayload = await decrypt(cookieValue);

   
    
    return res.status(200).json({
      authenticated: true,
      session: sessionPayload, 
    });
  } catch (error) {
    return res.status(401).json({ error: 'Sesión inválida o expirada.' });
  }
}