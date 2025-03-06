const js = require("@eslint/js");
const next = require("@next/eslint-plugin-next");
const react = require("eslint-plugin-react");

/** @type {import("eslint").FlatConfig[]} */
module.exports = [
  js.configs.recommended,
  next.configs["core-web-vitals"],
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    env: {
      es6: true,
      node: true,
    },
    plugins: {
      react,
    },
    rules: {
      "react/prop-types": "off",
      "no-unused-vars": "warn",
    },
  },
];
