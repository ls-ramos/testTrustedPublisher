module.exports = {
  branches: [
    'main',
    {
      name: 'develop',
      prerelease: true,
    },
  ],
  // Explicitly configure verifyConditions to skip npm verification.
  // Per npm docs: "npm whoami will not reflect OIDC authentication status since
  // the authentication occurs only during the publish operation."
  verifyConditions: [
    '@semantic-release/changelog',
    '@semantic-release/github',
    '@semantic-release/git',
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          { type: 'docs', scope: 'README', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'style', release: 'patch' },
        ],
      },
    ],
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    // Use @semantic-release/exec to bump version in package.json (prepare step).
    // The actual npm publish is done in a separate workflow step because
    // npm's OIDC trusted publishing env vars are not available inside
    // semantic-release's exec child processes.
    [
      '@semantic-release/exec',
      {
        prepareCmd:
          'npm version ${nextRelease.version} --no-git-tag-version --allow-same-version',
        // Write the new version to a file so the workflow step can detect it
        publishCmd: 'echo "${nextRelease.version}" > .semantic-release-version',
      },
    ],
    '@semantic-release/github',
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'],
        message:
          // eslint-disable-next-line no-template-curly-in-string
          'chore(release): set `package.json` to ${nextRelease.version} [skip ci]',
      },
    ],
  ],
};
