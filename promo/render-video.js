// Renders x3-padel-suardi-promo.html into x3-padel-suardi-promo.webm
// by driving headless Chromium frame-by-frame (deterministic timeline via
// window.__seek(t)) and piping JPEG frames into ffmpeg (VP8/WebM).
//
// Requirements: `npm i -D playwright` (with chromium installed) and an
// ffmpeg build with libvpx. Usage: node render-video.js [durationSeconds]
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright');

const FPS = 25;
const DURATION = Number(process.argv[2] || 25);
const TOTAL_FRAMES = FPS * DURATION;
const WIDTH = 1080;
const HEIGHT = 1920;
const HTML_PATH = 'file://' + path.resolve(__dirname, 'x3-padel-suardi-promo.html');
const OUT = path.resolve(__dirname, 'x3-padel-suardi-promo.webm');
const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
  await page.addInitScript(() => { window.__CAPTURE_MODE__ = true; });
  await page.goto(HTML_PATH);
  await page.waitForFunction(() => typeof window.__seek === 'function');
  await page.waitForTimeout(300);

  const ff = spawn(FFMPEG, [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-framerate', String(FPS),
    '-i', 'pipe:0',
    '-c:v', 'libvpx',
    '-b:v', '4M',
    '-pix_fmt', 'yuv420p',
    OUT
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const t = i / FPS;
    await page.evaluate((tt) => window.__seek(tt), t);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    const ok = ff.stdin.write(buf);
    if (!ok) await new Promise(res => ff.stdin.once('drain', res));
    if (i % 25 === 0) console.log('frame', i, '/', TOTAL_FRAMES);
  }
  ff.stdin.end();
  await new Promise((res) => ff.on('close', res));

  await browser.close();
  console.log('DONE ->', OUT);
})().catch(e => { console.error(e); process.exit(1); });
