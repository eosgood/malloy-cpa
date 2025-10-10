import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import eslintConfigPrettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Global ignores (won’t be linted at all)
  {
    ignores: [
      // deps & builds
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      // lock/config/generated files
      "package-lock.json",
      "pnpm-lock.yaml",
      "yarn.lock",
      "next-env.d.ts",
      "*.config.*",
      // env files
      ".env",
      ".env.*",
      // misc
      "coverage/**",
      "storybook-static/**",
    ],
  },

  // Next.js + TS rules via compat
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Turn off rules that conflict with Prettier
  eslintConfigPrettier,

  // Surface Prettier as lint errors
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": [
        "error",
        {
          semi: true,
          singleQuote: true,
          trailingComma: "es5",
          tabWidth: 2,
          printWidth: 100,
          bracketSpacing: true,
          arrowParens: "always",
        },
      ],
    },
  },
];
