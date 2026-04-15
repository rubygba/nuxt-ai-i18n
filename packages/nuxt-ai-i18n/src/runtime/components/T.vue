<template>
  <span
    :data-i18n-key="tKey"
    :class="['ai-i18n-text', editMode?.value ? statusClass : '']"
    @click="handleClick"
  >{{ translatedValue }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNuxtApp } from '#app'

const props = defineProps<{
  tKey: string
}>()

const nuxtApp = useNuxtApp()

const translatedValue = computed<string>(() => {
  const fn = nuxtApp.$t as ((k: string) => string) | undefined
  return fn ? fn(props.tKey) : props.tKey
})

const editMode = nuxtApp.$editMode as { value: boolean } | undefined
const dictionary = nuxtApp.$dictionary as { value: Record<string, Record<string, string>> } | undefined
const locale = nuxtApp.$locale as { value: string } | undefined
const defaultLocale = nuxtApp.$defaultLocale as string | undefined

const statusClass = computed<string>(() => {
  if (!editMode?.value) return ''
  const lang = locale?.value
  if (!lang || lang === (defaultLocale ?? 'zh')) return ''
  const dict = dictionary?.value?.[lang]
  if (!dict) return 'ai-i18n-missing'
  const val = dict[props.tKey]
  if (val === undefined || val === null) return 'ai-i18n-missing'
  // If the translation equals the source key, it was never translated
  if (val === props.tKey) return 'ai-i18n-missing'
  return 'ai-i18n-translated'
})

function handleClick(e: MouseEvent) {
  if (editMode?.value) {
    e.preventDefault()
    e.stopPropagation()
  }
}
</script>

<style>
.ai-i18n-text {
  display: inline;
  transition: outline 0.15s, background 0.15s;
}

.ai-i18n-translated {
  outline: 1px dashed #22c55e;
  cursor: pointer;
}

.ai-i18n-missing {
  outline: 1px dashed #ef4444;
  cursor: pointer;
}

[data-ai-i18n-editing] .ai-i18n-text:hover {
  background: rgba(99, 102, 241, 0.1);
  outline: 1px solid #6366f1;
}
</style>
