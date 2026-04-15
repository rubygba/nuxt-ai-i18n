import { defineNuxtPlugin, useRuntimeConfig, useState, useCookie } from '#app'
import { computed } from 'vue'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = (useRuntimeConfig()?.public?.aiI18n || {}) as {
    defaultLocale?: string
    locales?: string[]
  }

  const defaultLocale = config.defaultLocale || 'zh'
  const supportedLocales = config.locales || ['zh', 'en', 'ja', 'ko']

  // Persist locale selection in a cookie
  const localeCookie = useCookie<string>('ai-i18n-locale', { default: () => defaultLocale })
  const currentLocale = useState<string>('ai-i18n-locale', () => localeCookie.value || defaultLocale)

  // Dictionary: { [locale]: { [key]: string } }
  // This is populated from pre-generated JSON files via the /api/ai-i18n/locales endpoint.
  // No runtime AI calls are made here — translation happens at dev/build time via the CLI.
  const dictionary = useState<Record<string, Record<string, string>>>('ai-i18n-dict', () => ({}))

  // Visual editor mode
  const editMode = useState<boolean>('ai-i18n-edit-mode', () => false)

  // Load dictionary for a given locale from the pre-generated JSON files
  async function loadLocale(locale: string) {
    if (!locale || locale === defaultLocale) return
    if (dictionary.value[locale]) return // already loaded

    try {
      const data = await $fetch<Record<string, string>>(`/api/ai-i18n/locales?lang=${locale}`)
      if (data && typeof data === 'object') {
        dictionary.value[locale] = data
      }
    }
    catch {
      // Locale file not found or not yet generated — gracefully fall back to source key
      dictionary.value[locale] = {}
    }
  }

  // Translate a key using the loaded dictionary
  function t(key: string): string {
    const locale = currentLocale.value
    if (!locale || locale === defaultLocale) return key
    const dict = dictionary.value[locale]
    if (!dict) return key
    return dict[key] ?? key
  }

  // Switch locale and load its dictionary
  async function setLocale(locale: string) {
    if (!supportedLocales.includes(locale)) return
    await loadLocale(locale)
    currentLocale.value = locale
    localeCookie.value = locale
  }

  // Preload the initial locale on plugin init (SSR + client)
  await loadLocale(currentLocale.value)

  return {
    provide: {
      t,
      locale: computed(() => currentLocale.value),
      setLocale,
      dictionary,
      editMode,
      supportedLocales,
      defaultLocale,
    },
  }
})
