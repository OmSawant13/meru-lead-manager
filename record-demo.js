import { chromium } from 'playwright-core';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const VIDEO_DIR = path.resolve('./temp-video');
const FINAL_MP4 = path.resolve('./demo.mp4');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function smoothMouseMove(page, targetX, targetY, steps = 15) {
  await page.mouse.move(targetX, targetY, { steps });
}

async function moveAndClick(page, selectorOrLocator, options = {}) {
  const loc = typeof selectorOrLocator === 'string' ? page.locator(selectorOrLocator) : selectorOrLocator;
  await loc.waitFor({ state: 'visible', timeout: 8000 });
  const box = await loc.boundingBox();
  if (!box) return;
  const targetX = box.x + box.width / 2;
  const targetY = box.y + box.height / 2;
  await smoothMouseMove(page, targetX, targetY, options.steps || 18);
  await sleep(150);
  await page.mouse.down();
  await sleep(100);
  await page.mouse.up();
  await sleep(options.postDelay || 500);
}

async function runDemo() {
  console.log('🎬 Starting cinematic high-definition demo walkthrough recording...');

  if (fs.existsSync(VIDEO_DIR)) {
    fs.rmSync(VIDEO_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(VIDEO_DIR, { recursive: true });

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--window-size=1440,900',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1440, height: 900 },
    },
  });

  // Inject animated virtual cursor and RAF heartbeat to ensure continuous frame generation
  await context.addInitScript(() => {
    window.addEventListener('DOMContentLoaded', () => {
      const cursor = document.createElement('div');
      cursor.id = 'cinematic-cursor';
      cursor.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 22px; height: 22px;
        border-radius: 50%;
        background: rgba(99, 102, 241, 0.65);
        border: 2.5px solid #ffffff;
        box-shadow: 0 0 14px rgba(99, 102, 241, 0.9), 0 3px 6px rgba(0,0,0,0.35);
        pointer-events: none;
        z-index: 9999999;
        transform: translate(-50%, -50%);
        transition: transform 0.08s ease-out, background 0.15s, box-shadow 0.15s;
      `;
      document.body.appendChild(cursor);

      window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });

      window.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.72)';
        cursor.style.background = 'rgba(239, 68, 68, 0.95)';
        cursor.style.boxShadow = '0 0 18px rgba(239, 68, 68, 0.95)';
      });

      window.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.background = 'rgba(99, 102, 241, 0.65)';
        cursor.style.boxShadow = '0 0 14px rgba(99, 102, 241, 0.9), 0 3px 6px rgba(0,0,0,0.35)';
      });

      // Subtle heartbeat ticker ensures headless browser produces smooth continuous video
      const ticker = document.createElement('div');
      ticker.style.cssText = 'position:fixed;bottom:0;right:0;width:1px;height:1px;opacity:0.01;pointer-events:none;';
      document.body.appendChild(ticker);
      let tick = 0;
      function animate() {
        tick = (tick + 1) % 4;
        ticker.style.transform = `translateY(${tick}px)`;
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    });
  });

  const page = await context.newPage();

  console.log('📍 1. Navigating to LeadFlow CRM...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sleep(1500);

  // Check if on login page
  const demoBtn = page.locator('button:has-text("Launch Demo Account")');
  if (await demoBtn.isVisible()) {
    console.log('🔑 2. Signing in as Aarav Sharma via 1-Click Demo Launcher...');
    await moveAndClick(page, demoBtn, { postDelay: 2500 });
  }

  // Wait for Dashboard to render
  console.log('📊 3. Displaying Floating Bento Dashboard & Pipeline Analytics...');
  await page.waitForSelector('text=Your pipeline at a glance', { timeout: 10000 });
  await smoothMouseMove(page, 720, 250, 20);
  await sleep(3000);

  // Interactive KPI Cards: Filter by Qualified
  console.log('🎯 4. Interactive KPI Bento Card: Isolating Qualified Deals...');
  const qualifiedCard = page.locator('button:has-text("Qualified")').first();
  await moveAndClick(page, qualifiedCard, { postDelay: 2500 });

  // Filter by Closed / Lost
  console.log('🎯 5. Interactive KPI Bento Card: Isolating Closed / Lost...');
  const lostCard = page.locator('button:has-text("Closed / Lost")').first();
  await moveAndClick(page, lostCard, { postDelay: 2500 });

  // Reset to Total Pipeline
  console.log('🎯 6. Resetting to Total Pipeline...');
  const totalCard = page.locator('button:has-text("Total Pipeline")').first();
  await moveAndClick(page, totalCard, { postDelay: 2000 });

  // Dark & Light Mode Demonstration
  console.log('🌗 7. Demonstrating Dark & Light Theme Switcher...');
  const themeToggle = page.locator('header button[title*="Mode"]');
  if (await themeToggle.isVisible()) {
    await moveAndClick(page, themeToggle, { postDelay: 3500 }); // Switch to crisp light mode
    await moveAndClick(page, themeToggle, { postDelay: 2500 }); // Switch back to obsidian dark mode
  }

  // Real-time Search Demonstration
  console.log('🔎 8. Demonstrating Real-time Debounced Search...');
  const searchInput = page.locator('header input[placeholder*="Search"]');
  if (await searchInput.isVisible()) {
    await moveAndClick(page, searchInput, { postDelay: 400 });
    await searchInput.type('Priya', { delay: 140 });
    await sleep(2500);
    await searchInput.fill('');
    await sleep(1500);
  }

  // Lead Dossier Slide-Over Drawer
  console.log('📂 9. Opening 620px Lead Dossier Slide-over Drawer...');
  const firstLeadRow = page.locator('tbody tr').first();
  if (await firstLeadRow.isVisible()) {
    await moveAndClick(page, firstLeadRow, { postDelay: 3000 });

    // Scroll inside drawer to view details
    await smoothMouseMove(page, 1150, 450, 15);
    await sleep(1500);

    // Test Copy Email
    const copyBtn = page.locator('button[title*="Copy email"]');
    if (await copyBtn.isVisible()) {
      await moveAndClick(page, copyBtn, { postDelay: 1500 });
    }

    // Close dossier
    const closeBtn = page.locator('button:has-text("Close Dossier")');
    if (await closeBtn.isVisible()) {
      await moveAndClick(page, closeBtn, { postDelay: 2000 });
    }
  }

  // Capture New Lead Modal
  console.log('✨ 10. Capturing a New Enterprise Lead (Aman Gupta / boAt)...');
  const captureBtn = page.locator('header button:has-text("Capture Lead")');
  if (await captureBtn.isVisible()) {
    await moveAndClick(page, captureBtn, { postDelay: 1500 });

    const nameInput = page.locator('input[placeholder*="Rajesh"]');
    await moveAndClick(page, nameInput, { postDelay: 200 });
    await nameInput.type('Aman Gupta', { delay: 60 });

    const emailInput = page.locator('input[placeholder*="name@company.com"]');
    await moveAndClick(page, emailInput, { postDelay: 200 });
    await emailInput.type('aman.gupta@boatrockz.com', { delay: 40 });

    const phoneInput = page.locator('input[placeholder*="98234"]');
    await moveAndClick(page, phoneInput, { postDelay: 200 });
    await phoneInput.type('+91 98111 22334', { delay: 40 });

    const companyInput = page.locator('input[placeholder*="Tata"]');
    await moveAndClick(page, companyInput, { postDelay: 200 });
    await companyInput.type('boAt Lifestyle India', { delay: 50 });

    const sourceSelect = page.locator('div:has(> label:has-text("Lead Source")) select');
    await moveAndClick(page, sourceSelect, { postDelay: 200 });
    await sourceSelect.selectOption('Referral');
    await sleep(400);

    const statusSelect = page.locator('div:has(> label:has-text("Pipeline Status")) select');
    await moveAndClick(page, statusSelect, { postDelay: 200 });
    await statusSelect.selectOption('Qualified');
    await sleep(400);

    const notesInput = page.locator('textarea');
    await moveAndClick(page, notesInput, { postDelay: 200 });
    await notesInput.type('Fast-growing D2C audio electronics enterprise. Evaluating multi-seat CRM pipeline.', { delay: 25 });
    await sleep(1500);

    const saveBtn = page.locator('button[type="submit"]:has-text("Save Lead")');
    await moveAndClick(page, saveBtn, { postDelay: 3000 });
  }

  // Kanban Pipeline Board View
  console.log('📋 11. Demonstrating Dual-View Kanban Pipeline Board...');
  const pipelineTab = page.locator('button[title="Pipeline Board View"]');
  if (await pipelineTab.isVisible()) {
    await moveAndClick(page, pipelineTab, { postDelay: 4000 });
    // Smoothly pan cursor across columns
    await smoothMouseMove(page, 300, 500, 12);
    await sleep(800);
    await smoothMouseMove(page, 700, 500, 12);
    await sleep(800);
    await smoothMouseMove(page, 1100, 500, 12);
    await sleep(1500);
  }

  // Switch back to Table View & Export CSV
  console.log('💾 12. Switching back to Table View & Exporting CSV...');
  const tableTab = page.locator('button[title="Table View"]');
  if (await tableTab.isVisible()) {
    await moveAndClick(page, tableTab, { postDelay: 2000 });
  }

  const exportBtn = page.locator('button:has-text("Export")');
  if (await exportBtn.isVisible()) {
    await moveAndClick(page, exportBtn, { postDelay: 2500 });
  }

  console.log('🏁 13. Completing cinematic walkthrough...');
  await smoothMouseMove(page, 720, 450, 15);
  await sleep(2500);

  const video = page.video();
  await context.close();
  await browser.close();

  if (video) {
    const rawVideoPath = await video.path();
    console.log(`📹 Raw video recorded at: ${rawVideoPath}`);

    console.log('🔄 Encoding to universal high-quality MP4 with ffmpeg...');
    execSync(`ffmpeg -y -i "${rawVideoPath}" -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -movflags +faststart "${FINAL_MP4}"`, { stdio: 'inherit' });
    console.log(`✅ Final demo video created: ${FINAL_MP4}`);

    fs.rmSync(VIDEO_DIR, { recursive: true, force: true });
  }
}

runDemo().catch((err) => {
  console.error('❌ Demo recording failed:', err);
  process.exit(1);
});
