module.exports = {
  plugins: [
    [
      require('postcss-preset-env'),
      {
        autoprefixer: {
          browserslits: ['> 1%'],
        },
      },
    ],
    require('rucksack-css'),
    require('postcss-import'),
    require('postcss-url'),
    [
      require.resolve('cssnano'),
      {
        preset: require.resolve('cssnano-preset-advanced'),
        autoprefixer: false,
      },
    ],
    require('tailwindcss'),
  ],
}
