import { defineNuxtModule, createResolver, addPlugin, addComponentsDir, addImportsDir, addServerHandler } from '@nuxt/kit';

const module$1 = defineNuxtModule({
  meta: {
    name: "nuxt-ai-i18n",
    configKey: "aiI18n"
  },
  defaults: {
    locales: ["en"],
    defaultLocale: "zh",
    aiModel: "gpt-4.1-mini",
    autoTranslate: true
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const runtimeDir = resolver.resolve("./runtime");
    addPlugin(resolver.resolve(runtimeDir, "plugins/i18n"));
    addComponentsDir({
      path: resolver.resolve(runtimeDir, "components"),
      prefix: "AiI18n"
    });
    addImportsDir(resolver.resolve(runtimeDir, "composables"));
    addServerHandler({
      route: "/api/ai-i18n/translate",
      handler: resolver.resolve(runtimeDir, "server/api/translate")
    });
    addServerHandler({
      route: "/api/ai-i18n/update",
      handler: resolver.resolve(runtimeDir, "server/api/update")
    });
    addServerHandler({
      route: "/api/ai-i18n/locales",
      handler: resolver.resolve(runtimeDir, "server/api/locales")
    });
    nuxt.options.runtimeConfig.public.aiI18n = options;
  }
});

export { module$1 as default };
