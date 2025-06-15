import { describe, expect, test } from 'vitest';
import { getFieldFragments } from './queryUtils.js';

describe('queryUtils', () => {
	test.concurrent('query fragment builder', () => {
		const fragment = getFieldFragments(['Address', 'Agree']);

		expect(fragment).not.toBe('');
	});
});
