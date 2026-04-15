<template>
  <div v-if="isEditing" class="ai-i18n-editor-overlay">
    <div class="ai-i18n-editor-panel">
      <div class="header">
        <h3>AI i18n Editor</h3>
        <button @click="toggleEditing">Close</button>
      </div>
      <div class="content">
        <div v-if="selectedKey" class="edit-form">
          <div class="field">
            <label>Original ({{ config.defaultLocale }}):</label>
            <div class="original-text">{{ selectedKey }}</div>
          </div>
          <div class="field">
            <label>Current ({{ currentLocale }}):</label>
            <textarea v-model="editValue" rows="3"></textarea>
          </div>
          <div class="actions">
            <button @click="saveEdit" :disabled="saving">Save & Verify</button>
            <button @click="selectedKey = null">Cancel</button>
          </div>
        </div>
        <div v-else class="instructions">
          Click on any highlighted text to edit its translation.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useNuxtApp, useRuntimeConfig, useState } from '#app'

const { $t, currentLocale, isEditing, toggleEditing, dictionary } = useNuxtApp()
const config = useRuntimeConfig().public.aiI18n

const selectedKey = ref(null)
const editValue = ref('')
const saving = ref(false)

const saveEdit = async () => {
  if (!selectedKey.value) return
  saving.value = true
  try {
    const res = await $fetch('/api/ai-i18n/update', {
      method: 'POST',
      body: {
        key: selectedKey.value,
        newValue: editValue.value,
        lang: currentLocale.value,
        author: 'Visual Editor'
      }
    })
    if (res.success) {
      // Update local dictionary
      if (!dictionary.value[currentLocale.value]) dictionary.value[currentLocale.value] = {}
      dictionary.value[currentLocale.value][selectedKey.value] = res.entry
      selectedKey.value = null
    }
  } catch (e) {
    console.error('Failed to save edit', e)
  } finally {
    saving.value = false
  }
}

// Global click interceptor for editing
const handleGlobalClick = (e) => {
  if (!isEditing.value) return
  
  const target = e.target.closest('[data-i18n-key]')
  if (target) {
    e.preventDefault()
    e.stopPropagation()
    selectedKey.value = target.getAttribute('data-i18n-key')
    editValue.value = target.innerText
  }
}

onMounted(() => {
  window.addEventListener('click', handleGlobalClick, true)
})

onUnmounted(() => {
  window.removeEventListener('click', handleGlobalClick, true)
})
</script>

<style scoped>
.ai-i18n-editor-overlay {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  font-family: sans-serif;
}

.ai-i18n-editor-panel {
  width: 350px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  border: 1px solid #eee;
  overflow: hidden;
}

.header {
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.content {
  padding: 16px;
}

.field {
  margin-bottom: 12px;
}

.field label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.original-text {
  padding: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 14px;
}

textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.actions {
  display: flex;
  gap: 8px;
}

button {
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.actions button:first-child {
  background: #007bff;
  color: white;
  flex: 1;
}

.actions button:last-child {
  background: #eee;
  color: #333;
}

.instructions {
  font-size: 14px;
  color: #666;
  text-align: center;
  padding: 20px 0;
}
</style>
