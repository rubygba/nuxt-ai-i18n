// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
  modules: [
    '../packages/nuxt-ai-i18n'
  ],
  aiI18n: {
    locales: ['en', 'ja', 'ko'],
    defaultLocale: 'zh',
    aiModel: 'gpt-4.1-mini',
    autoTranslate: true
  }
})
