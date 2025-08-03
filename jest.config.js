import nextJest from 'next/jest.js'; // Note the ".js" extension

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/db/(.*)$': '<rootDir>/db/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};

export default createJestConfig(customJestConfig);