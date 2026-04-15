import { defineEventHandler, readBody } from 'h3'
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { key, newValue, lang, author } = body
  const localePath = path.resolve(process.cwd(), `locales/${lang}.json`)

  let dictionary: Record<string, any> = {}
  if (fs.existsSync(localePath)) {
    dictionary = JSON.parse(fs.readFileSync(localePath, 'utf-8'))
  }

  dictionary[key] = {
    value: newValue,
    meta: {
      status: 'human_reviewed',
      author: author || 'anonymous',
      timestamp: new Date().toISOString()
    }
  }

  const localesDir = path.resolve(process.cwd(), 'locales')
  if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true })
  }
  fs.writeFileSync(localePath, JSON.stringify(dictionary, null, 2))

  return { success: true, entry: dictionary[key] }
})
