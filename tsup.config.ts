import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['cjs'],
  target: 'es2022',
  clean: true,
  shims: false,
  dts: false,
  external: ['@prisma/client', '.prisma/client'], // Evita que o Prisma seja bundleado
})
