# AI Iteration Guide — nuxt-ai-i18n

> This document is written for AI agents (Cursor, Claude Code, GPT-4, etc.) and human developers who need to understand, maintain, or extend this project. Read this before making any changes.

---

## 1. Project Vision

**"Build-time AI, Human-verified, Zero runtime overhead."**

The key insight: **frontend translations are static**. They only need to be generated once — at development or release time — not on every user request. This eliminates runtime LLM latency and API costs entirely.

### Design Principles

1. **Build-time AI, not runtime AI.** The CLI generates locale JSON files. The runtime only reads them.
2. **Source key = natural language.** Developers write `$t('用户仪表盘')` — the Chinese text IS the key. No separate key management.
3. **Incremental translation.** The CLI only translates keys missing from locale files. Already-translated keys are never re-translated unless `--force` is used.
4. **Human-in-the-loop.** The Visual Editor lets translators click any text on the page and fix it directly. Fixes are saved back to locale JSON files.
5. **Zero production AI dependencies.** The production build only needs pre-generated JSON files. No API key, no network calls at runtime.

---

## 2. Architecture: Before vs After

### Before (v0.x — Runtime AI, DEPRECATED)
```
User switches language → Plugin detects missing key → Calls /api/ai-i18n/translate → LLM translates → Shows result
Problems: latency, API cost, non-deterministic, requires API key in production
```

### After (v1.0+ — Build-time AI, CURRENT)
```
Developer writes code → Runs CLI once → AI translates all keys → Saves to locales/*.json
Runtime: Plugin reads pre-generated JSON → Zero LLM calls → Zero latency
```

---

## 3. Repository Structure

```
nuxt-ai-i18n/
├── packages/
│   └── nuxt-ai-i18n/              # The Nuxt module package
│       ├── src/
│       │   ├── module.ts           # Nuxt module entry point
│       │   ├── cli.ts              # CLI tool (ai-i18n sync / list)
│       │   └── runtime/
│       │       ├── plugins/
│       │       │   └── i18n.ts     # Runtime plugin (loads locale JSON, provides $t)
│       │       ├── components/
│       │       │   ├── T.vue       # <AiI18nT tKey="..." /> component
│       │       │   └── VisualEditor.vue  # Floating editor panel
│       │       └── server/api/
│       │           ├── locales.ts  # GET /api/ai-i18n/locales?lang=en
│       │           ├── update.ts   # POST /api/ai-i18n/update
│       │           └── translate.ts # (legacy, kept for compatibility)
│       ├── dist/                   # Built output
│       ├── build.config.ts         # unbuild configuration (failOnWarn: false)
│       ├── tsconfig.json           # Module TypeScript config
│       └── tsconfig.cli.json       # CLI TypeScript config
├── playground/                     # Nuxt 3 demo application
│   ├── app.vue                     # Main demo page
│   ├── locales/                    # Pre-generated locale JSON files
│   │   ├── en.json
│   │   ├── ja.json
│   │   └── ko.json
│   ├── nuxt.config.ts
│   └── package.json
├── README.md                       # User-facing documentation
└── AI_ITERATION_GUIDE.md           # This file
```

---

## 4. Data Flow

### 4.1 Build-time (CLI)

```
Developer writes:  $t('用户仪表盘')  or  <AiI18nT tKey="用户仪表盘" />
       │
       ▼
CLI: npx ai-i18n sync
       │
       ├─ Scans all .vue/.ts/.tsx/.js/.jsx files
       ├─ Extracts keys via regex:
       │    /\$t\(['"`]([^'"`]+)['"`]\)/g
       │    /<AiI18nT[^>]+tKey=['"`]([^'"`]+)['"`]/g
       │
       ├─ For each target locale (en, ja, ko):
       │    ├─ Load existing locales/en.json
       │    ├─ Find keys missing from the file
       │    ├─ Batch translate via OpenAI (up to 50 keys/request)
       │    │    Uses response_format: { type: 'json_object' } for reliability
       │    └─ Write updated locales/en.json (plain string values)
       │
       └─ Output: locales/en.json, locales/ja.json, locales/ko.json
```

### 4.2 Runtime (Nuxt)

```
User visits page (locale = 'en')
       │
       ▼
i18n.ts plugin runs (server + client)
       │
       ├─ Reads cookie 'ai-i18n-locale' (default: 'zh')
       ├─ Calls loadLocale('en')
       │    └─ GET /api/ai-i18n/locales?lang=en
       │         └─ Reads locales/en.json from process.cwd()
       │              └─ Returns { "用户仪表盘": "User Dashboard", ... }
       │
       ├─ Stores in useState('ai-i18n-dict')
       └─ Provides: $t, $locale, $setLocale, $editMode, $dictionary,
                    $supportedLocales, $defaultLocale
```

### 4.3 Visual Editor (Human correction)

```
User clicks "进入编辑模式"
       │
       ▼
editMode.value = true
       │
       ├─ <AiI18nT> components show outlines:
       │    ├─ green dashed = has translation
       │    └─ red dashed = missing translation
       │
User clicks a text element
       │
       ▼
VisualEditor panel opens with current translation
       │
User edits and clicks "Save"
       │
       ▼
POST /api/ai-i18n/update { key, value, lang }
       │
       ├─ Reads locales/en.json
       ├─ Updates the key with plain string value
       └─ Writes locales/en.json
```

---

## 5. Key Files and Their Responsibilities

### `src/module.ts`
- Registers the Nuxt module
- Adds runtime plugin, components, and server API routes
- Exposes `aiI18n` config to `runtimeConfig.public`

### `src/cli.ts`
- `sync` command: scan → extract → translate → write
- `list` command: scan → print all found keys
- Uses OpenAI `response_format: { type: 'json_object' }` for reliable batch translation
- Falls back to key-by-key translation if batch fails
- Supports `--force` flag to re-translate everything

### `src/runtime/plugins/i18n.ts`
- Runs on both server and client (async plugin)
- Provides: `$t`, `$locale`, `$setLocale`, `$editMode`, `$dictionary`, `$supportedLocales`, `$defaultLocale`
- **Does NOT call AI at runtime** — only reads pre-generated JSON
- Uses `useCookie` for locale persistence across page reloads

### `src/runtime/components/T.vue`
- Wraps translated text in `<span data-i18n-key="...">` for Visual Editor targeting
- Shows outline styles when `editMode` is active (green = translated, red = missing)
- **IMPORTANT:** Uses `tKey` prop (not `key`) to avoid conflict with Vue's reserved `key` attribute

### `src/runtime/components/VisualEditor.vue`
- Floating panel (bottom-right, fixed position, dark theme)
- Global click interceptor: captures clicks on `[data-i18n-key]` elements
- Saves via `POST /api/ai-i18n/update` and updates local `$dictionary` state
- Wrapped in `<ClientOnly>` in the demo — this is intentional

### `src/runtime/server/api/locales.ts`
- `GET /api/ai-i18n/locales?lang=en`
- Reads `locales/en.json` from `process.cwd()`
- Normalizes both plain string and legacy `{ value, meta }` formats for backward compatibility

### `src/runtime/server/api/update.ts`
- `POST /api/ai-i18n/update { key, value, lang }`
- Reads, updates, and writes `locales/{lang}.json`
- Saves plain string values (not objects with meta)

---

## 6. Locale File Format

Files are stored at `{project_root}/locales/{lang}.json`.

**Current format (v1.0+):**
```json
{
  "用户仪表盘": "User Dashboard",
  "今日访问量": "Today's Visits"
}
```

**Legacy format (v0.x, still supported for reading):**
```json
{
  "用户仪表盘": {
    "value": "User Dashboard",
    "meta": { "status": "ai_generated", "timestamp": "..." }
  }
}
```

The `locales.ts` API normalizes both formats on read. New writes always use the plain string format.

---

## 7. Known Issues and Gotchas

| Issue | Cause | Fix |
|---|---|---|
| `<AiI18nT key="...">` doesn't work | `key` is a reserved Vue attribute | Use `tKey` instead: `<AiI18nT tKey="...">` |
| Translations not showing after `sync` | Server cache | Restart dev server or hard-refresh |
| `Cannot read properties of undefined` on SSR | Plugin provides are not available during SSR setup | Access via `useNuxtApp()` inside `computed()` or `onMounted()` |
| Visual Editor not appearing | It's wrapped in `<ClientOnly>` | This is intentional; it only runs on the client |
| `dist/cli.js` warning during build | `nuxt-module-build` warns about missing package.json for CLI | Suppressed via `build.config.ts` with `failOnWarn: false` |
| Tailwind CSS not loading | Module not installed | Run `pnpm add @nuxtjs/tailwindcss` and add to `modules` in `nuxt.config.ts` |

---

## 8. Future Roadmap

### Short-term (v1.1)
- [ ] **Watch mode**: `ai-i18n sync --watch` — re-translate on file save (perfect for Cursor)
- [ ] **Vite plugin**: Extract keys at build time without running a separate CLI command
- [ ] **Namespace support**: Group keys by page/component for large projects
- [ ] **Pluralization**: `$t('item', count)` with plural forms
- [ ] **Type safety**: Generate TypeScript types for all keys

### Medium-term (v1.2)
- [ ] **Context-aware translation**: Pass surrounding UI context to the LLM for better translations
- [ ] **Translation memory**: Reuse existing translations for similar strings
- [ ] **Multi-provider support**: Anthropic, Google Gemini, DeepL, etc.
- [ ] **Export to standard formats**: XLIFF, PO files for professional translators
- [ ] **API security**: Auth middleware for `/api/ai-i18n/update` in production

### Long-term (v2.0)
- [ ] **Vue 3 / Vite plugin** (framework-agnostic, not just Nuxt)
- [ ] **CI/CD integration**: GitHub Action that auto-translates on PR merge
- [ ] **Translation dashboard**: Web UI to manage all locale files
- [ ] **Cursor extension**: Translate on-the-fly as you type

---

## 9. Development Guide

### Building the module

```bash
cd packages/nuxt-ai-i18n
pnpm run build
# Output: dist/module.mjs, dist/runtime/**, dist/cli.js
```

### Running the playground

```bash
cd playground
pnpm install
pnpm dev
```

### Testing the CLI

```bash
cd playground
OPENAI_API_KEY=sk-... node ../packages/nuxt-ai-i18n/dist/cli.js sync
```

### Adding a new server API route

1. Create `src/runtime/server/api/{name}.ts`
2. Add to `module.ts` in the `addServerHandler` calls
3. Rebuild: `pnpm run build`

---

## 10. Prompt Templates for AI Agents

When asking an AI to work on this project, use these prompts:

**Adding a new feature:**
```
Read AI_ITERATION_GUIDE.md first. Then implement [feature].
Key constraints:
- AI translation happens at BUILD TIME via CLI, not at runtime
- Locale files are plain JSON: { "中文key": "translation" }
- The $t() function only reads from pre-generated files
- Do not add runtime LLM calls
- Use tKey prop (not key) for AiI18nT component
```

**Fixing a bug:**
```
Read AI_ITERATION_GUIDE.md section 7 (Known Issues) first.
The bug is: [description]
Relevant files: [list from section 5]
```

**Adding a new locale:**
```
Run: OPENAI_API_KEY=sk-... npx ai-i18n sync --locales [new-locale]
Then add the locale to nuxt.config.ts aiI18n.locales array.
```

---

*Last updated: 2026-04-15 | Architecture version: 1.0 (Build-time AI)*
