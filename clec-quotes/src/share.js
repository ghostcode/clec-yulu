// 语录分享工具：Canvas 生成图片、复制文字、复制/保存图片
import { categories } from './quotes.js'

const PAPER = '#f4ecd8'
const PAPER_CARD = '#fbf6e9'
const INK = '#211a12'
const INK_SOFT = '#4a3f30'
const INK_FAINT = '#8a7a5f'
const GOLD = '#b8881f'
const GOLD_BRIGHT = '#d4a935'
const SEAL = '#9e2b25'

const catName = (key) => (categories.find((c) => c.key === key) || {}).name || ''

function wrapText(ctx, text, maxWidth) {
  const lines = []
  let line = ''
  for (const ch of text) {
    const test = line + ch
    if (line && ctx.measureText(test).width > maxWidth) {
      lines.push(line)
      line = ch
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

// 生成语录卡片图片（返回 canvas）
export function buildQuoteCanvas(quote, scale = 2) {
  const W = 1080
  const H = 1350
  const canvas = document.createElement('canvas')
  canvas.width = W * scale
  canvas.height = H * scale
  const ctx = canvas.getContext('2d')
  ctx.scale(scale, scale)

  // 背景：宣纸渐变
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, PAPER_CARD)
  bg.addColorStop(1, PAPER)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // 暖金光晕
  const glow = ctx.createRadialGradient(W * 0.5, H * 0.32, 60, W * 0.5, H * 0.32, W * 0.7)
  glow.addColorStop(0, 'rgba(184,136,31,0.10)')
  glow.addColorStop(1, 'rgba(184,136,31,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  const M = 70 // 外边距

  // 双线金边
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 3
  ctx.strokeRect(M, M, W - M * 2, H - M * 2)
  ctx.lineWidth = 1
  ctx.strokeRect(M + 12, M + 12, W - (M + 12) * 2, H - (M + 12) * 2)

  // 顶部品牌行
  ctx.textAlign = 'center'
  ctx.fillStyle = GOLD
  ctx.font = '600 30px "Noto Serif SC", serif'
  ctx.fillText('C L E C   投 资 语 录', W / 2, M + 70)

  // 红色印章
  const sealX = W / 2
  const sealY = M + 120
  const sr = 34
  ctx.fillStyle = SEAL
  roundRect(ctx, sealX - sr, sealY - sr, sr * 2, sr * 2, 8)
  ctx.fill()
  ctx.fillStyle = '#fdf6e3'
  ctx.font = '700 34px "Noto Serif SC", serif'
  ctx.fillText('富', sealX, sealY + 12)

  // 分类标签
  ctx.fillStyle = INK_FAINT
  ctx.font = '500 26px "Noto Sans SC", sans-serif'
  ctx.fillText(`— ${catName(quote.category)} —`, W / 2, sealY + sr + 44)

  // 引文（大号衬线）
  ctx.fillStyle = INK
  const fontSize = quote.text.length > 40 ? 46 : 58
  ctx.font = `600 ${fontSize}px "Noto Serif SC", serif`
  const maxW = W - M * 2 - 80
  const lines = wrapText(ctx, quote.text, maxW)
  const lineH = fontSize * 1.5
  const blockH = lines.length * lineH
  let y = H * 0.5 - blockH / 2 + lineH * 0.7
  // 开头引号装饰
  ctx.textAlign = 'left'
  ctx.fillStyle = GOLD_BRIGHT
  ctx.font = `700 80px "Noto Serif SC", serif`
  ctx.fillText('“', M + 36, y - lineH * 0.4)
  ctx.textAlign = 'center'
  ctx.fillStyle = INK
  ctx.font = `600 ${fontSize}px "Noto Serif SC", serif`
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], W / 2, y)
    y += lineH
  }

  // 出处
  ctx.fillStyle = INK_SOFT
  ctx.font = '400 26px "Noto Serif SC", serif'
  ctx.fillText(quote.source || '', W / 2, H - M - 96)

  // 底部分隔线 + 品牌
  ctx.strokeStyle = 'rgba(33,26,18,0.15)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(W / 2 - 60, H - M - 70)
  ctx.lineTo(W / 2 + 60, H - M - 70)
  ctx.stroke()
  ctx.fillStyle = INK_FAINT
  ctx.font = '400 22px "Noto Sans SC", sans-serif'
  ctx.fillText('理财圣经 CLEC 版 · CLEC 宝典', W / 2, H - M - 42)

  return canvas
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'))
}

export function downloadCanvas(canvas, filename = 'clec-quote.png') {
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }, 'image/png')
}

// 生成可长按保存/复制的图片地址（移动端标准做法）
export function canvasToPreviewURL(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob ? URL.createObjectURL(blob) : '')
    }, 'image/png')
  })
}

export async function copyImageToClipboard(canvas) {
  const blob = await canvasToBlob(canvas)
  if (navigator.clipboard && window.ClipboardItem) {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    return true
  }
  return false
}

export function quoteShareText(quote) {
  return `“${quote.text}”\n—— ${quote.source}\n\n#投资语录 #CLEC理财圣经`
}
