import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [

  {
    ignores: ["node_modules", "public", "tests"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-console": "off",
      "indent": ["error", 2],
      "quotes": ["error", "double"],
      "semi": ["error", "always"]
    }
  }
];