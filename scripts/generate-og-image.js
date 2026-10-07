const sharp = require('sharp')

const W = 1200
const H = 630
const gridLines = Array.from({ length: 22 }, (_, i) => {
  const y = i * 56
  return `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`
}).join('')

const svg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#eef2ff"/>
      <stop offset="1" stop-color="#dbe4ff"/>
    </linearGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2563eb"/>
      <stop offset="1" stop-color="#4f46e5"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g opacity="0.08" stroke="#2b5cf6" stroke-width="1">${gridLines}</g>
  <circle cx="600" cy="200" r="95" fill="white" opacity="0.95"/>
  <text x="600" y="470" text-anchor="middle" font-family="Verdana, Geneva, DejaVu Sans, sans-serif" font-size="72" font-weight="bold" fill="#0f172a">NextVenture Tech</text>
  <text x="600" y="540" text-anchor="middle" font-family="Verdana, Geneva, DejaVu Sans, sans-serif" font-size="32" fill="#2563eb">Transformer vos idées en réalité</text>
</svg>`)

;(async () => {
  const logo = await sharp('public/logo/nextventure-logo-light.svg', { density: 300 })
    .resize(160, 160, { fit: 'inside' })
    .png()
    .toBuffer()

  await sharp(svg)
    .composite([{ input: logo, top: 121, left: 521 }])
    .png()
    .toFile('public/og-image.png')

  const meta = await sharp('public/og-image.png').metadata()
  console.log(`OK ${meta.width}x${meta.height}`)
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
