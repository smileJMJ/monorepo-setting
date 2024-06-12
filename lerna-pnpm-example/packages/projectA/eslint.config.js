const tseslint = require('typescript-eslint');
const base = require('../../eslint.config');

// module.exports = {
//   ...base,
//   ...{
//     plugins: ['react'],
//     extends: ['@rushstack/eslint-config/mixins/react', 'plugin:react/recommended'],
//   },
// };

module.exports = tseslint.config(
  ...base,
  ...{
    plugins: ['react'],
    extends: ['@rushstack/eslint-config/mixins/react', 'plugin:react/recommended'],
  },
);
