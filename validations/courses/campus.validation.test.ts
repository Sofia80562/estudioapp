import { describe, expect, it } from 'vitest';

import {
	createCampusSchema,
	campusCollectionParamsSchema,
	campusQuerySchema,
	updateCampusSchema,
} from './campus.validation';

describe('validación de campus y sedes (EstudioApp)', () => {
	it('acepta un payload de creación válido', () => {
		expect(createCampusSchema.safeParse({ name: 'Campus Central' }).success).toBe(true);
	});

	it('rechaza mass assignment en creación, incluyendo organizationId', () => {
		expect(
			createCampusSchema.safeParse({
				name: 'Campus Central',
				organizationId: '550e8400-e29b-41d4-a716-446655440000',
			}).success,
		).toBe(false);
	});

	it('exige expectedUpdatedAt en PATCH', () => {
		expect(updateCampusSchema.safeParse({ name: 'Campus Central' }).success).toBe(false);
		expect(
			updateCampusSchema.safeParse({
				name: 'Campus Central',
				expectedUpdatedAt: '2026-09-19T12:00:00.000Z',
			}).success,
		).toBe(true);
	});

	it('rechaza mass assignment en PATCH, incluyendo organizationId', () => {
		expect(
			updateCampusSchema.safeParse({
				expectedUpdatedAt: '2026-09-19T12:00:00.000Z',
				organizationId: '550e8400-e29b-41d4-a716-446655440000',
			}).success,
		).toBe(false);
	});

	it('acepta status ACTIVE/INACTIVE en PATCH', () => {
		expect(
			updateCampusSchema.safeParse({
				status: 'INACTIVE',
				expectedUpdatedAt: '2026-09-19T12:00:00.000Z',
			}).success,
		).toBe(true);
		expect(
			updateCampusSchema.safeParse({
				status: 'ACTIVE',
				expectedUpdatedAt: '2026-09-19T12:00:00.000Z',
			}).success,
		).toBe(true);
	});

	it('rechaza PENDING_APPROVAL u otros valores de status en PATCH', () => {
		expect(
			updateCampusSchema.safeParse({
				status: 'PENDING_APPROVAL',
				expectedUpdatedAt: '2026-09-19T12:00:00.000Z',
			}).success,
		).toBe(false);
	});

	it('campusQuerySchema y campusCollectionParamsSchema no son .strict(): comparten req.query en el listado', () => {
		const sharedQuery = {
			organizationId: '550e8400-e29b-41d4-a716-446655440000',
			page: '1',
			search: 'central',
		};
		expect(campusCollectionParamsSchema.safeParse(sharedQuery).success).toBe(true);
		expect(campusQuerySchema.safeParse(sharedQuery).success).toBe(true);
	});
});