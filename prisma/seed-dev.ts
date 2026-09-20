import { prisma } from '@/database/client';

/**
 * Roles base del dominio para EstudioApp.
 *
 * `organizationId` aquí define de quién es la DEFINICIÓN del rol:
 *  - null  -> rol global de plataforma.
 *  - uuid  -> rol que pertenece a una institución concreta (opcional).
 */
type RoleSeed = {
	name: string;
	description: string;
	global: boolean;
};

const ROLES: RoleSeed[] = [
	{
		name: 'Estudiante',
		description: 'Gestiona sus propias tareas de estudio y organización personal.',
		global: true,
	},
	{
		name: 'Administrador',
		description: 'Administra la plataforma completa, usuarios y roles del sistema.',
		global: true,
	},
];

const toCode = (name: string): string => name.toLowerCase().replace(/\s+/gu, '-');
const normalizeName = (name: string): string =>
	name.trim().replace(/\s+/gu, ' ').toLocaleLowerCase();

const resolveOrganization = async () => {
	const preferred = await prisma.organization.findFirst({
		where: { name: 'Universidad Estatal Amazónica', deletedAt: null },
	});

	if (preferred) {
		return preferred;
	}

	const anyOrganization = await prisma.organization.findFirst({
		where: { deletedAt: null },
		orderBy: { createdAt: 'asc' },
	});

	if (anyOrganization) {
		return anyOrganization;
	}

	return prisma.organization.create({
		data: {
			name: 'EstudioApp Demo',
			normalizedName: normalizeName('EstudioApp Demo'),
			status: 'ACTIVE',
		},
	});
};

const main = async (): Promise<void> => {
	console.log('🌱 Sembrando roles base para EstudioApp...\n');

	const organization = await resolveOrganization();
	console.log(`🏢 Organización de contexto: ${organization.name} (${organization.id})\n`);

	for (const role of ROLES) {
		const organizationId = role.global ? null : organization.id;

		const existing = await prisma.role.findFirst({
			where: { organizationId, normalizedName: normalizeName(role.name), deletedAt: null },
		});

		if (existing) {
			console.log(`⏭️  Ya existe: ${role.name} (${existing.id})`);
			continue;
		}

		const created = await prisma.role.create({
			data: {
				organizationId,
				name: role.name,
				normalizedName: normalizeName(role.name),
				code: toCode(role.name),
				description: role.description,
				isSystem: true,
			},
		});

		const scope = organizationId ? `organización ${organization.name}` : 'global';
		console.log(`✅ Creado: ${role.name} [${scope}] (${created.id})`);
	}

	console.log('\n✅ Roles base listos.');

	await grantAllPermissionsToAdmin();
	await grantStudentPermissions();
};

const grantStudentPermissions = async (): Promise<void> => {
	const grants = new Map([
		[
			'estudiante',
			[
				'tasks.create',
				'tasks.read',
				'tasks.update',
				'tasks.delete',
			],
		],
	]);

	for (const [roleCode, codes] of grants) {
		const roles = await prisma.role.findMany({
			where: { code: roleCode, deletedAt: null },
			select: { id: true },
		});
		const permissions = await prisma.permission.findMany({
			where: { code: { in: codes } },
			select: { id: true },
		});

		for (const role of roles) {
			for (const permission of permissions) {
				await prisma.rolePermission.upsert({
					where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
					create: { roleId: role.id, permissionId: permission.id },
					update: { granted: true },
				});
			}
		}
	}
	console.log('🔑 Permisos base asignados al rol Estudiante.');
};

/**
 * El rol Administrador administra la plataforma completa, así que recibe TODOS
 * los permisos del catálogo.
 */
const grantAllPermissionsToAdmin = async (): Promise<void> => {
	const admin = await prisma.role.findFirst({
		where: { code: 'administrador', deletedAt: null },
	});

	if (!admin) {
		console.log('⏭️  No existe el rol Administrador; nada que otorgar.');
		return;
	}

	const permissions = await prisma.permission.findMany({ select: { id: true, code: true } });

	if (permissions.length === 0) {
		console.log('⚠️  El catálogo de permisos está vacío. Corre el seed principal primero.');
		return;
	}

	for (const permission of permissions) {
		await prisma.rolePermission.upsert({
			where: { roleId_permissionId: { roleId: admin.id, permissionId: permission.id } },
			create: { roleId: admin.id, permissionId: permission.id },
			update: { granted: true },
		});
	}

	console.log(`🔑 Administrador ahora tiene ${permissions.length} permisos.`);
};

main()
	.catch((error: unknown) => {
		console.error('❌ Error en seed-dev:', error instanceof Error ? error.message : error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});