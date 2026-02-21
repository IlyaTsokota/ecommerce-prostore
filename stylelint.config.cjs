/** @type {import('stylelint').Config} */
module.exports = {
    plugins: ["@stylistic/stylelint-plugin"],
    extends: [
        "stylelint-config-standard",
        "stylelint-config-tailwindcss",
        "stylelint-config-recess-order",
    ],
    ignoreFiles: ["**/.next/**", "**/out/**", "**/node_modules/**"],
    rules: {
        "@stylistic/indentation": 4,
        "at-rule-no-unknown": [
            true,
            {
                ignoreAtRules: [
                    "tailwind",
                    "apply",
                    "layer",
                    "variants",
                    "responsive",
                    "screen",
                    "config",
                    "theme",
                ],
            },
        ],
    },
    overrides: [
        {
            files: ["**/*.{scss,sass}"],
            customSyntax: "postcss-scss",
            extends: ["stylelint-config-standard-scss", "stylelint-config-recess-order"],
        },
    ],
};
