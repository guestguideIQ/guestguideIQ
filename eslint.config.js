// Lint scope is the marketing site only. This repo's root also holds the
// AI-DLC workspace (aidlc/, .claude/) and two sibling repositories checked out
// inside it (guestguideiq-app/, guestguideiq-frontend/), which carry their own
// tooling and CI — linting them from here would gate this repo on theirs.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/',
      '.astro/',
      'node_modules/',
      'aidlc/',
      '.claude/',
      'docs/',
      'guestguideiq-app/',
      'guestguideiq-frontend/',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
];
