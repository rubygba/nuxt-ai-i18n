import { defineNuxtPlugin, useRuntimeConfig, useState, useCookie } from "#app";
import { computed } from "vue";
export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()?.public?.aiI18n || {};
  const defaultLocale = config.defaultLocale || "zh";
  const supportedLocales = config.locales || ["zh", "en", "ja", "ko"];
  const localeCookie = useCookie("ai-i18n-locale", { default: () => defaultLocale });
  const currentLocale = useState("ai-i18n-locale", () => localeCookie.value || defaultLocale);
  const dictionary = useState("ai-i18n-dict", () => ({}));
  const editMode = useState("ai-i18n-edit-mode", () => false);
  async function loadLocale(locale) {
    if (!locale || locale === defaultLocale) return;
    if (dictionary.value[locale]) return;
    try {
      const data = await $fetch(`/api/ai-i18n/locales?lang=${locale}`);
      if (data && typeof data === "object") {
        dictionary.value[locale] = data;
      }
    } catch {
      dictionary.value[locale] = {};
    }
  }
  function t(key) {
    const locale = currentLocale.value;
    if (!locale || locale === defaultLocale) return key;
    const dict = dictionary.value[locale];
    if (!dict) return key;
    return dict[key] ?? key;
  }
  async function setLocale(locale) {
    if (!supportedLocales.includes(locale)) return;
    await loadLocale(locale);
    currentLocale.value = locale;
    localeCookie.value = locale;
  }
  await loadLocale(currentLocale.value);
  return {
    provide: {
      t,
      locale: computed(() => currentLocale.value),
      setLocale,
      dictionary,
      editMode,
      supportedLocales,
      defaultLocale
    }
  };
});
