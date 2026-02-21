import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import prettierPlugin from "eslint-plugin-prettier";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    prettier,
    {
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            "react-hooks/set-state-in-effect": "off",
            "prettier/prettier": [
                "error",
                {
                    singleQuote: false,
                    useTabs: false,
                    semi: true,
                    trailingComma: "all",
                    bracketSpacing: true,
                    printWidth: 100,
                    endOfLine: "auto",
                    tabWidth: 4,
                },
            ],
        },
    },
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),
]);

export default eslintConfig;
