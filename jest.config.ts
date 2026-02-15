import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  moduleNameMapper: {
    '@environments/(.*)': '<rootDir>/src/environments/$1',
    '@home/(.*)': '<rootDir>/src/app/components/home/$1',
    '@services/(.*)': '<rootDir>/src/app/services/$1',
    '@models/(.*)': '<rootDir>/src/models/$1',
    '@shared/(.*)': '<rootDir>/src/app/shared/$1',
  }
};

export default config;