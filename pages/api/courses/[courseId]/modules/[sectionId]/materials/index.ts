import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/database/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { courseId, sectionId } = req.query;

    if (typeof sectionId !== 'string') {
        return res.status(400).json({ error: 'ID de sección inválido' });
    }

    if (req.method === 'GET') {
        try {
            const materials = await prisma.material.findMany({
                where: { sectionId },
                orderBy: { createdAt: 'desc' },
            });
            return res.status(200).json(materials);
        } catch (error) {
            return res.status(500).json({ error: 'Error al obtener los materiales' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { title, type, url } = req.body;
            const newMaterial = await prisma.material.create({
                data: {
                    sectionId,
                    title,
                    type,
                    url,
                },
            });
            return res.status(201).json(newMaterial);
        } catch (error) {
            return res.status(500).json({ error: 'Error al crear el material' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Método ${req.method} no permitido`);
}