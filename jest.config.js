module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['e2e-tests'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@root(.*)$': '<rootDir>/src$1',
    '^Components/(.*)$': '<rootDir>/client/components/$1',
    '^Utilities/(.*)$': '<rootDir>/client/util/$1',
  },
};
