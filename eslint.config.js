import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["build", "dist", "coverage"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat["recommended-latest"] ?? reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]", args: "none" }],
      // Legacy-code debt: these flag patterns that need per-component refactors
      // (state mutation, setState in effects, etc.). Downgraded to warnings so
      // they stay visible without blocking. Promote back to "error" as they are fixed.
      "react-hooks/immutability": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-refresh/only-export-components": "warn",
      "no-empty": "warn",
      "no-useless-assignment": "warn",
    },
  },
  {
    files: ["**/*.test.{js,jsx}", "src/setupTests.js"],
    languageOptions: { globals: { ...globals.browser, ...globals.vitest } },
  },
  {
    files: ["*.config.js"],
    languageOptions: { globals: { ...globals.node } },
  },
]);
