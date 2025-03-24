import eslintPluginReact from "eslint-plugin-react";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: eslintPluginReact
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "no-unused-vars": "warn", // Make sure we don't have unused vars
      "eqeqeq": "error", // Enforce strict equality (=== and !==)
      "default-case": "error", // Require default case in switch statements

    },
    settings: {
      react: {
        version: "detect" 
      }
    }
  }
];
