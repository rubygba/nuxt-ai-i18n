import { defineNuxtPlugin, useRuntimeConfig, useState, useCookie } from '#app'
import { ref, computed, h, defineComponent, onMounted } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public?.aiI18n || {}
  const locale = useCookie('ai-i18n-locale', { default: () => config.defaultLocale || 'zh' })
  const isEditing = useState('ai-i18n-editing', () => false)
  const dictionary = useState('ai-i18n-dictionary', () => ({}))

  // Fetch dictionary for current locale
  const fetchDictionary = async (l: string) => {
    try {
      const data = await $fetch(`/api/ai-i18n/locales?lang=${l}`)
      dictionary.value[l] = data || {}
    } catch (e) {
      console.error('Failed to fetch dictionary', e)
    }
  }

  // Initial fetch
  if (process.client) {
    onMounted(() => {
      fetchDictionary(locale.value)
    })
  }

  const t = (key: string) => {
    if (!locale.value || !dictionary.value) return key
    const currentDict = dictionary.value[locale.value] || {}
    const entry = currentDict[key]

    // If key is missing and we are in default locale, it's the key itself
    if (locale.value === (config.defaultLocale || 'zh')) {
      return entry?.value || key
    }

    // If missing in other locale, trigger auto-translation (client-side for demo)
    if (!entry && process.client && config.autoTranslate) {
      // Mark as translating to avoid duplicate calls
      if (!dictionary.value[locale.value]) dictionary.value[locale.value] = {}
      dictionary.value[locale.value][key] = { value: '...', meta: { status: 'translating' } }
      
      $fetch('/api/ai-i18n/translate', {
        method: 'POST',
        body: { key, targetLang: locale.value }
      }).then((res: any) => {
        dictionary.value[locale.value][key] = res
      })
    }

    return entry?.value || key
  }

  // Provide $t and other helpers
  return {
    provide: {
      t,
      setLocale: (l: string) => {
        locale.value = l
        fetchDictionary(l)
      },
      currentLocale: computed(() => locale.value),
      isEditing: computed(() => isEditing.value),
      toggleEditing: () => { isEditing.value = !isEditing.value },
      dictionary
    }
  }
})
