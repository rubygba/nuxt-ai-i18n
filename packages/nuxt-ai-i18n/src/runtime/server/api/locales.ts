import { defineEventHandler, getQuery } from 'h3'
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const lang = query.lang as string
  const localePath = path.resolve(process.cwd(), `locales/${lang}.json`)

  if (fs.existsSync(localePath)) {
    return JSON.parse(fs.readFileSync(localePath, 'utf-8'))
  }

  return {}
})
