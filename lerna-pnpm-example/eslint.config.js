// This is a workaround for https://github.com/eslint/eslint/issues/3458
//require('@rushstack/eslint-config/patch/modern-module-resolution');

// const eslint = require('@eslint/js');
// const tseslint = require('typescript-eslint');

// module.exports = tseslint.config(...eslint.configs.recommended, ...tseslint.configs.recommended, {
//   files: ['util/*.js', 'packages/**/*.js', 'packages/**/*.jsx', 'packages/**/*.ts', 'packages/**/*.tsx'],
//   extends: [
//     // Microsoft에서 생성/관리하는 eslint config
//     '@rushstack/eslint-config/profile/web-app',
//     //'@rushstack/eslint-config/mixins/react',
//     '@rushstack/eslint-config/mixins/friendly-locals',
//     'prettier', //
//   ],
//   languageOptions: {
//     parserOptions: {
//       project: ['./tsconfig.base.json', './pacakges/*/tsconfig.json'],
//       tsconfigRootDir: __dirname,
//     },
//   },
//   rules: {
//     // 필요한 커스텀 규칙 정의
//     'no-unused-vars': 'error',
//     'prefer-const': ['error'],
//   },
//   settings: {
//     // 공통으로 넣고 싶은 설정
//   },
// });

// TODO. typescirpt-eslint 다시 설정해야함!!!

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(...eslint.configs.recommended, ...tseslint.configs.recommended);
