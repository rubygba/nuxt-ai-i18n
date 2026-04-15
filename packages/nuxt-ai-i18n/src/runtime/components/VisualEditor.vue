<template>
  <div v-if="editMode?.value">
    <!-- Floating editor panel -->
    <Teleport to="body">
      <div class="ai-i18n-overlay">
        <div class="ai-i18n-panel">
          <div class="ai-i18n-panel-header">
            <div class="ai-i18n-panel-title">
              <span class="ai-i18n-badge">AI i18n</span>
              <span>Visual Editor</span>
            </div>
            <button class="ai-i18n-close" @click="closeEditor">✕</button>
          </div>

          <div class="ai-i18n-panel-body">
            <div v-if="selectedKey" class="ai-i18n-edit-form">
              <div class="ai-i18n-field">
                <label>Source ({{ defaultLocale }}):</label>
                <div class="ai-i18n-source">{{ selectedKey }}</div>
              </div>
              <div class="ai-i18n-field">
                <label>Translation ({{ locale?.value }}):</label>
                <textarea v-model="editValue" rows="3" class="ai-i18n-textarea" />
              </div>
              <div class="ai-i18n-actions">
                <button class="ai-i18n-btn-save" :disabled="saving" @click="saveEdit">
                  {{ saving ? 'Saving...' : 'Save' }}
                </button>
                <button class="ai-i18n-btn-cancel" @click="selectedKey = null">Cancel</button>
              </div>
              <p v-if="saveMessage" class="ai-i18n-save-msg">{{ saveMessage }}</p>
            </div>
            <div v-else class="ai-i18n-hint">
              <p>Click any <span class="ai-i18n-hint-green">green-outlined</span> text to edit its translation.</p>
              <p>Red-outlined text has no translation yet.</p>
            </div>
          </div>

          <div class="ai-i18n-panel-footer">
            <span class="ai-i18n-footer-tip">Edits are saved to <code>locales/</code> via the server API.</span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNuxtApp } from '#app'

const nuxtApp = useNuxtApp()
const editMode = nuxtApp.$editMode as { value: boolean } | undefined
const locale = nuxtApp.$locale as { value: string } | undefined
const defaultLocale = nuxtApp.$defaultLocale as string | undefined
const dictionary = nuxtApp.$dictionary as { value: Record<string, Record<string, string>> } | undefined

const selectedKey = ref<string | null>(null)
const editValue = ref('')
const saving = ref(false)
const saveMessage = ref('')

function closeEditor() {
  if (editMode) editMode.value = false
  selectedKey.value = null
}

async function saveEdit() {
  if (!selectedKey.value || !locale?.value) return
  saving.value = true
  saveMessage.value = ''
  try {
    const res = await $fetch<{ success: boolean }>('/api/ai-i18n/update', {
      method: 'POST',
      body: {
        key: selectedKey.value,
        value: editValue.value,
        lang: locale.value,
      },
    })
    if (res?.success && dictionary) {
      if (!dictionary.value[locale.value]) dictionary.value[locale.value] = {}
      dictionary.value[locale.value][selectedKey.value] = editValue.value
      saveMessage.value = 'Saved!'
      setTimeout(() => { saveMessage.value = '' }, 2000)
      selectedKey.value = null
    }
  }
  catch (e) {
    saveMessage.value = 'Save failed.'
  }
  finally {
    saving.value = false
  }
}

function handleGlobalClick(e: MouseEvent) {
  if (!editMode?.value) return
  const target = (e.target as HTMLElement).closest('[data-i18n-key]')
  if (target) {
    e.preventDefault()
    e.stopPropagation()
    const key = target.getAttribute('data-i18n-key') || ''
    selectedKey.value = key
    const lang = locale?.value
    editValue.value = (lang && dictionary?.value?.[lang]?.[key]) || ''
  }
}

onMounted(() => {
  window.addEventListener('click', handleGlobalClick, true)
})

onUnmounted(() => {
  window.removeEventListener('click', handleGlobalClick, true)
})
</script>

<style>
.ai-i18n-overlay {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 99999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.ai-i18n-panel {
  width: 360px;
  background: #1e1e2e;
  border: 1px solid #313244;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  color: #cdd6f4;
}

.ai-i18n-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #181825;
  border-bottom: 1px solid #313244;
}

.ai-i18n-panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
}

.ai-i18n-badge {
  background: linear-gradient(135deg, #cba6f7, #89b4fa);
  color: #1e1e2e;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.ai-i18n-close {
  background: none;
  border: none;
  color: #6c7086;
  cursor: pointer;
  font-size: 16px;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;
}

.ai-i18n-close:hover {
  background: #313244;
  color: #cdd6f4;
}

.ai-i18n-panel-body {
  padding: 16px;
}

.ai-i18n-field {
  margin-bottom: 12px;
}

.ai-i18n-field label {
  display: block;
  font-size: 11px;
  color: #6c7086;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.ai-i18n-source {
  padding: 8px 10px;
  background: #181825;
  border: 1px solid #313244;
  border-radius: 6px;
  font-size: 13px;
  color: #a6e3a1;
}

.ai-i18n-textarea {
  width: 100%;
  padding: 8px 10px;
  background: #181825;
  border: 1px solid #313244;
  border-radius: 6px;
  font-size: 13px;
  color: #cdd6f4;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}

.ai-i18n-textarea:focus {
  border-color: #89b4fa;
}

.ai-i18n-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.ai-i18n-btn-save {
  flex: 1;
  padding: 8px;
  background: linear-gradient(135deg, #cba6f7, #89b4fa);
  color: #1e1e2e;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.ai-i18n-btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ai-i18n-btn-cancel {
  padding: 8px 16px;
  background: #313244;
  color: #cdd6f4;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}

.ai-i18n-btn-cancel:hover {
  background: #45475a;
}

.ai-i18n-save-msg {
  font-size: 12px;
  color: #a6e3a1;
  margin: 8px 0 0;
  text-align: center;
}

.ai-i18n-hint {
  font-size: 13px;
  color: #6c7086;
  line-height: 1.6;
}

.ai-i18n-hint-green {
  color: #a6e3a1;
  font-weight: 600;
}

.ai-i18n-panel-footer {
  padding: 10px 16px;
  background: #181825;
  border-top: 1px solid #313244;
}

.ai-i18n-footer-tip {
  font-size: 11px;
  color: #45475a;
}

.ai-i18n-footer-tip code {
  color: #89b4fa;
  background: #313244;
  padding: 1px 4px;
  border-radius: 3px;
}
</style>
