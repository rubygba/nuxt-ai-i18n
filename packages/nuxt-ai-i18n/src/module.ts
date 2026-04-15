import { defineNuxtModule, addPlugin, createResolver, addServerHandler, addComponentsDir, addImportsDir } from '@nuxt/kit'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'

export interface ModuleOptions {
  locales: string[]
  defaultLocale: string
  aiApiKey?: string
  aiBaseUrl?: string
  aiModel?: string
  autoTranslate?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-ai-i18n',
    configKey: 'aiI18n'
  },
  defaults: {
    locales: ['en'],
    defaultLocale: 'zh',
    aiModel: 'gpt-4.1-mini',
    autoTranslate: true
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const runtimeDir = resolver.resolve('./runtime')

    // 1. Add plugins
    addPlugin(resolver.resolve(runtimeDir, 'plugins/i18n'))

    // 2. Add components
    addComponentsDir({
      path: resolver.resolve(runtimeDir, 'components'),
      prefix: 'AiI18n'
    })

    // 3. Add composables
    addImportsDir(resolver.resolve(runtimeDir, 'composables'))

    // 4. Add server API for translation and saving
    addServerHandler({
      route: '/api/ai-i18n/translate',
      handler: resolver.resolve(runtimeDir, 'server/api/translate')
    })
    addServerHandler({
      route: '/api/ai-i18n/update',
      handler: resolver.resolve(runtimeDir, 'server/api/update')
    })
    addServerHandler({
      route: '/api/ai-i18n/locales',
      handler: resolver.resolve(runtimeDir, 'server/api/locales')
    })

    // 5. Vite plugin for AST extraction (optional, but we can do it via runtime proxy for simplicity in demo)
    // For this demo, we'll use a runtime approach where $t handles missing keys by calling the translation API.

    // Inject options to runtime
    nuxt.options.runtimeConfig.public.aiI18n = options
  }
})
