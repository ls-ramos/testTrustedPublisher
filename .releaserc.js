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
  // @semantic-release/npm runs 'npm whoami' in both verifyConditions and prepare,
  // so we replace it entirely with @semantic-release/exec.
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
    // Use @semantic-release/exec instead of @semantic-release/npm because:
    // 1. @semantic-release/npm runs 'npm whoami' during prepare/publish which fails
    //    with trusted publishing (OIDC auth only works during 'npm publish').
    // 2. npm 11.5.1+ automatically handles OIDC auth and provenance when running
    //    'npm publish' — no --provenance flag needed.
    [
      '@semantic-release/exec',
      {
        prepareCmd:
          'npm version ${nextRelease.version} --no-git-tag-version --allow-same-version',
        publishCmd: 'npm publish --access public',
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
