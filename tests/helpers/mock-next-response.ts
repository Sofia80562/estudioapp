import type { NextApiResponse } from 'next';

export type RecordedResponse = NextApiResponse & {
	statusCode: number; // Node.js exige que sea estrictamente 'number'
	body?: unknown;
	headers: Record<string, string | number | readonly string[] | undefined>;
	redirectDestination?: string;
};

export const createMockResponse = (): RecordedResponse => {
	// Se usa 'any' internamente para construir el mock sin pelear con 
	// las firmas de sobrecarga (overloads) de Node.js HTTP stream.
	const response: any = {
		headers: {},
		statusCode: 200,
		setHeader(name: string, value: string | number | readonly string[]) {
			this.headers[name] = value;
			return this;
		},
		getHeader(name: string) {
			return this.headers[name];
		},
		status(code: number) {
			this.statusCode = code;
			return this;
		},
		json(payload: unknown) {
			this.body = payload;
			return this;
		},
		end(payload?: unknown) {
			this.body = payload;
			return this;
		},
		redirect(statusOrUrl: number | string, url?: string) {
			if (typeof statusOrUrl === 'number') {
				this.statusCode = statusOrUrl;
				this.redirectDestination = url;
			} else {
				this.redirectDestination = statusOrUrl;
			}
			return this;
		},
	};

	// Se obliga a TypeScript a confiar en que esta simulación cumple
	return response as RecordedResponse;
};