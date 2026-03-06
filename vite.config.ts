/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import type { UserConfig } from 'vite';
import type { InlineConfig } from 'vitest';

interface VitestConfigExport extends UserConfig {
  test?: InlineConfig;
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      api: path.resolve(__dirname, 'src/api'),
      app: path.resolve(__dirname, 'src/app'),
      components: path.resolve(__dirname, 'src/components'),
      constants: path.resolve(__dirname, 'src/constants'),
      hooks: path.resolve(__dirname, 'src/hooks'),
      pages: path.resolve(__dirname, 'src/pages'),
      server: path.resolve(__dirname, 'src/server'),
      store: path.resolve(__dirname, 'src/store'),
      theme: path.resolve(__dirname, 'src/theme'),
      utils: path.resolve(__dirname, 'src/utils'),
    },
  },
  plugins: [react()],
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        inlineDynamicImports: false,
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'react-redux',
            '@reduxjs/toolkit',
          ],
          ui: [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
          ],
          formik: ['formik'],
        },
      },
    },
    modulePreload: false,
  },
  server: {
    hmr: {
      protocol: 'ws',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:56357',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: ['**/index.ts', '**/types.ts'],
      all: true,
      reporter: ['json', 'lcov', 'text', 'clover', 'cobertura', 'html'],
    },
    deps: {
      inline: ['pvs-design-system'],
    },
  },
  publicDir: 'src/assets/',
} as unknown as VitestConfigExport);
