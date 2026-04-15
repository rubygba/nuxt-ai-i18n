import { defineEventHandler, readBody } from "h3";
import fs from "fs";
import path from "path";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { key, value, lang } = body;
  if (!key || !lang) {
    return { success: false, error: "Missing key or lang" };
  }
  const localesDir = path.resolve(process.cwd(), "locales");
  const localePath = path.join(localesDir, `${lang}.json`);
  let dictionary = {};
  if (fs.existsSync(localePath)) {
    try {
      dictionary = JSON.parse(fs.readFileSync(localePath, "utf-8"));
    } catch {
      dictionary = {};
    }
  }
  dictionary[key] = value ?? "";
  if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true });
  }
  fs.writeFileSync(localePath, JSON.stringify(dictionary, null, 2), "utf-8");
  return { success: true };
});
