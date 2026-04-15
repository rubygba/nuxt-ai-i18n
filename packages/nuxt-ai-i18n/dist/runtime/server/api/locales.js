import { defineEventHandler, getQuery } from "h3";
import fs from "fs";
import path from "path";
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const lang = query.lang;
  if (!lang) return {};
  const localePath = path.resolve(process.cwd(), "locales", `${lang}.json`);
  if (fs.existsSync(localePath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(localePath, "utf-8"));
      const normalized = {};
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === "string") {
          normalized[k] = v;
        } else if (v && typeof v === "object" && "value" in v) {
          normalized[k] = v.value;
        }
      }
      return normalized;
    } catch {
      return {};
    }
  }
  return {};
});
