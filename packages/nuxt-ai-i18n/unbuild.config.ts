import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/module',
    './src/cli',
  ],
  declaration: true,
  clean: true,
  failOnWarn: false,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
  externals: [
    '#app',
    '#imports',
    '#vue-router',
    '@nuxt/kit',
    'h3',
    'vue',
    'openai',
    'commander',
    'glob',
  ],
})
