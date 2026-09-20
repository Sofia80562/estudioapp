import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ACCESS_CALL_PATTERN = /\baccess\(([^)]*)\)/gu;
const STRING_LITERAL_PATTERN = /^['"]([a-zA-Z0-9_.-]+)['"]$/u;

export type RequiredPermissionCodes = {
	requiredCodes: Set<string>;
	unrecognizedCalls: string[];
};

const collectApiFiles = (dir: string): string[] => {
	const entries = readdirSync(dir, { withFileTypes: true });

	return entries.flatMap(entry => {
		const fullPath = join(dir, entry.name);
		return entry.isDirectory()
			? collectApiFiles(fullPath)
			: entry.name.endsWith('.ts')
				? [fullPath]
				: [];
	});
};

export const extractRequiredPermissionCodes = (pagesApiDir: string): RequiredPermissionCodes => {
	const requiredCodes = new Set<string>();
	const unrecognizedCalls: string[] = [];

	for (const filePath of collectApiFiles(pagesApiDir)) {
		const content = readFileSync(filePath, 'utf8');

		for (const match of content.matchAll(ACCESS_CALL_PATTERN)) {
			const rawArguments = match[1] ?? '';
			const args = rawArguments
				.split(',')
				.map(arg => arg.trim())
				.filter(Boolean);

			for (const arg of args) {
				const literalMatch = STRING_LITERAL_PATTERN.exec(arg);

				if (literalMatch) {
					requiredCodes.add(literalMatch[1]);
				} else {
					unrecognizedCalls.push(`${filePath}: access(${rawArguments})`);
				}
			}
		}
	}

	return { requiredCodes, unrecognizedCalls };
};

export type PermissionCatalogDiff = {
	missingCodes: string[];
	orphanCodes: string[];
};

export const diffPermissionCatalog = (
	requiredCodes: Set<string>,
	catalogCodes: Set<string>,
): PermissionCatalogDiff => ({
	missingCodes: [...requiredCodes].filter(code => !catalogCodes.has(code)),
	orphanCodes: [...catalogCodes].filter(code => !requiredCodes.has(code)),
});