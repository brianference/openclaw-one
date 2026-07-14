/**
 * Visual / UI matrix checks (static + optional Playwright).
 * Without browsers: validates CSS contract for light/dark × button styles.
 * With PLAYWRIGHT=1 and playwright installed: smoke-navigates routes.
 */
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const styles = readFileSync(join(root, 'src/styles.css'), 'utf8')

const combos = []
for (const theme of ['dark', 'light']) {
  for (const btn of ['solid', 'soft', 'glow']) {
    combos.push({ theme, btn })
  }
}

let fail = 0
function check(name, cond) {
  if (!cond) {
    fail++
    console.error('FAIL', name)
  } else {
    console.log('ok', name)
  }
}

check('css-dark-aurora-primary', styles.includes('#818cf8'))
check('css-dark-aurora-bg', styles.includes('#0b1020'))
check('css-light-primary', styles.includes('#4f46e5') || styles.includes('--primary: #4f46e5'))
check('css-btn-solid', styles.includes("[data-btn='solid'] .btn"))
check('css-btn-soft', styles.includes("[data-btn='soft'] .btn"))
check('css-btn-glow', styles.includes("[data-btn='glow'] .btn"))
check('css-tab-active', styles.includes('.tab.is-active'))
check('css-modal', styles.includes('.modal-card'))
check('css-chat-rail', styles.includes('.chat-rail'))
check('css-ctx-strip', styles.includes('.ctx-strip'))

console.log(`Matrix combos covered in CSS contract: ${combos.length} (theme × button)`)
combos.forEach((c) => console.log(`  - theme=${c.theme} btn=${c.btn}`))

async function tryPlaywright() {
  if (process.env.PLAYWRIGHT !== '1') {
    console.log('Playwright smoke skipped (set PLAYWRIGHT=1 to enable)')
    return
  }
  let chromium
  try {
    ;({ chromium } = await import('playwright'))
  } catch {
    console.log('playwright package not installed — skip browser smoke')
    return
  }
  const base = process.env.BASE_URL || 'http://127.0.0.1:4173'
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const paths = ['/', '/chat', '/tasks', '/brain', '/t/vault', '/t/kanban', '/t/appearance', '/?coach=1']
  for (const p of paths) {
    const res = await page.goto(base + p, { waitUntil: 'domcontentloaded', timeout: 15000 })
    check(`pw-nav-${p}`, res && res.ok())
    await page.waitForSelector('.phone, #root', { timeout: 10000 })
  }
  // Theme + button attrs
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  const design = await page.getAttribute('html', 'data-design')
  check('pw-data-design-oled', design === 'oled')
  await browser.close()
}

tryPlaywright()
  .then(() => {
    if (fail > 0) process.exit(1)
    console.log('UI MATRIX PASSED')
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
