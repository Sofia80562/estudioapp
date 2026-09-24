import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import { routerOptions } from '@/lib/api/router-config';
import { auth } from '@/middleware/auth';

const handler = createRouter<NextApiRequest, NextApiResponse>();

handler.use(auth).post(async (req, res): Promise<void> => {
	// Obtenemos el identificador o invalidamos la sesión actual del usuario autenticado
	const session = req.session;
	
	if (session) {
		// Limpiamos las cookies o invalidamos la sesión en el cliente/servidor según corresponda
		res.setHeader('Set-Cookie', 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict');
	}

	res.status(200).json({ message: 'Sesión cerrada exitosamente' });
});

export default handler.handler(routerOptions);