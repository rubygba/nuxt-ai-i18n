# nuxt-ai-i18n

**AI 主导、真人批注的 Nuxt3 多语言基建**

这是一个专为 AI-Native 开发模式设计的 Nuxt3 国际化插件。它颠覆了传统手动维护 Key 的繁琐流程，让开发者（或 AI Agent）直接以自然语言（中文）作为 Key，由插件在构建或运行时自动完成翻译。

## 核心特性

1.  **AI 零心智负担**：直接在代码中使用 `$t('中文')` 或 `<AiI18nT key="中文" />`。
2.  **自动翻译 (AI-Powered)**：当检测到缺失的翻译条目时，插件会自动调用 LLM (如 GPT-4) 进行翻译并持久化到本地 JSON。
3.  **Visual Editor 批注层**：内置可视化编辑模式。开启后，页面上所有 AI 生成的翻译都会以黄色虚线标出，点击即可直接修改并保存。
4.  **数据回流**：人工修正后的翻译会实时更新到本地字典文件，实现“AI 预填，人工校验”的闭环。

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

在根目录或 `playground` 目录创建 `.env` 文件：

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
```

### 3. 运行 Demo

```bash
cd playground
pnpm dev
```

## 使用指南

### 开发模式

在 Vue 组件中直接书写：

```vue
<template>
  <div>
    <!-- 方式 A: 使用 $t 函数 -->
    <h1>{{ $t('欢迎来到我的网站') }}</h1>
    
    <!-- 方式 B: 使用组件 (支持可视化高亮) -->
    <AiI18nT key="这是一个 AI 驱动的演示" />
    
    <button>{{ $t('提交订单') }}</button>
  </div>
</template>
```

### 翻译校对

1.  点击页面上的“进入编辑模式”按钮。
2.  AI 自动生成的翻译会显示**黄色虚线**。
3.  点击该文字，在弹出的悬浮窗中修改翻译。
4.  点击“保存并验证”，翻译将变为**绿色实线**（已人工审核状态）。

## 项目结构

- `packages/nuxt-ai-i18n`: 核心 Nuxt Module 源码。
- `playground`: 演示项目，展示了如何集成和使用该插件。
- `locales/`: 自动生成的字典文件存放位置。

## 许可证

MIT
