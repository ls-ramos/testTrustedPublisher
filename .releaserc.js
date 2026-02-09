module.exports = {
  branches: [
    'main',
    {
      name: 'develop',
      prerelease: true,
    },
  ],
  // Explicitly configure verifyConditions to skip npm verification.
  // npm OIDC/trusted publishing doesn't support 'npm whoami' verification
  // because there is no traditional npm token — the OIDC token is obtained
  // at publish time by the npm CLI itself.
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
    // Use @semantic-release/exec instead of @semantic-release/npm
    // because the npm plugin runs 'npm whoami' during prepare/publish
    // which fails with trusted publishing (no NPM_TOKEN available).
    // The npm CLI handles OIDC token exchange automatically during 'npm publish --provenance'.
    [
      '@semantic-release/exec',
      {
        prepareCmd:
          'npm version ${nextRelease.version} --no-git-tag-version --allow-same-version',
        publishCmd: 'npm publish --provenance --access public',
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
