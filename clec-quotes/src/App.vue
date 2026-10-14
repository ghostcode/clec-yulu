<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { quotes, categories } from './quotes.js'

// 分类配色（墨金体系内的低饱和点缀色）
const ACCENTS = {
  awakening: '#b8881f',
  happiness: '#9e2b25',
  vehicle: '#2f6f5e',
  discipline: '#3a5a8c',
  risk: '#a8431f',
  leverage: '#6b4e9e',
  noise: '#5a6b73',
  compound: '#c79a1e',
  trend: '#4a7c59',
  legacy: '#8a5a2b',
}
function accent(key) {
  return ACCENTS[key] || '#b8881f'
}
function countOf(key) {
  return quotes.filter((q) => q.category === key).length
}
import {
  buildQuoteCanvas,
  downloadCanvas,
  canvasToPreviewURL,
  canvasToDataURL,
  copyImageToClipboard,
  copyTextToClipboard,
  quoteShareText,
} from './share.js'

const search = ref('')
const activeCat = ref(null)
const selected = ref(null)
const toast = ref('')
let toastTimer = null

// 移动端检测：触屏设备不支持 <a download> 与图片剪贴板，改用长按保存
const isTouch =
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(hover: none) and (pointer: coarse)').matches ||
    'ontouchstart' in window)

// 微信环境：长按保存只识别 data: 图片，且文字需 execCommand 降级
const isWeChat =
  typeof navigator !== 'undefined' &&
  /MicroMessenger/i.test(navigator.userAgent || '')

// 移动端图片预览（长按保存/拷贝）
const previewSrc = ref('')
const showPreview = ref(false)

const catMap = Object.fromEntries(categories.map((c) => [c.key, c]))

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return quotes.filter((item) => {
    if (activeCat.value && item.category !== activeCat.value) return false
    if (!q) return true
    const hay = (item.text + item.source + (catMap[item.category]?.name || '')).toLowerCase()
    return hay.includes(q)
  })
})

function catOf(key) {
  return catMap[key] || { name: '', key: '' }
}

function openQuote(item) {
  selected.value = item
}

function closeQuote() {
  selected.value = null
  showPreview.value = false
}

function pickRandom() {
  const pool = filtered.value.length ? filtered.value : quotes
  const item = pool[Math.floor(Math.random() * pool.length)]
  openQuote(item)
}

function showToast(msg) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 2200)
}

async function copyText() {
  if (!selected.value) return
  const ok = await copyTextToClipboard(quoteShareText(selected.value))
  showToast(ok ? '已复制语录文字 ✓' : '复制失败，请长按文字手动复制')
}

// 触屏端：展示语录图片，由用户长按保存/拷贝
async function showImagePreview(quote, hint) {
  // 微信只识别 data: 图片，其它移动端用 blob: 更省内存
  const canvas = await buildQuoteCanvas(quote, isWeChat ? 1 : 2)
  previewSrc.value = isWeChat ? canvasToDataURL(canvas) : await canvasToPreviewURL(canvas)
  showPreview.value = true
  showToast(hint)
}

async function copyImage() {
  if (!selected.value) return
  if (isTouch) {
    await showImagePreview(
      selected.value,
      isWeChat ? '长按图片可「拷贝 / 发送给朋友」' : '请长按图片选择「拷贝」'
    )
    return
  }
  const canvas = await buildQuoteCanvas(selected.value)
  const ok = await copyImageToClipboard(canvas)
  showToast(ok ? '已复制图片到剪贴板 ✓' : '当前环境不支持复制图片，已改为下载')
  if (!ok) downloadCanvas(canvas, `clec-quote-${selected.value.id}.png`)
}

async function saveImage() {
  if (!selected.value) return
  if (isTouch) {
    await showImagePreview(
      selected.value,
      isWeChat ? '长按图片「保存到相册」' : '请长按图片「存储到照片」'
    )
    return
  }
  const canvas = await buildQuoteCanvas(selected.value)
  downloadCanvas(canvas, `clec-quote-${selected.value.id}.png`)
  showToast('图片已保存 ✓')
}

watch(selected, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})

onMounted(() => {
  const id = new URLSearchParams(location.search).get('q')
  if (id) {
    const item = quotes.find((q) => String(q.id) === String(id))
    if (item) selected.value = item
  }
})
</script>

<template>
  <div class="page">
    <!-- 顶部品牌 -->
    <header class="hero">
      <div class="seal">富</div>
      <h1 class="title">投资语录</h1>
      <p class="subtitle">CLEC · 理财圣经 &nbsp;|&nbsp; 穿越周期的投资智慧</p>
      <p class="motto">富有是天赋，快乐是人权</p>
    </header>

    <!-- 工具条 -->
    <div class="toolbar">
      <div class="search-box">
        <span class="search-icon">⌕</span>
        <input v-model="search" type="text" placeholder="搜索语录、出处或主题…" />
      </div>
      <button class="random-btn" @click="pickRandom">🎲 随机一条</button>
    </div>

    <!-- 分类筛选 -->
    <div class="chips">
      <button class="chip" :class="{ on: activeCat === null }" @click="activeCat = null">
        全部 <em>{{ quotes.length }}</em>
      </button>
      <button
        v-for="c in categories"
        :key="c.key"
        class="chip"
        :class="{ on: activeCat === c.key }"
        :style="{ '--accent': accent(c.key) }"
        @click="activeCat = activeCat === c.key ? null : c.key"
      >
        {{ c.name }} <em>{{ countOf(c.key) }}</em>
      </button>
    </div>

    <!-- 卡片网格 -->
    <main class="grid">
      <article
        v-for="item in filtered"
        :key="item.id"
        class="card"
        :style="{ '--accent': accent(item.category) }"
        @click="openQuote(item)"
      >
        <div class="card-top">
          <span class="dot"></span>
          <span class="cat">{{ catOf(item.category).name }}</span>
        </div>
        <p class="quote">{{ item.text }}</p>
        <div class="card-bottom">
          <span class="source">{{ item.source }}</span>
          <button class="share-ico" title="分享" @click.stop="openQuote(item)">⇪</button>
        </div>
      </article>
    </main>

    <p v-if="!filtered.length" class="empty">没有匹配的语录，换个关键词试试。</p>

    <footer class="foot">
      <p>语录选自《理财圣经 CLEC 版 v3.4.1》与《CLEC 宝典 V1.14.2》</p>
      <p class="links">
        友情链接：
        <a href="https://clec168.com/" target="_blank" rel="noopener noreferrer">CLEC 官网</a>
      </p>
      <p class="disclaim">内容仅供学习与投资教育探讨，不构成任何投资建议。</p>
    </footer>

    <!-- 详情弹窗 -->
    <transition name="fade">
      <div v-if="selected" class="overlay" @click.self="closeQuote">
        <div class="modal">
          <button class="close" @click="closeQuote">✕</button>

          <div class="modal-body">
            <div class="bigcard" :style="{ '--accent': accent(selected.category) }">
              <div class="bigcard-top">
                <span class="dot"></span>
                <span class="cat">{{ catOf(selected.category).name }}</span>
              </div>
              <p class="bigquote">{{ selected.text }}</p>
              <p class="bigsource">{{ selected.source }}</p>
            </div>

            <div class="actions">
              <button @click="copyText">复制文字</button>
              <button @click="copyImage">复制图片</button>
              <button @click="saveImage">保存图片</button>
            </div>

            <div v-if="showPreview" class="preview-wrap">
              <p class="preview-hint">长按上方图片即可保存或拷贝</p>
              <img v-if="previewSrc" :src="previewSrc" alt="语录卡片" class="preview-img" />
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="toast">
  <div v-if="toast" class="toast">{{ toast }}</div>
  </transition>
  </div>
</template>

<style scoped>
.page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 20px 80px;
}

/* 顶部品牌 */
.hero {
  text-align: center;
  padding: 54px 16px 30px;
  position: relative;
}
.seal {
  width: 64px;
  height: 64px;
  margin: 0 auto 18px;
  border-radius: 14px;
  background: var(--seal);
  color: #fdf6e3;
  font-family: var(--serif);
  font-weight: 700;
  font-size: 38px;
  line-height: 64px;
  box-shadow: 0 6px 18px rgba(158, 43, 37, 0.35);
  transform: rotate(-4deg);
}
.title {
  font-family: var(--serif);
  font-weight: 700;
  font-size: clamp(34px, 6vw, 52px);
  letter-spacing: 0.18em;
  color: var(--ink);
}
.subtitle {
  margin-top: 10px;
  color: var(--ink-soft);
  font-size: 14px;
  letter-spacing: 0.08em;
}
.motto {
  margin-top: 16px;
  display: inline-block;
  font-family: var(--serif);
  font-size: 18px;
  color: var(--gold);
  letter-spacing: 0.1em;
  padding: 6px 18px;
  border-top: 1px solid rgba(184, 136, 31, 0.4);
  border-bottom: 1px solid rgba(184, 136, 31, 0.4);
}

/* 工具条 */
.toolbar {
  display: flex;
  gap: 12px;
  margin: 18px 0 14px;
  flex-wrap: wrap;
}
.search-box {
  flex: 1;
  min-width: 220px;
  display: flex;
  align-items: center;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0 16px;
  box-shadow: var(--shadow-soft);
}
.search-icon {
  color: var(--ink-faint);
  font-size: 18px;
  margin-right: 8px;
}
.search-box input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 12px 0;
  font-size: 15px;
  color: var(--ink);
}
.random-btn {
  background: var(--ink);
  color: var(--paper);
  border-radius: 999px;
  padding: 0 22px;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.04em;
  box-shadow: var(--shadow-soft);
  transition: transform 0.15s, background 0.2s;
}
.random-btn:hover {
  background: var(--gold);
  transform: translateY(-1px);
}

/* 分类筛选 */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-bottom: 26px;
}
.chip {
  --accent: var(--gold);
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--ink-soft);
  padding: 7px 15px;
  border-radius: 999px;
  font-size: 13.5px;
  transition: all 0.18s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.chip em {
  font-style: normal;
  font-size: 11px;
  color: var(--ink-faint);
  background: rgba(33, 26, 18, 0.06);
  padding: 1px 7px;
  border-radius: 999px;
}
.chip:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.chip.on {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
.chip.on em {
  color: #fff;
  background: rgba(255, 255, 255, 0.22);
}

/* 卡片网格 */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.card {
  --accent: var(--gold);
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 22px 22px 18px;
  cursor: pointer;
  position: relative;
  box-shadow: var(--shadow-soft);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  border-top: 3px solid var(--accent);
  display: flex;
  flex-direction: column;
  min-height: 210px;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
  border-color: rgba(184, 136, 31, 0.4);
}
.card-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}
.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--accent);
  flex: none;
}
.cat {
  font-size: 13px;
  color: var(--accent);
  font-weight: 600;
  letter-spacing: 0.06em;
}
.quote {
  font-family: var(--serif);
  font-size: 18.5px;
  line-height: 1.95;
  color: var(--ink);
  flex: 1;
  position: relative;
  padding-left: 14px;
}
.quote::before {
  content: '“';
  position: absolute;
  left: -6px;
  top: -10px;
  font-family: var(--serif);
  font-size: 40px;
  color: rgba(184, 136, 31, 0.35);
  line-height: 1;
}
.card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed var(--line);
}
.source {
  font-size: 12.5px;
  color: var(--ink-faint);
}
.share-ico {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(184, 136, 31, 0.12);
  color: var(--gold);
  font-size: 15px;
  display: grid;
  place-items: center;
  transition: background 0.18s;
}
.share-ico:hover {
  background: var(--gold);
  color: #fff;
}

.empty {
  text-align: center;
  color: var(--ink-faint);
  padding: 60px 0;
  font-family: var(--serif);
}

/* 页脚 */
.foot {
  margin-top: 56px;
  text-align: center;
  color: var(--ink-faint);
  font-size: 13px;
  line-height: 1.9;
}
.foot .links {
  margin: 6px 0;
}
.foot .links a {
  color: var(--gold);
  text-decoration: none;
  border-bottom: 1px solid rgba(184, 136, 31, 0.45);
  padding-bottom: 1px;
  transition: color 0.2s, border-color 0.2s;
}
.foot .links a:hover {
  color: var(--seal);
  border-color: var(--seal);
}
.foot .disclaim {
  font-size: 11.5px;
  opacity: 0.8;
}

/* 弹窗 */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 14, 8, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 50;
}
.modal {
  position: relative;
  width: min(560px, 100%);
}
.modal-body {
  max-height: 92vh;
  overflow: auto;
}
.close {
  position: absolute;
  top: -14px;
  right: -6px;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: var(--card);
  color: var(--ink);
  font-size: 16px;
  display: grid;
  place-items: center;
  line-height: 1;
  box-shadow: var(--shadow);
  z-index: 2;
}
.bigcard {
  --accent: var(--gold);
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 38px 34px 30px;
  border-top: 4px solid var(--accent);
  box-shadow: var(--shadow);
}
.bigcard-top {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 22px;
}
.bigquote {
  font-family: var(--serif);
  font-size: 27px;
  line-height: 1.9;
  color: var(--ink);
  letter-spacing: 0.01em;
  position: relative;
  padding-left: 18px;
}
.bigquote::before {
  content: '“';
  position: absolute;
  left: -10px;
  top: -14px;
  font-family: var(--serif);
  font-size: 60px;
  color: rgba(184, 136, 31, 0.35);
  line-height: 1;
}
.bigsource {
  margin-top: 24px;
  font-size: 14px;
  color: var(--ink-faint);
  text-align: right;
  font-family: var(--serif);
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
  justify-content: center;
}
.actions button {
  background: var(--card);
  border: 1px solid var(--line);
  color: var(--ink-soft);
  padding: 11px 18px;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.18s;
}
.actions button:hover {
  border-color: var(--gold);
  color: var(--gold);
  transform: translateY(-1px);
}

/* 移动端图片预览（长按保存/拷贝） */
.preview-wrap {
  margin-top: 18px;
  text-align: center;
}
.preview-hint {
  font-size: 13px;
  color: var(--ink-faint);
  margin-bottom: 12px;
  letter-spacing: 0.04em;
}
.preview-img {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  border: 1px solid var(--line);
  -webkit-touch-callout: default;
  user-select: none;
}

/* Toast */
.toast {
  position: fixed;
  left: 50%;
  bottom: 40px;
  transform: translateX(-50%);
  background: var(--ink);
  color: var(--paper);
  padding: 12px 24px;
  border-radius: 999px;
  font-size: 14px;
  z-index: 80;
  box-shadow: var(--shadow);
}

/* 过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 16px);
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .bigquote {
    font-size: 23px;
  }
}
</style>
