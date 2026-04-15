<template>
  <div class="container" :class="{ 'ai-i18n-editing': isEditing }">
    <header>
      <h1>{{ $t('AI 驱动的国际化演示') }}</h1>
      <div class="controls">
        <select :value="currentLocale" @change="e => setLocale(e.target.value)">
          <option value="zh">中文 (ZH)</option>
          <option value="en">English (EN)</option>
          <option value="ja">日本語 (JA)</option>
          <option value="ko">한국어 (KO)</option>
        </select>
        <button @click="toggleEditing" :class="{ active: isEditing }">
          {{ isEditing ? '退出编辑模式' : '进入编辑模式' }}
        </button>
      </div>
    </header>

    <main>
      <section class="card">
        <h2><AiI18nT key="欢迎使用 nuxt-ai-i18n" /></h2>
        <p><AiI18nT key="这是一个基于 AI 的 Nuxt3 国际化插件演示。你只需要在代码中直接写中文，插件会自动帮你翻译成其他语言。" /></p>
        
        <div class="demo-grid">
          <div class="demo-item">
            <label>{{ $t('按钮示例') }}:</label>
            <button class="btn-primary">{{ $t('提交订单') }}</button>
          </div>
          <div class="demo-item">
            <label>{{ $t('输入框示例') }}:</label>
            <input type="text" :placeholder="$t('请输入您的用户名')" />
          </div>
        </div>
      </section>

      <section class="card">
        <h2><AiI18nT key="如何工作？" /></h2>
        <ul>
          <li><strong><AiI18nT key="开发阶段" /></strong>: <AiI18nT key="直接使用 $t('中文') 或 <AiI18nT key='...' /> 组件。" /></li>
          <li><strong><AiI18nT key="运行阶段" /></strong>: <AiI18nT key="如果翻译缺失，插件会自动调用 AI 进行翻译并保存到本地 JSON。" /></li>
          <li><strong><AiI18nT key="校对阶段" /></strong>: <AiI18nT key="开启编辑模式，直接在页面上点击带有黄色虚线的文字进行人工修正。" /></li>
        </ul>
      </section>
    </main>

    <!-- Visual Editor Component from Module -->
    <AiI18nVisualEditor />

    <footer>
      <p>&copy; 2024 nuxt-ai-i18n Demo. <AiI18nT key="让国际化变得简单。" /></p>
    </footer>
  </div>
</template>

<script setup>
const { $t, currentLocale, setLocale, isEditing, toggleEditing } = useNuxtApp()
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #f4f7f9;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

h1 {
  margin: 0;
  font-size: 24px;
}

.controls {
  display: flex;
  gap: 12px;
}

select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

button {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #007bff;
  background: white;
  color: #007bff;
  cursor: pointer;
  transition: all 0.2s;
}

button.active {
  background: #007bff;
  color: white;
}

.card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  margin-bottom: 24px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
  border-left: 4px solid #007bff;
  padding-left: 12px;
}

.demo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.demo-item label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  width: 100%;
}

input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
}

ul {
  padding-left: 20px;
  line-height: 1.6;
}

footer {
  text-align: center;
  margin-top: 40px;
  color: #999;
  font-size: 14px;
}
</style>
