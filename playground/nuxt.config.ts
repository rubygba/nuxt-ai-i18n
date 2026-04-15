// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '../packages/nuxt-ai-i18n/src/module.ts'
  ],
  aiI18n: {
    locales: ['en', 'ja', 'ko'],
    defaultLocale: 'zh',
    aiModel: 'gpt-4.1-mini',
    autoTranslate: true
  }
})
