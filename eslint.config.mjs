import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  ...compat.extends("next/core-web-vitals", "next/typescript", "plugin:prettier/recommended"),
  {
    rules: {
      "import/order": "warn",
      "no-console": "warn",
      "import/no-default-export": "off",
      "react/hook-use-state": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "prettier/prettier": [
        "warn",
        {
          plugins: [
            "prettier-plugin-tailwindcss",
            "prettier-plugin-classnames",
            "prettier-plugin-merge",
          ],
          semi: false,
          printWidth: 100,
          proseWrap: "always",
          trailingComma: "es5",
          quotes: true,
          quoteProps: "consistent",
        },
      ],
    },
  },
  {
    ignores: ["node_modules", "src/database/generated"],
  },
]
