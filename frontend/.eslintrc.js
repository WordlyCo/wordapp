module.exports = {
  extends: ['expo', 'plugin:import/errors', 'plugin:import/warnings', 'plugin:import/typescript'],
  plugins: ['import'],
  ignorePatterns: ['/dist/*'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
        alwaysTryTypes: true,
        extensions: ['.ts', '.tsx', '.js', '.jsx']
      },
      node: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        moduleDirectory: ['.', 'node_modules']
      },
      'babel-module': {}
    },
  },
  rules: {
    'import/no-unresolved': 'error',
    'import/default': 'off',
    'import/namespace': 'off',
    'react-hooks/exhaustive-deps': 'off',
  },
};
