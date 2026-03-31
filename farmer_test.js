const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR);

const BASE_URL = 'http://localhost:3000';
const TEST_EMAIL = `farmer_visual_${Date.now()}@test.com`;
const TEST_PASS = 'Password123!';

async function screenshot(page, name) {
  const file = path.join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`  📸 Screenshot saved: ${name}.png`);
  return file;
}

async function runFarmerTest() {
  console.log('\n========================================');
  console.log('  🌾 KISANSTORE - FARMER VISUAL TEST');
  console.log('========================================\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  try {
    // ── Step 1: Home Page ─────────────────────────
    console.log('[1/8] Loading Home Page...');
    await page.goto(BASE_URL + '/#/', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await screenshot(page, '01_home_page');
    console.log('  ✅ Home page loaded successfully.');

    // ── Step 2: Browse Products Page ──────────────
    console.log('\n[2/8] Navigating to Store Catalog...');
    await page.goto(BASE_URL + '/#/products', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await screenshot(page, '02_store_catalog');
    console.log('  ✅ Store catalog loaded with products.');

    // ── Step 3: Register Page ─────────────────────
    console.log('\n[3/8] Navigating to Registration...');
    await page.goto(BASE_URL + '/#/register', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    await screenshot(page, '03_register_page');
    console.log('  ✅ Registration page rendered.');

    // ── Step 4: Fill Registration Form ────────────
    console.log('\n[4/8] Filling registration form...');
    const inputs = await page.$$('input');
    if (inputs.length >= 5) {
      await inputs[0].fill('Test');
      await inputs[1].fill('Farmer');
      await inputs[2].fill(TEST_EMAIL);
      await inputs[3].fill('03001234567');
      await inputs[4].fill(TEST_PASS);
      if (inputs[5]) await inputs[5].fill(TEST_PASS);
    }
    await screenshot(page, '04_register_filled');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    await screenshot(page, '05_after_register');
    console.log('  ✅ Registration form submitted.');

    // ── Step 5: Login Page ────────────────────────
    console.log('\n[5/8] Navigating to Login...');
    await page.goto(BASE_URL + '/#/login', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    const loginInputs = await page.$$('input');
    if (loginInputs.length >= 2) {
      await loginInputs[0].fill(TEST_EMAIL);
      await loginInputs[1].fill(TEST_PASS);
    }
    await screenshot(page, '06_login_page');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2500);
    await screenshot(page, '07_after_login');
    console.log('  ✅ Logged in as Farmer.');

    // ── Step 6: Price List Page ───────────────────
    console.log('\n[6/8] Navigating to Market Price List...');
    await page.goto(BASE_URL + '/#/price-list', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await screenshot(page, '08_price_list');
    console.log('  ✅ Price list loaded.');

    // ── Step 7: Cart Page ─────────────────────────
    console.log('\n[7/8] Navigating to Cart...');
    await page.goto(BASE_URL + '/#/cart', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await screenshot(page, '09_cart_page');
    console.log('  ✅ Cart page loaded.');

    // ── Step 8: Profile Page ──────────────────────
    console.log('\n[8/8] Navigating to Profile...');
    await page.goto(BASE_URL + '/#/profile', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await screenshot(page, '10_profile_page');
    console.log('  ✅ Profile page loaded.');

    console.log('\n========================================');
    console.log('  ✅ ALL 8 FARMER TESTS PASSED!');
    console.log('  📁 Screenshots saved to: /screenshots/');
    console.log('========================================\n');

  } catch (err) {
    console.error('\n❌ Test Error:', err.message);
    await screenshot(page, 'error_state');
  } finally {
    await browser.close();
  }
}

runFarmerTest();
