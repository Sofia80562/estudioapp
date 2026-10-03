import { prisma } from '@/database/client';
import { accessRequestDb } from '@/database/courses';
import { createFromRegistration } from '@/database/users';
import { BusinessRuleError } from '@/errors/business-rule-error';
import { ConflictError } from '@/errors/conflict-error';
import { hashPassword } from '@/lib/oauth/admin';
import type { RegisterBody } from '@/validations/auth/register.validation';

const ESTUDIANTE_ROLE_CODE = 'estudiante';

export type RegisterResult =
    | {
            accountType: 'estudiante';
            user: { id: string; email: string; firstName: string; lastName: string };
      }
    | {
            accountType: 'gestor-academico';
            user: { id: string; email: string; firstName: string; lastName: string };
            accessRequestId: string;
            organizationStatus: 'PENDING_APPROVAL';
      };

/**
 * Orquesta el registro público en EstudioApp: valida unicidad del correo,
 * cifra la contraseña localmente y crea la identidad y sus roles en PostgreSQL.
 */
export const register = async (body: RegisterBody): Promise<RegisterResult> => {
    const existingUser = await prisma.user.findUnique({ where: { email: body.email } });

    if (existingUser) {
        throw new ConflictError('Ya existe una cuenta con ese correo electrónico.');
    }

    const hashedPassword = await hashPassword(body.password);

    if (body.accountType === 'estudiante') {
        const estudianteRole = await prisma.role.findFirst({
            where: { code: ESTUDIANTE_ROLE_CODE, organizationId: null, deletedAt: null },
            select: { id: true },
        });

        if (!estudianteRole) {
            throw new BusinessRuleError(
                'El rol Estudiante no está disponible en este entorno. Contacta a soporte.',
            );
        }

        const user = await createFromRegistration(
            hashedPassword,
            { email: body.email, firstName: body.firstName, lastName: body.lastName },
            estudianteRole.id,
        );

        return {
            accountType: 'estudiante',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.profile?.firstName ?? body.firstName,
                lastName: user.profile?.lastName ?? body.lastName,
            },
        };
    }

    // Extraemos el ID o convertimos según la estructura de body.organization si es un objeto
    const orgId = typeof body.organization === 'string' 
        ? body.organization 
        : (body.organization as any)?.id;

    const { user, accessRequest } = await accessRequestDb.createUserWithAccessRequest({
        passwordHash: hashedPassword,
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        organizationId: orgId,
    });

    return {
        accountType: 'gestor-academico',
        user: {
            id: user.id,
            email: user.email,
            firstName: body.firstName,
            lastName: body.lastName,
        },
        accessRequestId: accessRequest.id,
        organizationStatus: 'PENDING_APPROVAL',
    };
};