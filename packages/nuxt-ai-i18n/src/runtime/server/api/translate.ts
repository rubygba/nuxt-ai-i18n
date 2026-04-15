import { defineEventHandler, readBody } from 'h3'
import { useRuntimeConfig } from '#imports'
import { OpenAI } from 'openai'
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { key, targetLang } = body
  const config = useRuntimeConfig().public.aiI18n

  // 1. Check if already in dictionary
  const localePath = path.resolve(process.cwd(), `locales/${targetLang}.json`)
  let dictionary: Record<string, any> = {}
  if (fs.existsSync(localePath)) {
    dictionary = JSON.parse(fs.readFileSync(localePath, 'utf-8'))
  }

  if (dictionary[key]) {
    return dictionary[key]
  }

  // 2. Translate using AI
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || config.aiApiKey,
    baseURL: process.env.OPENAI_BASE_URL || config.aiBaseUrl || 'https://api.openai.com/v1'
  })

  const prompt = `Translate the following text from ${config.defaultLocale} to ${targetLang}. 
Text: "${key}"
Return ONLY the translated text without any explanation or quotes.`

  const response = await client.chat.completions.create({
    model: config.aiModel || 'gpt-4.1-mini',
    messages: [{ role: 'user', content: prompt }]
  })

  const translatedText = response.choices[0].message.content?.trim() || key

  const entry = {
    value: translatedText,
    meta: {
      status: 'ai_generated',
      hash: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString()
    }
  }

  // 3. Update dictionary file
  dictionary[key] = entry
  const localesDir = path.resolve(process.cwd(), 'locales')
  if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true })
  }
  fs.writeFileSync(localePath, JSON.stringify(dictionary, null, 2))

  return entry
})
