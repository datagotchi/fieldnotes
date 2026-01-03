import globals from "globals";

import jsPlugin from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

import reactPlugin from "eslint-plugin-react";
// import reactHooksPlugin from "eslint-plugin-react-hooks";

// import tseslint from "typescript-eslint";
// import typescriptParser from "@typescript-eslint/parser";

import jestPlugin from "eslint-plugin-jest";

// import nextPlugin from "@next/eslint-plugin-next";

// import playwrightPlugin from "eslint-plugin-playwright";

export default [
  // Global ignores MUST be the first object and have ONLY an 'ignores' key
  {
    ignores: [
      "**/node_modules/",
      "**/.next/",
      "**/coverage/",
      "**/src/scripts/",
      "ecosystem.config.cjs",
      "next.config.js",
      "public/dist/",
    ],
  },
  // global recommended configs
  // jsPlugin.configs.recommended,
  // eslintPluginPrettierRecommended,
  // ...tseslint.configs.recommended,
  // global settings
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // global files: all js files
  {
    files: ["**/*.{js,jsx}"],
  },
  // global ignores
  // {
  //   ignores: [
  //     "node_modules/",
  //     ".next/",
  //     "ecosystem.config.cjs",
  //     "next.config.js",
  //     "coverage/",
  //     "src/scripts/",
  //   ],
  // },
  // global plugins
  {
    plugins: {
      js: jsPlugin,
      react: reactPlugin,
      // "@typescript-eslint": tseslint.plugin,
      // "react-hooks": reactHooksPlugin,
    },
  },
  // global language options
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      // parser: typescriptParser,
      parserOptions: {
        // project: "./tsconfig.json",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  // global rules
  {
    rules: {
      ...jsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.flat.recommended.rules,
      // ...reactHooksPlugin.configs.recommended.rules,
      // ...tseslint.configs.recommended.rules,

      "no-unused-vars": "off",
      "no-undef": "error",

      "react/prop-types": "off", // Common fix for JSX

      // "@typescript-eslint/no-unused-vars": "warn",
      // "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  // playwright e2e test config
  // {
  //   files: ["src/e2e-tests/*.spec.ts"],
  //   plugins: {
  //     playwright: playwrightPlugin,
  //   },
  //   rules: {
  //     ...playwrightPlugin.configs["flat/recommended"].rules,

  //     "@typescript-eslint/no-floating-promises": "error", // bc playwright's missing await rule doesn't work on everything

  //     "playwright/no-standalone-expect": "off", // does not support additionalTestBlockFunctions
  //     "playwright/expect-expect": "off", // does not support assertions in called functions
  //   },
  // },
  // jest unit test config
  {
    // ...reactPlugin.configs.flat.recommended,
    // ...jestPlugin.configs["flat/recommended"],
    files: ["**/*.test.{js,jsx}"],
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...jestPlugin.configs["flat/recommended"].rules,

      "react/prop-types": "error",
      "react/display-name": "off",

      // "@typescript-eslint/no-explicit-any": "off",
    },
    languageOptions: {
      globals: { ...globals.jest },
    },
  },
  // next app config
  // {
  //   ...reactPlugin.configs.flat.recommended,
  //   ignores: ["**/*.test.{ts,tsx}"],
  //   plugins: {
  //     react: reactPlugin,
  //     "react-hooks": reactHooksPlugin,
  //     "@next/next": nextPlugin,
  //   },
  //   rules: {
  //     ...reactPlugin.configs.recommended.rules,
  //     ...reactHooksPlugin.configs.recommended.rules,
  //     ...nextPlugin.configs.recommended.rules,

  //     "react/prop-types": "error",
  //     "react/display-name": "off",

  //     "react-hooks/rules-of-hooks": "error",
  //     "react-hooks/exhaustive-deps": "warn",

  //     "@next/next/no-img-element": "error",
  //   },
  // },
  eslintPluginPrettierRecommended,
];
