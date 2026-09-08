module.exports = {
 root: true,
 env: { browser: true, es2020: true, node: true },
 extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
 ignorePatterns: ['dist', 'node_modules', 'vite.config.ts'],
 parser: '@typescript-eslint/parser',
 plugins: ['react-refresh'],
};
