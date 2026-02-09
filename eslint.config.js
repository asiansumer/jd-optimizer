/** @type {import} */
import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  {
    ignores: [
      "**/.next/",
      "**/node_modules/",
      "**/dist/",
      "**/.turbo/",
      "**/coverage/",
    ],
  },
  FlatCompat({
    extends: ["next/core-web-vitals", "next/typescript"],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  }),
];
