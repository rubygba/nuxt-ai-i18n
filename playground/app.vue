<template>
  <div class="min-h-screen bg-gray-950 text-gray-100">

    <!-- Navbar -->
    <nav class="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">AI</div>
            <span class="font-bold text-white text-lg">nuxt-ai-i18n</span>
            <span class="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-900/50 text-violet-300 border border-violet-700/50">v1.0</span>
          </div>

          <div class="flex items-center gap-3">
            <!-- Language Switcher -->
            <div class="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
              <button
                v-for="lang in locales"
                :key="lang.code"
                :class="[
                  'px-3 py-1 rounded-md text-sm font-medium transition-all',
                  currentLocale === lang.code
                    ? 'bg-violet-600 text-white shadow'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                ]"
                @click="switchLocale(lang.code)"
              >
                {{ lang.label }}
              </button>
            </div>

            <!-- Edit Mode Toggle -->
            <button
              :class="[
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                isEditing
                  ? 'bg-amber-500 text-gray-900 hover:bg-amber-400'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
              ]"
              @click="toggleEdit"
            >
              <span>{{ isEditing ? '✏️' : '👁' }}</span>
              <span>{{ isEditing ? $t('退出编辑模式') : $t('进入编辑模式') }}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative overflow-hidden py-20 px-4">
      <div class="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-gray-950 to-blue-950/40 pointer-events-none"></div>
      <div class="absolute top-20 left-1/4 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative max-w-4xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-900/40 border border-violet-700/50 text-violet-300 text-sm mb-6">
          <span class="w-2 h-2 rounded-full bg-violet-400 animate-pulse inline-block"></span>
          Build-time AI · Zero Runtime Overhead
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
          <AiI18nT tKey="AI 驱动的国际化解决方案" />
        </h1>
        <p class="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          <AiI18nT tKey="零心智负担，一键翻译，可视化校对" />
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold hover:from-violet-500 hover:to-blue-500 transition-all shadow-lg shadow-violet-900/30">
            <AiI18nT tKey="开始使用" />
          </button>
          <button class="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-semibold hover:bg-gray-700 hover:text-white transition-all border border-gray-700">
            <AiI18nT tKey="查看文档" />
          </button>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="py-16 px-4 border-t border-gray-800/50">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
          <AiI18nT tKey="核心特性" />
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="feature in features" :key="feature.icon" class="group p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-violet-700/50 transition-all hover:bg-gray-900/80">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-violet-700/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              {{ feature.icon }}
            </div>
            <h3 class="font-semibold text-white mb-2">
              <AiI18nT :tKey="feature.title" />
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              <AiI18nT :tKey="feature.desc" />
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Workflow Steps -->
    <section class="py-16 px-4 bg-gray-900/30">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
          <AiI18nT tKey="工作流程" />
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(step, idx) in steps" :key="idx" class="relative">
            <div class="p-6 rounded-2xl bg-gray-900 border border-gray-800 h-full">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {{ idx + 1 }}
                </div>
                <span class="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  <AiI18nT :tKey="step.step" />
                </span>
              </div>
              <h3 class="font-semibold text-white mb-2">
                <AiI18nT :tKey="step.title" />
              </h3>
              <p class="text-xs text-gray-500 leading-relaxed">
                <AiI18nT :tKey="step.desc" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Dashboard Demo -->
    <section class="py-16 px-4 border-t border-gray-800/50">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-bold text-white text-center mb-3">
          <AiI18nT tKey="用户仪表盘" />
        </h2>
        <p class="text-gray-500 text-center mb-10 text-sm">
          <AiI18nT tKey="这是一个演示页面，展示了插件的核心功能" />
        </p>

        <!-- Stats Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div v-for="stat in stats" :key="stat.label" class="p-5 rounded-2xl bg-gray-900 border border-gray-800">
            <p class="text-xs text-gray-500 mb-1"><AiI18nT :tKey="stat.label" /></p>
            <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
            <p :class="['text-xs mt-1', stat.up ? 'text-green-400' : 'text-red-400']">
              {{ stat.up ? '↑' : '↓' }} {{ stat.change }}
            </p>
          </div>
        </div>

        <!-- Orders Table -->
        <div class="rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3 class="font-semibold text-white"><AiI18nT tKey="最近订单" /></h3>
            <div class="flex gap-2">
              <button class="px-3 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs hover:text-white transition-colors"><AiI18nT tKey="筛选" /></button>
              <button class="px-3 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs hover:text-white transition-colors"><AiI18nT tKey="导出" /></button>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-800">
                  <th class="px-6 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider"><AiI18nT tKey="订单号" /></th>
                  <th class="px-6 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider"><AiI18nT tKey="客户" /></th>
                  <th class="px-6 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider"><AiI18nT tKey="金额" /></th>
                  <th class="px-6 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider"><AiI18nT tKey="状态" /></th>
                  <th class="px-6 py-3 text-left text-xs text-gray-500 font-medium uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders" :key="order.id" class="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td class="px-6 py-4 text-gray-300 font-mono text-xs">{{ order.id }}</td>
                  <td class="px-6 py-4 text-gray-300">{{ order.customer }}</td>
                  <td class="px-6 py-4 text-gray-300">{{ order.amount }}</td>
                  <td class="px-6 py-4">
                    <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', order.statusClass]">
                      <AiI18nT :tKey="order.status" />
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <button class="text-xs text-violet-400 hover:text-violet-300 transition-colors"><AiI18nT tKey="查看详情" /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Start Code Section -->
    <section class="py-16 px-4 bg-gray-900/30 border-t border-gray-800/50">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
          <AiI18nT tKey="快速开始" />
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div v-for="code in codeBlocks" :key="code.step" class="rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden">
            <div class="px-4 py-3 bg-gray-800/50 border-b border-gray-800 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-violet-600/30 text-violet-300 text-xs flex items-center justify-center font-bold">{{ code.step }}</span>
              <span class="text-sm text-gray-300 font-medium"><AiI18nT :tKey="code.title" /></span>
            </div>
            <pre class="p-4 text-xs text-gray-400 overflow-x-auto leading-relaxed"><code>{{ code.code }}</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-gray-800 py-10 px-4">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">AI</div>
          <span class="text-gray-500 text-sm">nuxt-ai-i18n — Build-time AI i18n for Nuxt 3</span>
        </div>
        <div class="flex gap-6 text-sm text-gray-600">
          <a href="https://github.com/rubygba/nuxt-ai-i18n" target="_blank" class="hover:text-gray-400 transition-colors">GitHub</a>
          <span>MIT License</span>
        </div>
      </div>
    </footer>

    <!-- Visual Editor (client-only) -->
    <ClientOnly>
      <AiI18nVisualEditor />
    </ClientOnly>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNuxtApp } from '#app'

const nuxtApp = useNuxtApp()
const $t = nuxtApp.$t as (k: string) => string
const localeRef = nuxtApp.$locale as { value: string }
const setLocale = nuxtApp.$setLocale as (l: string) => Promise<void>
const editModeRef = nuxtApp.$editMode as { value: boolean }

const currentLocale = computed(() => localeRef?.value ?? 'zh')
const isEditing = computed(() => editModeRef?.value ?? false)

const locales = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
]

async function switchLocale(code: string) {
  await setLocale(code)
}

function toggleEdit() {
  if (editModeRef) editModeRef.value = !editModeRef.value
}

const features = [
  {
    icon: '🤖',
    title: '构建时 AI 翻译',
    desc: '在开发或发布时运行 CLI，AI 自动翻译所有新增文案，结果持久化到本地 JSON，运行时零延迟。',
  },
  {
    icon: '🎨',
    title: '可视化编辑器',
    desc: '内置批注层，点击页面上任意文字即可直接修改翻译，修改结果实时写回本地字典文件。',
  },
  {
    icon: '🔄',
    title: '数据回流闭环',
    desc: '人工校对的翻译自动覆盖 AI 生成版本，形成「AI 生成 → 人工审核 → 持久化」的完整闭环。',
  },
  {
    icon: '⚡',
    title: 'Cursor / Claude Code 集成',
    desc: '在编辑器中写代码的同时，运行 ai-i18n sync 即可完成翻译，完美融入 AI 编码工作流。',
  },
]

const steps = [
  { step: '第一步', title: '编写代码', desc: '直接在代码中使用中文：$t(\'你好世界\') 或 <AiI18nT tKey="你好世界" />' },
  { step: '第二步', title: '运行 CLI', desc: '执行 npx ai-i18n sync，AI 自动扫描并翻译所有新增文案' },
  { step: '第三步', title: '可视化校对', desc: '开启编辑模式，点击页面文字进行人工校对和修正' },
  { step: '第四步', title: '发布上线', desc: '翻译已持久化到本地 JSON，构建产物包含完整翻译，零运行时开销' },
]

const stats = [
  { label: '今日访问量', value: '12,847', change: '8.2%', up: true },
  { label: '活跃用户', value: '3,291', change: '3.1%', up: true },
  { label: '转化率', value: '4.73%', change: '0.4%', up: false },
  { label: '收入', value: '¥89,420', change: '12.5%', up: true },
]

const orders = [
  { id: '#ORD-2024-001', customer: 'Alice Chen', amount: '¥1,280', status: '已完成', statusClass: 'bg-green-900/50 text-green-400 border border-green-800' },
  { id: '#ORD-2024-002', customer: 'Bob Wang', amount: '¥560', status: '处理中', statusClass: 'bg-blue-900/50 text-blue-400 border border-blue-800' },
  { id: '#ORD-2024-003', customer: 'Carol Liu', amount: '¥3,400', status: '待确认', statusClass: 'bg-yellow-900/50 text-yellow-400 border border-yellow-800' },
  { id: '#ORD-2024-004', customer: 'David Zhang', amount: '¥890', status: '已完成', statusClass: 'bg-green-900/50 text-green-400 border border-green-800' },
]

const codeBlocks = [
  {
    step: 1,
    title: '安装插件',
    code: `pnpm add nuxt-ai-i18n`,
  },
  {
    step: 2,
    title: '配置模块',
    code: `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-ai-i18n'],
  aiI18n: {
    defaultLocale: 'zh',
    locales: ['en', 'ja', 'ko'],
  }
})`,
  },
  {
    step: 3,
    title: '在代码中使用',
    code: `<!-- 直接使用中文，无需手动维护 key -->
<AiI18nT tKey="欢迎使用" />
<p>{{ $t('用户仪表盘') }}</p>`,
  },
  {
    step: 4,
    title: '运行翻译',
    code: `# 设置 API Key 后运行一次即可
OPENAI_API_KEY=sk-... npx ai-i18n sync

# 支持增量翻译，只翻译新增内容
# 翻译结果保存到 locales/*.json`,
  },
]
</script>
