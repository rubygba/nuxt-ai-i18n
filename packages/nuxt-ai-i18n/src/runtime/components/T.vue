<template>
  <span 
    :data-i18n-key="tKey" 
    :class="['ai-i18n-text', statusClass]"
    @click="handleClick"
  >
    {{ translatedValue }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { useNuxtApp } from '#app'

const props = defineProps({
  tKey: {
    type: String,
    required: true
  }
})

const translatedValue = computed(() => {
  const { $t } = useNuxtApp()
  return $t ? $t(props.tKey) : props.tKey
})

const statusClass = computed(() => {
  const { currentLocale, isEditing, dictionary } = useNuxtApp()
  if (!isEditing?.value || !currentLocale?.value || !dictionary?.value) return ''
  
  const currentDict = dictionary.value[currentLocale.value] || {}
  const entry = currentDict[props.tKey]
  
  if (!entry) return 'ai-i18n-missing'
  if (entry.meta?.status === 'ai_generated') return 'ai-i18n-ai-generated'
  if (entry.meta?.status === 'human_reviewed') return 'ai-i18n-human-reviewed'
  
  return ''
})

const handleClick = (e) => {
  if (isEditing.value) {
    e.preventDefault()
    e.stopPropagation()
    // The VisualEditor component will handle the click via global listener
  }
}
</script>

<style>
.ai-i18n-text {
  display: inline-block;
  transition: all 0.2s;
}

.ai-i18n-ai-generated {
  border-bottom: 2px dashed #ffc107;
  cursor: help;
}

.ai-i18n-human-reviewed {
  border-bottom: 2px solid #28a745;
}

.ai-i18n-missing {
  border-bottom: 2px dashed #dc3545;
}

.ai-i18n-editing .ai-i18n-text:hover {
  background: rgba(0, 123, 255, 0.1);
  outline: 1px solid #007bff;
}
</style>
