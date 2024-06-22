module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@root(.*)$': '<rootDir>/src$1',
    '^Components/(.*)$': '<rootDir>/client/components/$1',
    '^Utilities/(.*)$': '<rootDir>/client/util/$1',
  },
};
