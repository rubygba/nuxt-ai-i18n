import { defineEventHandler, getQuery } from 'h3'
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const lang = query.lang as string

  if (!lang) return {}

  const localePath = path.resolve(process.cwd(), 'locales', `${lang}.json`)

  if (fs.existsSync(localePath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(localePath, 'utf-8'))
      // Support both plain string values and legacy { value, meta } objects
      const normalized: Record<string, string> = {}
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === 'string') {
          normalized[k] = v
        }
        else if (v && typeof v === 'object' && 'value' in (v as object)) {
          normalized[k] = (v as { value: string }).value
        }
      }
      return normalized
    }
    catch {
      return {}
    }
  }

  return {}
})
