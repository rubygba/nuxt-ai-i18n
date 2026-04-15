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
                  {{ saving ? "Saving..." : "Save" }}
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

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useNuxtApp } from "#app";
const nuxtApp = useNuxtApp();
const editMode = nuxtApp.$editMode;
const locale = nuxtApp.$locale;
const defaultLocale = nuxtApp.$defaultLocale;
const dictionary = nuxtApp.$dictionary;
const selectedKey = ref(null);
const editValue = ref("");
const saving = ref(false);
const saveMessage = ref("");
function closeEditor() {
  if (editMode) editMode.value = false;
  selectedKey.value = null;
}
async function saveEdit() {
  if (!selectedKey.value || !locale?.value) return;
  saving.value = true;
  saveMessage.value = "";
  try {
    const res = await $fetch("/api/ai-i18n/update", {
      method: "POST",
      body: {
        key: selectedKey.value,
        value: editValue.value,
        lang: locale.value
      }
    });
    if (res?.success && dictionary) {
      if (!dictionary.value[locale.value]) dictionary.value[locale.value] = {};
      dictionary.value[locale.value][selectedKey.value] = editValue.value;
      saveMessage.value = "Saved!";
      setTimeout(() => {
        saveMessage.value = "";
      }, 2e3);
      selectedKey.value = null;
    }
  } catch (e) {
    saveMessage.value = "Save failed.";
  } finally {
    saving.value = false;
  }
}
function handleGlobalClick(e) {
  if (!editMode?.value) return;
  const target = e.target.closest("[data-i18n-key]");
  if (target) {
    e.preventDefault();
    e.stopPropagation();
    const key = target.getAttribute("data-i18n-key") || "";
    selectedKey.value = key;
    const lang = locale?.value;
    editValue.value = lang && dictionary?.value?.[lang]?.[key] || "";
  }
}
onMounted(() => {
  window.addEventListener("click", handleGlobalClick, true);
});
onUnmounted(() => {
  window.removeEventListener("click", handleGlobalClick, true);
});
</script>

<style>
.ai-i18n-overlay{bottom:24px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;position:fixed;right:24px;z-index:99999}.ai-i18n-panel{background:#1e1e2e;border:1px solid #313244;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.5);color:#cdd6f4;overflow:hidden;width:360px}.ai-i18n-panel-header{align-items:center;background:#181825;border-bottom:1px solid #313244;display:flex;justify-content:space-between;padding:12px 16px}.ai-i18n-panel-title{align-items:center;display:flex;font-size:14px;font-weight:600;gap:8px}.ai-i18n-badge{background:linear-gradient(135deg,#cba6f7,#89b4fa);border-radius:4px;color:#1e1e2e;font-size:10px;font-weight:700;letter-spacing:.05em;padding:2px 6px}.ai-i18n-close{background:none;border:none;border-radius:4px;color:#6c7086;cursor:pointer;font-size:16px;padding:2px 6px;transition:background .15s,color .15s}.ai-i18n-close:hover{background:#313244;color:#cdd6f4}.ai-i18n-panel-body{padding:16px}.ai-i18n-field{margin-bottom:12px}.ai-i18n-field label{color:#6c7086;display:block;font-size:11px;letter-spacing:.08em;margin-bottom:6px;text-transform:uppercase}.ai-i18n-source{color:#a6e3a1}.ai-i18n-source,.ai-i18n-textarea{background:#181825;border:1px solid #313244;border-radius:6px;font-size:13px;padding:8px 10px}.ai-i18n-textarea{box-sizing:border-box;color:#cdd6f4;font-family:inherit;outline:none;resize:vertical;transition:border-color .15s;width:100%}.ai-i18n-textarea:focus{border-color:#89b4fa}.ai-i18n-actions{display:flex;gap:8px;margin-top:4px}.ai-i18n-btn-save{background:linear-gradient(135deg,#cba6f7,#89b4fa);border:none;border-radius:6px;color:#1e1e2e;cursor:pointer;flex:1;font-size:13px;font-weight:600;padding:8px;transition:opacity .15s}.ai-i18n-btn-save:disabled{cursor:not-allowed;opacity:.5}.ai-i18n-btn-cancel{background:#313244;border:none;border-radius:6px;color:#cdd6f4;cursor:pointer;font-size:13px;padding:8px 16px;transition:background .15s}.ai-i18n-btn-cancel:hover{background:#45475a}.ai-i18n-save-msg{color:#a6e3a1;font-size:12px;margin:8px 0 0;text-align:center}.ai-i18n-hint{color:#6c7086;font-size:13px;line-height:1.6}.ai-i18n-hint-green{color:#a6e3a1;font-weight:600}.ai-i18n-panel-footer{background:#181825;border-top:1px solid #313244;padding:10px 16px}.ai-i18n-footer-tip{color:#45475a;font-size:11px}.ai-i18n-footer-tip code{background:#313244;border-radius:3px;color:#89b4fa;padding:1px 4px}
</style>
