// eslint.config.mjs
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

// OPTIONAL: Prettier integration (remove if you don't want it)
import eslintConfigPrettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Global ignores
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "package-lock.json",
      "pnpm-lock.yaml",
      "yarn.lock",
      "next-env.d.ts",
      "*.config.*",
      ".env",
      ".env.*",
    ],
  },

  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
  }),

  eslintConfigPrettier,
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
