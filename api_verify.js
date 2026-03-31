const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function testBulkUpload() {
  console.log('--- SYSTEM PRODUCTION VERIFICATION ---');
  
  // 1. Login to get token
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@kisanstore.pk',
      password: 'admin123'
    });
    const token = loginRes.data.token;
    console.log('✅ Admin authenticated.');

    // 2. Perform Bulk Upload
    const csvPath = path.join(__dirname, 'products_template.csv');
    const form = new FormData();
    form.append('file', fs.createReadStream(csvPath));

    const uploadRes = await axios.post('http://localhost:5000/api/admin/products/bulk-upload', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`✅ Bulk Upload Success: ${uploadRes.data.count} products ingested.`);

    // 3. Verify Reviews
    const reviewsRes = await axios.get('http://localhost:5000/api/admin/reviews', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Review Moderation: ${reviewsRes.data.reviews.length} reviews active (Verified: Operational Excellence).`);

    // 4. Verify Staff
    const staffRes = await axios.get('http://localhost:5000/api/admin/staff', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Staff Management: ${staffRes.data.staff.length} staff members listed (Verified: Staff Manager).`);

    console.log('\n--- ALL PRODUCTION PILLARS VERIFIED ---');
    process.exit(0);
  } catch (err) {
    console.error('❌ Verification Failed:', err.response?.data?.message || err.message);
    process.exit(1);
  }
}

testBulkUpload();
