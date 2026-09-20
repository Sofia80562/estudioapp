import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();
/**
 * Asigna un rol a un usuario estudiante o administrador en EstudioApp.
 *
 *   yarn asignar-rol --email estudiante@estudioapp.local --rol student
 *   yarn asignar-rol --email admin@estudioapp.local      --rol admin
 */
type Args = {
	email: string;
	rol: string;
};

const parseArgs = (argv: string[]): Args => {
	const values = new Map<string, string>();

	for (let index = 0; index < argv.length; index += 1) {
		const token = argv[index];

		if (!token.startsWith('--')) {
			continue;
		}

		const next = argv[index + 1];

		if (!next || next.startsWith('--')) {
			throw new Error(`Falta el valor para ${token}`);
		}

		values.set(token.slice(2), next);
		index += 1;
	}

	const email = values.get('email');
	const rol = values.get('rol');

	if (!email || !rol) {
		throw new Error(
			'Uso: yarn asignar-rol --email <email> --rol <codigo-del-rol>',
		);
	}

	return {
		email,
		rol,
	};
};

const main = async (): Promise<void> => {
	const args = parseArgs(process.argv.slice(2));

	// 1. Buscar al usuario por correo
	const user = await prisma.user.findUnique({ where: { email: args.email } });

	if (!user) {
		throw new Error(
			`No existe el usuario ${args.email}. Debe iniciar sesión al menos una vez para registrarse.`,
		);
	}

	// 2. Buscar el rol disponible
	const role = await prisma.role.findFirst({
		where: { code: args.rol, deletedAt: null },
	});

	if (!role) {
		const disponibles = await prisma.role.findMany({
			where: { deletedAt: null },
			select: { code: true },
		});

		throw new Error(
    `No existe el rol '${args.rol}'. Disponibles: ${disponibles.map((r: { code: string }) => r.code).join(', ') || '(ninguno, corre yarn seed)'}`
);
	}

	// 3. Validar si ya tiene asignado este rol
	const existing = await prisma.userRole.findFirst({
		where: { userId: user.id, roleId: role.id },
	});

	if (existing) {
		console.log(
			`⏭️  ${args.email} ya tiene el rol '${role.name}'. Nada que hacer.`,
		);
		return;
	}

	// 4. Crear la relación en user_roles
	await prisma.userRole.create({
		data: { userId: user.id, roleId: role.id },
	});

	console.log(`✅ Rol '${role.name}' asignado exitosamente a ${args.email}`);
};

main()
	.catch((error: unknown) => {
		console.error('❌', error instanceof Error ? error.message : error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});