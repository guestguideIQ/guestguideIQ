// Lint config for the marketing site, kept in src/ rather than the repo root ON PURPOSE.
//
// This repo's root is also the AI-DLC workspace, and the backend (guestguideiq-app) and frontend
// (guestguideiq-frontend) repositories are checked out INSIDE it. The backend runs ESLint 8, which
// searches upward from its own folder for a flat config (eslint.config.js/.mjs/.cjs) and, on
// finding one here at the root, switched to flat-config mode and reported every backend file as
// ignored. ESLint 10 (used here) looks up config from each linted file's own folder, so a config
// in src/ covers src/ and is invisible to anything checked out beside it.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
];
