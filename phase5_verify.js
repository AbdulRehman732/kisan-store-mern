const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

/**
 * Phase 5 Verification Script
 * This script tests the Bulk Product Operations (CSV Upload/Export)
 */
async function verifyPhase5() {
  console.log('--- PHASE 5: BULK OPERATIONS VERIFICATION ---');
  
  const BASE_URL = 'http://localhost:5000/api';
  
  try {
    // 1. Authenticate as Admin
    console.log('Step 1: Authenticating Admin...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@kisanstore.pk',
      password: 'admin123'
    });
    const token = loginRes.data.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    console.log('✅ Admin authenticated.');

    // 2. Test CSV Export
    console.log('Step 2: Testing CSV Export...');
    const exportRes = await axios.get(`${BASE_URL}/products/export-csv`, config);
    console.log('✅ Export Request Success.');
    if (!exportRes.headers['content-type'].startsWith('text/csv')) {
      throw new Error(`Invalid content type: ${exportRes.headers['content-type']}`);
    }
    const csvContent = exportRes.data;
    console.log(`✅ Received CSV content (${csvContent.length} bytes).`);

    // 3. Prepare Bulk Upload CSV
    console.log('Step 3: Preparing Bulk Upload CSV...');
    const tempCsvPath = path.join(__dirname, 'test_bulk_upload.csv');
    // Add a new unique product to the CSV for testing
    const uniqueId = Date.now();
    const newProductRow = `Test Product ${uniqueId},Fertilizer,999,50,100,per bag,TestBrand,Phase 5 Test Description,true,"Crop A, Crop B","Tag 1, Tag 2",/uploads/test.webp\n`;
    
    // Create a minimal CSV with headers and one row
    const headers = 'name,category,price,taxAmount,stock,unit,brand,description,featured,crops,tags,image\n';
    fs.writeFileSync(tempCsvPath, headers + newProductRow);
    console.log(`✅ Test CSV created at ${tempCsvPath}`);

    // 4. Test Bulk Upload
    console.log('Step 4: Testing Bulk Upload...');
    const form = new FormData();
    form.append('file', fs.createReadStream(tempCsvPath));
    
    const uploadRes = await axios.post(`${BASE_URL}/products/bulk-upload`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`✅ Bulk Upload Success: ${uploadRes.data.message}`);
    console.log(`✅ Results: Created ${uploadRes.data.results.created}, Skipped ${uploadRes.data.results.skipped}`);

    // 5. Verify the new product exists
    console.log('Step 5: Verifying product in database...');
    const searchRes = await axios.get(`${BASE_URL}/products?search=Test Product ${uniqueId}`, config);
    const found = searchRes.data.products.find(p => p.name === `Test Product ${uniqueId}`);
    if (found) {
      console.log(`✅ Product "Test Product ${uniqueId}" successfully verified in database.`);
    } else {
      throw new Error('Product not found after upload');
    }

    // Cleanup
    if (fs.existsSync(tempCsvPath)) fs.unlinkSync(tempCsvPath);
    console.log('\n--- PHASE 5 VERIFICATION COMPLETE: 100% SUCCESS ---');
    process.exit(0);
  } catch (err) {
    console.error('❌ Verification Failed:', err.response?.data?.message || err.message);
    if (err.response?.data?.error) console.error('Details:', err.response.data.error);
    process.exit(1);
  }
}

verifyPhase5();
