/**
 * @lucasdssramos/test-trusted-publisher
 * A simple test package for verifying npm trusted publishing with semantic-release.
 */

function greet(name) {
  return `Hello, ${name}! This package was published using npm trusted publishing.`;
}

function getVersion() {
  const { version } = require('../package.json');
  return version;
}

module.exports = {
  greet,
  getVersion,
};
