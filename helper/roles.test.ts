export const normalizeRoleName = (name: string): string =>
    name.trim().replace(/\s+/g, ' ');

export const normalizeRoleIdentity = (name: string): string =>
    normalizeRoleName(name).toLowerCase();

export const createRoleCode = (name: string): string =>
    normalizeRoleIdentity(name)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');