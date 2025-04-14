
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    minify: false, // Disable minification
    lib: {
      entry: 'src/index.ts',
      name: 'prefetchjs',
      fileName: 'prefetchjs',
      formats: ['es', 'cjs', 'umd']
    }
  },
  test: {
    environment: "happy-dom", // 👈 Ensures a browser-like environment
    setupFiles: "./tests/vitest.setup.ts", // 👈 Runs the setup before tests
    globals: true,
  },
  plugins: [dts()]
});
