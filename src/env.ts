import { defineEnvVars } from '@sveltejs/kit/env';

const required = (value: string | undefined): string => {
	if (!value) throw new Error('Missing required environment variable (see .env.example)');
	return value;
};

export const variables = defineEnvVars({
	STORE_HANDLE: { schema: required },
	STORE_ORIGIN: { schema: required },
	PUBLIC_STORE_HANDLE: { public: true, schema: required },
	PUBLIC_STORE_ORIGIN: { public: true, schema: required }
});
