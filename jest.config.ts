import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        module: 'commonjs',
        moduleResolution: 'node',
        esModuleInterop: true,
      },
      diagnostics: { ignoreCodes: ['TS151001'] },
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^sweph-wasm$': '<rootDir>/__tests__/__mocks__/sweph-wasm.ts',
  },
  setupFiles: ['<rootDir>/__tests__/setup.ts'],
  clearMocks: true,
}

export default config
