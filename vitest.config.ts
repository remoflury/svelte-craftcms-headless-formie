import { defineConfig } from 'vitest/config';
import path from 'path';
export default defineConfig({
	// ...
	// Tell Vitest to use the `browser` entry points in `package.json` files, even though it's running in Node
	resolve: process.env.VITEST
		? {
				conditions: ['browser'],
				alias: {
					$lib: path.resolve(__dirname, './src/lib')
				}
			}
		: undefined,
	test: {
		environment: 'happy-dom'
	}
});
