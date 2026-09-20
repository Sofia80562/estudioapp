import { z } from 'zod';

import { registry } from '@/documentation/registry';
import { ErrorResponseSchema } from '@/documentation/responses/common';

const RoleSchema = z.object({
	id: z.string().uuid(),
	code: z.string(),
	name: z.string(),
});

const PermissionSchema = z.object({
	id: z.string().uuid(),
	code: z.string(),
});

export const SessionResponseSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	name: z.string(),
	roles: z.array(RoleSchema),
	permissions: z.array(PermissionSchema),
});

const MobileLoginRequestSchema = z.object({
	username: z.string(),
	password: z.string(),
});

const MobileLoginResponseSchema = z.object({
	sessionToken: z.string(),
	expiresAt: z.string(),
});

const RegisterRequestSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	firstName: z.string().min(1).max(100),
	lastName: z.string().min(1).max(100),
	accountType: z.enum(['estudiante', 'profesor']),
});

const RegisterResponseSchema = z.object({
	accountType: z.enum(['estudiante', 'profesor']),
	user: z.object({
		id: z.string().uuid(),
		email: z.string().email(),
		firstName: z.string(),
		lastName: z.string(),
	}),
});

registry.register('SessionResponse', SessionResponseSchema);
registry.register('MobileLoginRequest', MobileLoginRequestSchema);
registry.register('MobileLoginResponse', MobileLoginResponseSchema);
registry.register('RegisterRequest', RegisterRequestSchema);
registry.register('RegisterResponse', RegisterResponseSchema);
registry.register('ErrorResponse', ErrorResponseSchema);

registry.registerComponent('securitySchemes', 'cookieAuth', {
	type: 'apiKey',
	in: 'cookie',
	name: 'estudioapp_session', // 👈 Adaptado
});

registry.registerComponent('securitySchemes', 'bearerAuth', {
	type: 'http',
	scheme: 'bearer',
	description: 'Usado por la aplicación móvil de EstudioApp.',
});

const errorResponses = {
	400: {
		description: 'Solicitud inválida',
		content: {
			'application/json': {
				schema: ErrorResponseSchema,
			},
		},
	},
	401: {
		description: 'No autenticado',
		content: {
			'application/json': {
				schema: ErrorResponseSchema,
			},
		},
	},
};

const loginDescription = `Inicia el flujo de autenticación para EstudioApp.`;

const callbackDescription = `Procesa el retorno del proveedor de autenticación y crea la sesión interna de EstudioApp.`;

const sessionDescription = `Devuelve el usuario autenticado asociado a la cookie de sesión activa en EstudioApp.`;

const refreshDescription = `Renueva el access token cuando está próximo a expirar.`;

const logoutDescription = `Cierra la sesión del usuario y elimina la cookie de autenticación.`;

registry.registerPath({
	method: 'get',
	path: '/auth/login',
	tags: ['Auth'],
	security: [],
	description: loginDescription,
	responses: {
		302: {
			description: 'Redirección al proveedor de autenticación',
		},
		...errorResponses,
	},
});

registry.registerPath({
	method: 'get',
	path: '/auth/callback',
	tags: ['Auth'],
	security: [],
	description: callbackDescription,
	responses: {
		302: {
			description: 'Redirección al cliente con sesión creada',
		},
		...errorResponses,
	},
});

registry.registerPath({
	method: 'get',
	path: '/auth/session',
	tags: ['Auth'],
	security: [{ cookieAuth: [] }],
	description: sessionDescription,
	responses: {
		200: {
			description: 'Sesión activa',
			content: {
				'application/json': {
					schema: z.object({
						data: SessionResponseSchema,
					}),
				},
			},
		},
		401: errorResponses[401],
	},
});

registry.registerPath({
	method: 'post',
	path: '/auth/refresh',
	tags: ['Auth'],
	security: [{ cookieAuth: [] }],
	description: refreshDescription,
	responses: {
		204: {
			description: 'Sesión renovada',
		},
		401: errorResponses[401],
		400: errorResponses[400],
	},
});

registry.registerPath({
	method: 'post',
	path: '/auth/logout',
	tags: ['Auth'],
	security: [{ cookieAuth: [] }],
	description: logoutDescription,
	responses: {
		204: {
			description: 'Sesión eliminada',
		},
		401: errorResponses[401],
	},
});

const mobileLoginDescription = `Inicia sesión con usuario y contraseña desde la app móvil de EstudioApp.`;

registry.registerPath({
	method: 'post',
	path: '/auth/mobile/login',
	tags: ['Auth'],
	security: [],
	description: mobileLoginDescription,
	request: {
		body: {
			content: {
				'application/json': {
					schema: MobileLoginRequestSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: 'Sesión creada',
			content: {
				'application/json': {
					schema: z.object({
						data: MobileLoginResponseSchema,
					}),
				},
			},
		},
		400: errorResponses[400],
		401: errorResponses[401],
	},
});

const registerDescription = `Registro público de nuevos usuarios en EstudioApp (estudiantes o profesores).`;

registry.registerPath({
	method: 'post',
	path: '/auth/register',
	tags: ['Auth'],
	security: [],
	description: registerDescription,
	request: {
		body: {
			content: {
				'application/json': {
					schema: RegisterRequestSchema,
					examples: {
						estudiante: {
							value: {
								email: 'estudiante@ejemplo.com',
								password: 'contraseñaSegura123',
								firstName: 'Sofía',
								lastName: 'Beltrán',
								accountType: 'estudiante',
							},
						},
					},
				},
			},
		},
	},
	responses: {
		201: {
			description: 'Cuenta creada',
			content: {
				'application/json': {
					schema: z.object({ data: RegisterResponseSchema }),
				},
			},
		},
		400: errorResponses[400],
		409: {
			description: 'El correo ya existe en el sistema',
			content: { 'application/json': { schema: ErrorResponseSchema } },
		},
		422: {
			description: 'La contraseña no cumple con los requisitos mínimos',
			content: { 'application/json': { schema: ErrorResponseSchema } },
		},
		429: {
			description: 'Límite de intentos de registro excedido',
			content: { 'application/json': { schema: ErrorResponseSchema} },
		},
	},
});