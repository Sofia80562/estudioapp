import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import prisma from '../../../lib/prisma';

const routerOptions = {
  onError: (err: any, req: NextApiRequest, res: NextApiResponse) => {
    res.status(500).json({ error: err.message });
  },
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  },
};

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Buscamos en la tabla 'user' (que Prisma mapea a 'users')
    // Incluimos 'profile' porque es la relación definida en tu esquema
    const usuarioValido = await prisma.user.findFirst({
      include: { profile: true }
    });

    if (!usuarioValido) {
      return res.status(401).json({ authenticated: false, message: 'No hay sesión activa' });
    }

    res.status(200).json({
      data: {
        id: usuarioValido.id,
        email: usuarioValido.email,
        profile: usuarioValido.profile // Esto traerá firstName, lastName, etc.
      },
    });
  } catch (error: any) {
    res.status(500).json({ 
      error: "Error al consultar la base de datos", 
      details: error.message 
    });
  }
});

export default router.handler(routerOptions); 