import { prisma } from '@/database/client';
import { accessRequestDb } from '@/database/courses';
import { createFromRegistration } from '@/database/users';
import { BusinessRuleError } from '@/errors/business-rule-error';
import { ConflictError } from '@/errors/conflict-error';
import {
	createKeycloakUser,
	deleteKeycloakUser,
	KeycloakUserConflictError,
} from '@/lib/oauth/admin';
import { logger } from '@/lib/logger';
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
 * Orquesta el registro público en EstudioApp: valida unicidad antes de gastar una
 * llamada a Keycloak, crea la identidad real ahí, y luego crea el registro en la base de datos.
 * Si el paso posterior falla, revierte (elimina) el usuario en Keycloak para evitar cuentas huérfanas.
 */
export const register = async (body: RegisterBody): Promise<RegisterResult> => {
	const existingUser = await prisma.user.findUnique({ where: { email: body.email } });

	if (existingUser) {
		throw new ConflictError('Ya existe una cuenta con ese correo electrónico.');
	}

	let keycloakId: string;

	try {
		const created = await createKeycloakUser({
			email: body.email,
			password: body.password,
			firstName: body.firstName,
			lastName: body.lastName,
		});
		keycloakId = created.keycloakId;
	} catch (error) {
		if (error instanceof KeycloakUserConflictError) {
			throw new ConflictError(error.message);
		}

		throw error;
	}

	try {
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
				keycloakId,
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

		const { user, accessRequest } = await accessRequestDb.createUserWithAccessRequest(
			keycloakId,
			{ email: body.email, firstName: body.firstName, lastName: body.lastName },
			body.organization!,
			body.venue!,
		);

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
	} catch (error) {
		try {
			await deleteKeycloakUser(keycloakId);
		} catch (cleanupError) {
			logger.error(
				{ keycloakId, cleanupError },
				'No se pudo revertir la creación del usuario en Keycloak tras un fallo en EstudioApp — requiere limpieza manual.',
			);
		}

		throw error;
	}
};