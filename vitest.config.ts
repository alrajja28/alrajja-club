import {defineConfig} from 'vitest/config';
export default defineConfig({test:{include:['convex/**/*.test.ts','src/pwa/**/*.test.ts'],environment:'node'}});
