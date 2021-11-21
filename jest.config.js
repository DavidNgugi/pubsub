
const { defaults } = require('jest-config');

module.exports = {
  verbose: true,
  testRegex: "(/tests/.*|(\\.|/)(test))\\.(js)?$",
  moduleFileExtensions: [...defaults.moduleFileExtensions],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
    "\\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$": "<rootDir>/__mocks__/fileMock.js",
  },
  clearMocks: true,
  testPathIgnorePatterns: [
    "node_modules",
    "dist",
    "build",
  ],
  collectCoverage: false,
  // collectCoverageFrom: [
  //   "src/**/*.{js,jsx}",
  //   "server/**/*.{js}",
  // ],
  // coveragePathIgnorePatterns: [
  //   "node_modules",
  //   "dist",
  //   "build",
  // ],
  // coverageDirectory: "coverage",
  // coverageReporters: [
  //   "json",
  //   "lcov",
  //   "text",
  //   "html",
  //   "text-summary",
  // ],
  testURL: "http://localhost:8000/",
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"]
}

