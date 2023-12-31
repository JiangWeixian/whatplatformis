const { aiou } = require('@aiou/eslint-config')

module.exports = aiou({ ssr: false }, [
  {
    ignores: [
      '**/example/**',
      '**/fixtures/**',
    ],
  },
  {
    files: ['**/**'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
])
