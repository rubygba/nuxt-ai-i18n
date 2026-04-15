<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- Navigation Header -->
    <header class="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-purple-500/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center">
              <span class="text-white font-bold">AI</span>
            </div>
            <div>
              <h1 class="text-xl font-bold text-white">{{ $t('nuxt-ai-i18n') }}</h1>
              <p class="text-xs text-purple-300">{{ $t('AI 驱动的国际化解决方案') }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <select 
              :value="currentLocale" 
              @change="e => setLocale(e.target.value)"
              class="px-4 py-2 rounded-lg bg-slate-800 text-white border border-purple-500/30 hover:border-purple-500/60 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="zh">🇨🇳 中文</option>
              <option value="en">🇺🇸 English</option>
              <option value="ja">🇯🇵 日本語</option>
              <option value="ko">🇰🇷 한국어</option>
            </select>
            
            <button 
              @click="toggleEditing" 
              :class="{ 
                'bg-gradient-to-r from-purple-600 to-pink-600 text-white': isEditing,
                'bg-slate-800 text-purple-300 hover:text-purple-200': !isEditing
              }"
              class="px-4 py-2 rounded-lg border border-purple-500/30 transition-all duration-200 font-medium"
            >
              {{ isEditing ? '✓ ' : '✎ ' }}{{ isEditing ? $t('编辑中') : $t('编辑') }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section -->
      <section class="mb-12">
        <div class="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30 p-8 md:p-12">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">
            <AiI18nT key="欢迎使用 nuxt-ai-i18n" />
          </h2>
          <p class="text-lg text-purple-200 mb-6 max-w-2xl">
            <AiI18nT key="这是一个基于 AI 的 Nuxt3 国际化插件演示。你只需要在代码中直接写中文，插件会自动帮你翻译成其他语言。" />
          </p>
          <div class="flex gap-4">
            <button class="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all">
              {{ $t('开始使用') }}
            </button>
            <button class="px-6 py-3 rounded-lg bg-slate-800 text-purple-300 border border-purple-500/30 font-medium hover:border-purple-500/60 transition-colors">
              {{ $t('了解更多') }}
            </button>
          </div>
        </div>
      </section>

      <!-- Features Grid -->
      <section class="mb-12">
        <h3 class="text-3xl font-bold text-white mb-8">{{ $t('核心特性') }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Feature 1 -->
          <div class="group bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/10">
            <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span class="text-2xl">🤖</span>
            </div>
            <h4 class="text-xl font-bold text-white mb-2"><AiI18nT key="AI 自动翻译" /></h4>
            <p class="text-purple-300"><AiI18nT key="智能识别缺失翻译，自动调用 LLM 进行翻译并保存。" /></p>
          </div>

          <!-- Feature 2 -->
          <div class="group bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/10">
            <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span class="text-2xl">✏️</span>
            </div>
            <h4 class="text-xl font-bold text-white mb-2"><AiI18nT key="可视化编辑" /></h4>
            <p class="text-purple-300"><AiI18nT key="直观的批注层，支持在页面上直接修改翻译内容。" /></p>
          </div>

          <!-- Feature 3 -->
          <div class="group bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/10">
            <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span class="text-2xl">💾</span>
            </div>
            <h4 class="text-xl font-bold text-white mb-2"><AiI18nT key="数据回流" /></h4>
            <p class="text-purple-300"><AiI18nT key="修改的翻译自动保存到本地字典，形成完整的闭环。" /></p>
          </div>
        </div>
      </section>

      <!-- Demo Section -->
      <section class="mb-12">
        <h3 class="text-3xl font-bold text-white mb-8">{{ $t('交互演示') }}</h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Form Demo -->
          <div class="bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-xl p-8">
            <h4 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span class="text-2xl">📝</span>
              <AiI18nT key="表单示例" />
            </h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-purple-300 mb-2">
                  <AiI18nT key="用户名" />
                </label>
                <input 
                  type="text" 
                  :placeholder="$t('请输入您的用户名')"
                  class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-purple-500/30 text-white placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-purple-300 mb-2">
                  <AiI18nT key="邮箱地址" />
                </label>
                <input 
                  type="email" 
                  :placeholder="$t('请输入您的邮箱')"
                  class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-purple-500/30 text-white placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
              <button class="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all mt-6">
                <AiI18nT key="提交表单" />
              </button>
            </div>
          </div>

          <!-- Stats Demo -->
          <div class="bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-xl p-8">
            <h4 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span class="text-2xl">📊</span>
              <AiI18nT key="统计信息" />
            </h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-purple-500/10">
                <span class="text-purple-300"><AiI18nT key="已翻译语言" /></span>
                <span class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">4</span>
              </div>
              <div class="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-purple-500/10">
                <span class="text-purple-300"><AiI18nT key="翻译词条" /></span>
                <span class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">{{ dictionary && currentLocale && dictionary[currentLocale] ? Object.keys(dictionary[currentLocale]).length : 0 }}</span>
              </div>
              <div class="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-purple-500/10">
                <span class="text-purple-300"><AiI18nT key="编辑状态" /></span>
                <span class="text-sm px-3 py-1 rounded-full" :class="isEditing ? 'bg-green-500/20 text-green-300' : 'bg-slate-600/20 text-slate-300'">
                  {{ isEditing ? $t('编辑中') : $t('查看中') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="mb-12">
        <h3 class="text-3xl font-bold text-white mb-8">{{ $t('工作流程') }}</h3>
        <div class="space-y-4">
          <div class="flex gap-4 p-6 bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-xl hover:border-purple-500/60 transition-all">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600">
                <span class="text-xl">1️⃣</span>
              </div>
            </div>
            <div>
              <h4 class="text-lg font-bold text-white"><AiI18nT key="开发阶段" /></h4>
              <p class="text-purple-300"><AiI18nT key="开发者在代码中直接使用中文，无需维护 i18n Key。" /></p>
            </div>
          </div>

          <div class="flex gap-4 p-6 bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-xl hover:border-purple-500/60 transition-all">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600">
                <span class="text-xl">2️⃣</span>
              </div>
            </div>
            <div>
              <h4 class="text-lg font-bold text-white"><AiI18nT key="运行阶段" /></h4>
              <p class="text-purple-300"><AiI18nT key="用户切换语言时，插件自动检测缺失翻译并调用 AI 进行翻译。" /></p>
            </div>
          </div>

          <div class="flex gap-4 p-6 bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-xl hover:border-purple-500/60 transition-all">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600">
                <span class="text-xl">3️⃣</span>
              </div>
            </div>
            <div>
              <h4 class="text-lg font-bold text-white"><AiI18nT key="校对阶段" /></h4>
              <p class="text-purple-300"><AiI18nT key="开启编辑模式，直接在页面上修改 AI 生成的翻译，自动保存到本地。" /></p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="mb-12">
        <div class="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30 p-8 md:p-12 text-center">
          <h3 class="text-3xl font-bold text-white mb-4">
            <AiI18nT key="准备好了吗？" />
          </h3>
          <p class="text-lg text-purple-200 mb-8">
            <AiI18nT key="立即开始使用 nuxt-ai-i18n，让国际化变得简单。" />
          </p>
          <button class="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all">
            {{ $t('开始体验') }}
          </button>
        </div>
      </section>
    </main>

    <!-- Visual Editor Component from Module -->
    <ClientOnly>
      <AiI18nVisualEditor />
    </ClientOnly>

    <!-- Footer -->
    <footer class="border-t border-purple-500/20 bg-slate-900/50 backdrop-blur mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 class="text-white font-bold mb-4">{{ $t('产品') }}</h4>
            <ul class="space-y-2 text-purple-300 text-sm">
              <li><a href="#" class="hover:text-purple-200 transition">{{ $t('功能') }}</a></li>
              <li><a href="#" class="hover:text-purple-200 transition">{{ $t('定价') }}</a></li>
              <li><a href="#" class="hover:text-purple-200 transition">{{ $t('文档') }}</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-bold mb-4">{{ $t('公司') }}</h4>
            <ul class="space-y-2 text-purple-300 text-sm">
              <li><a href="#" class="hover:text-purple-200 transition">{{ $t('关于我们') }}</a></li>
              <li><a href="#" class="hover:text-purple-200 transition">{{ $t('博客') }}</a></li>
              <li><a href="#" class="hover:text-purple-200 transition">{{ $t('联系我们') }}</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-bold mb-4">{{ $t('资源') }}</h4>
            <ul class="space-y-2 text-purple-300 text-sm">
              <li><a href="#" class="hover:text-purple-200 transition">{{ $t('示例') }}</a></li>
              <li><a href="#" class="hover:text-purple-200 transition">{{ $t('教程') }}</a></li>
              <li><a href="#" class="hover:text-purple-200 transition">{{ $t('API 文档') }}</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-bold mb-4">{{ $t('社区') }}</h4>
            <ul class="space-y-2 text-purple-300 text-sm">
              <li><a href="#" class="hover:text-purple-200 transition">GitHub</a></li>
              <li><a href="#" class="hover:text-purple-200 transition">Discord</a></li>
              <li><a href="#" class="hover:text-purple-200 transition">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-purple-500/20 pt-8 text-center text-purple-300 text-sm">
          <p>&copy; 2024 nuxt-ai-i18n. <AiI18nT key="让国际化变得简单。" /></p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const { $t, currentLocale, setLocale, isEditing, toggleEditing, dictionary } = useNuxtApp()
</script>

<style scoped>
/* Smooth transitions */
* {
  @apply transition-colors duration-200;
}

/* Gradient text utility */
.gradient-text {
  @apply text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
}

::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.8);
}
</style>
