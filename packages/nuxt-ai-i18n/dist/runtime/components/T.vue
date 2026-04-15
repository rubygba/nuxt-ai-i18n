<template>
  <span
    :data-i18n-key="tKey"
    :class="['ai-i18n-text', editMode?.value ? statusClass : '']"
    @click="handleClick"
  >{{ translatedValue }}</span>
</template>

<script setup>
import { computed } from "vue";
import { useNuxtApp } from "#app";
const props = defineProps({
  tKey: { type: String, required: true }
});
const nuxtApp = useNuxtApp();
const translatedValue = computed(() => {
  const fn = nuxtApp.$t;
  return fn ? fn(props.tKey) : props.tKey;
});
const editMode = nuxtApp.$editMode;
const dictionary = nuxtApp.$dictionary;
const locale = nuxtApp.$locale;
const defaultLocale = nuxtApp.$defaultLocale;
const statusClass = computed(() => {
  if (!editMode?.value) return "";
  const lang = locale?.value;
  if (!lang || lang === (defaultLocale ?? "zh")) return "";
  const dict = dictionary?.value?.[lang];
  if (!dict) return "ai-i18n-missing";
  const val = dict[props.tKey];
  if (val === void 0 || val === null) return "ai-i18n-missing";
  if (val === props.tKey) return "ai-i18n-missing";
  return "ai-i18n-translated";
});
function handleClick(e) {
  if (editMode?.value) {
    e.preventDefault();
    e.stopPropagation();
  }
}
</script>

<style>
.ai-i18n-text{display:inline;transition:outline .15s,background .15s}.ai-i18n-translated{cursor:pointer;outline:1px dashed #22c55e}.ai-i18n-missing{cursor:pointer;outline:1px dashed #ef4444}[data-ai-i18n-editing] .ai-i18n-text:hover{background:rgba(99,102,241,.1);outline:1px solid #6366f1}
</style>
