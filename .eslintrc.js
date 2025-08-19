module.exports = {
  extends: [
    "expo", // Extends Expo's recommended ESLint configuration
    "prettier", // Integrates Prettier with ESLint to turn off conflicting rules
    "plugin:prettier/recommended", // Enables the Prettier ESLint plugin
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
};
