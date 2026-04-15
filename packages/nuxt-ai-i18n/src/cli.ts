#!/usr/bin/env node
/**
 * nuxt-ai-i18n CLI
 *
 * Usage:
 *   npx ai-i18n sync [options]
 *
 * This CLI scans your project for $t('...') and <AiI18nT tKey="..."> usages,
 * extracts all source keys, and calls an LLM to translate any missing entries
 * into the target locale JSON files.
 *
 * Translation happens at DEV / BUILD time — NOT at runtime.
 * This means:
 *   - Zero latency for end users (translations are pre-generated)
 *   - No API key required in production
 *   - Works great with Cursor / Claude Code (run after editing copy)
 */

import { Command } from 'commander'
import { glob } from 'glob'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { OpenAI } from 'openai'

const program = new Command()

program
  .name('ai-i18n')
  .description('Build-time AI translation CLI for nuxt-ai-i18n')
  .version('1.0.0')

program
  .command('sync')
  .description('Scan project for source strings and translate missing entries using AI')
  .option('-p, --path <path>', 'Root path to scan for .vue / .ts / .js files', process.cwd())
  .option('-l, --locales <locales>', 'Comma-separated target locales', 'en,ja,ko')
  .option('-s, --source-lang <lang>', 'Source language code (used as fallback key)', 'zh')
  .option('-o, --output-dir <dir>', 'Directory to write locale JSON files', 'locales')
  .option('-m, --model <model>', 'OpenAI model to use', 'gpt-4.1-mini')
  .option('--force', 'Re-translate all keys, even if already translated', false)
  .action(async (options) => {
    const { path: scanPath, locales, sourceLang, outputDir, model, force } = options
    const targetLocales: string[] = locales.split(',').map((l: string) => l.trim()).filter(Boolean)

    console.log('\n🌐  nuxt-ai-i18n sync')
    console.log('─────────────────────────────────────────')
    console.log(`  Scan path   : ${scanPath}`)
    console.log(`  Target      : ${targetLocales.join(', ')}`)
    console.log(`  Output dir  : ${outputDir}`)
    console.log(`  Model       : ${model}`)
    console.log(`  Force       : ${force}`)
    console.log('─────────────────────────────────────────\n')

    // ── 1. Extract source keys ──────────────────────────────────────────────
    const files = await glob(`${scanPath}/**/*.{vue,ts,tsx,js,jsx}`, {
      ignore: ['**/node_modules/**', '**/.nuxt/**', '**/dist/**'],
    })

    const keys = new Set<string>()
    for (const file of files) {
      const content = readFileSync(file, 'utf-8')
      // $t('key') or $t("key") or $t(`key`)
      for (const m of content.matchAll(/\$t\(['"`]([^'"`]+)['"`]\)/g)) keys.add(m[1])
      // <AiI18nT tKey="key" /> or <AiI18nT tKey='key' />
      for (const m of content.matchAll(/<AiI18nT[^>]+tKey=['"`]([^'"`]+)['"`]/g)) keys.add(m[1])
    }

    if (keys.size === 0) {
      console.log('✅  No source keys found. Nothing to translate.')
      return
    }
    console.log(`🔍  Found ${keys.size} unique source key(s).\n`)

    // ── 2. Validate API key ─────────────────────────────────────────────────
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('❌  OPENAI_API_KEY is not set. Export it before running this command.')
      process.exit(1)
    }
    const openai = new OpenAI({ apiKey })

    // ── 3. Translate each locale ────────────────────────────────────────────
    if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true })

    for (const locale of targetLocales) {
      const filePath = resolve(outputDir, `${locale}.json`)
      let dict: Record<string, string> = {}

      if (existsSync(filePath)) {
        try {
          const raw = JSON.parse(readFileSync(filePath, 'utf-8'))
          // Normalise legacy { value, meta } format
          for (const [k, v] of Object.entries(raw)) {
            if (typeof v === 'string') dict[k] = v
            else if (v && typeof v === 'object' && 'value' in (v as object)) dict[k] = (v as { value: string }).value
          }
        }
        catch { dict = {} }
      }

      const missing = [...keys].filter(k => force || !dict[k])
      if (missing.length === 0) {
        console.log(`✅  [${locale}] All ${keys.size} key(s) already translated. Skipping.`)
        continue
      }

      console.log(`🤖  [${locale}] Translating ${missing.length} key(s)…`)

      // Batch translate for efficiency (up to 50 keys per request)
      const BATCH = 50
      for (let i = 0; i < missing.length; i += BATCH) {
        const batch = missing.slice(i, i + BATCH)
        const prompt = batch.map((k, idx) => `${idx + 1}. ${k}`).join('\n')

        try {
          const completion = await openai.chat.completions.create({
            model,
            messages: [
              {
                role: 'system',
                content: `You are a professional UI translator. Translate the following numbered ${sourceLang} strings into ${locale}.
Return ONLY a JSON object mapping each number to its translation, e.g. {"1":"Hello","2":"World"}.
Keep translations concise and suitable for UI labels/buttons/messages.`,
              },
              { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
          })

          const raw = completion.choices[0]?.message?.content ?? '{}'
          const translations: Record<string, string> = JSON.parse(raw)

          for (let j = 0; j < batch.length; j++) {
            const translated = translations[String(j + 1)]
            if (translated) {
              dict[batch[j]] = translated
            }
          }
        }
        catch (err) {
          console.error(`  ⚠  Batch ${i / BATCH + 1} failed:`, (err as Error).message)
          // Fall back to key-by-key
          for (const key of batch) {
            try {
              const res = await openai.chat.completions.create({
                model,
                messages: [
                  { role: 'system', content: `Translate the following ${sourceLang} UI text into ${locale}. Return only the translation.` },
                  { role: 'user', content: key },
                ],
                temperature: 0.2,
              })
              const t = res.choices[0]?.message?.content?.trim()
              if (t) dict[key] = t
            }
            catch (e2) {
              console.error(`    ✗ Failed to translate "${key}":`, (e2 as Error).message)
            }
          }
        }
      }

      writeFileSync(filePath, JSON.stringify(dict, null, 2), 'utf-8')
      console.log(`  ✓ Saved → ${filePath}  (${Object.keys(dict).length} entries)\n`)
    }

    console.log('🎉  Sync complete!\n')
  })

program
  .command('list')
  .description('List all source keys found in the project')
  .option('-p, --path <path>', 'Root path to scan', process.cwd())
  .action(async (options) => {
    const files = await glob(`${options.path}/**/*.{vue,ts,tsx,js,jsx}`, {
      ignore: ['**/node_modules/**', '**/.nuxt/**', '**/dist/**'],
    })
    const keys = new Set<string>()
    for (const file of files) {
      const content = readFileSync(file, 'utf-8')
      for (const m of content.matchAll(/\$t\(['"`]([^'"`]+)['"`]\)/g)) keys.add(m[1])
      for (const m of content.matchAll(/<AiI18nT[^>]+tKey=['"`]([^'"`]+)['"`]/g)) keys.add(m[1])
    }
    console.log(`\nFound ${keys.size} source key(s):\n`)
    for (const k of keys) console.log(`  • ${k}`)
    console.log()
  })

program.parse(process.argv)
