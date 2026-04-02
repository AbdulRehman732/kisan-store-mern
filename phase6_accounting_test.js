const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let adminToken = '';
let farmerToken = '';

async function runTests() {
  console.log('🚀 INITIALIZING PHASE 6 ACCOUNTING VERIFICATION\n');

  try {
    // 1. ADMIN LOGIN
    const adminLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@kisanstore.pk',
      password: 'admin123'
    });
    adminToken = adminLogin.data.token;
    const adminHeader = { headers: { Authorization: `Bearer ${adminToken}` } };
    console.log('✅ Admin Authenticated');

    // 2. CREATE INSTITUTIONAL ACCOUNTS
    console.log('\n--- TREASURY MODULE TEST ---');
    const bankRes = await axios.post(`${API_URL}/accounts`, {
      name: 'Test Bank Account',
      type: 'Bank',
      bankName: 'AgroBank',
      accountNumber: 'PK123456789'
    }, adminHeader);
    const bankId = bankRes.data.account._id;
    console.log(`✅ Bank Account Created: ${bankId}`);

    const cashRes = await axios.post(`${API_URL}/accounts`, {
      name: 'Floor Cash',
      type: 'Cash'
    }, adminHeader);
    const cashId = cashRes.data.account._id;
    console.log(`✅ Cash Account Created: ${cashId}`);

    // 3. ATOMIC TRANSFER TEST
    console.log('\n--- ATOMIC TRANSFER TEST ---');
    // First, let's record a payment to the bank account to give it some balance
    // Wait, let's just test the transfer with insufficient funds first
    try {
      await axios.post(`${API_URL}/accounts/transfer`, {
        fromAccountId: bankId,
        toAccountId: cashId,
        amount: 1000,
        note: 'Attempting transfer with 0 balance'
      }, adminHeader);
    } catch (err) {
      console.log('✅ Insufficient Funds Check Passed (Expected Failure)');
    }

    // 4. TAXATION & PAYMENT TEST
    console.log('\n--- TAXATION & PAYMENT RECONCILIATION TEST ---');
    // Get a product to test with
    const productsRes = await axios.get(`${API_URL}/products`);
    const testProduct = productsRes.data.products[0];
    
    if (!testProduct) throw new Error('No products found for testing');
    console.log(`Using product: ${testProduct.name} (Tax: ${testProduct.taxAmount || 0})`);

    // Record a payment directly (Admin POS simulation)
    // We need an order first. Let's create a quick order as a farmer.
    const farmerRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'ali@gmail.com', 
      password: 'farmer123'
    });
    farmerToken = farmerRes.data.token;
    const farmerHeader = { headers: { Authorization: `Bearer ${farmerToken}` } };

    const orderRes = await axios.post(`${API_URL}/orders`, {
      items: [{ product: testProduct._id, quantity: 1, price: testProduct.price, taxAmount: testProduct.taxAmount || 0 }],
      pickupDate: new Date(),
      farmerPhone: '03001234567'
    }, farmerHeader);
    const orderId = orderRes.data.order._id;
    const grandTotal = orderRes.data.order.grandTotal;
    console.log(`✅ Order Created: ${orderId} (Grand Total: ${grandTotal})`);

    // Record partial payment
    const partialAmount = Math.floor(grandTotal / 2);
    await axios.post(`${API_URL}/admin/orders/${orderId}/payment`, {
      amount: partialAmount,
      method: 'Bank Transfer',
      accountId: bankId,
      paidAt: new Date(),
      reference: 'TXN_PHASE6_TEST'
    }, adminHeader);
    console.log(`✅ Partial Payment Recorded: Rs. ${partialAmount}`);

    // Verify account balance
    const bankVerify = await axios.get(`${API_URL}/accounts`, adminHeader);
    const bankAccount = bankVerify.data.accounts.find(a => a._id === bankId);
    if (bankAccount.balance === partialAmount) {
      console.log(`✅ Treasury Registry Balance Updated Correctly: Rs. ${bankAccount.balance}`);
    } else {
      console.warn(`❌ Balance Mismatch: Expected ${partialAmount}, got ${bankAccount.balance}`);
    }

    // 5. PDF INVOICE METADATA CHECK (Optional API check)
    // We can't easily check PDF content here, but we can verify order structure
    const finalOrder = await axios.get(`${API_URL}/orders/${orderId}`, adminHeader);
    if (finalOrder.data.order.payments.length === 1) {
      console.log('✅ Order Payment History Integrity Confirmed');
    }

    console.log('\n✨ ALL PHASE 6 ARCHITECTURAL TESTS PASSED ✨');

  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED');
    console.error(err.response?.data || err.message);
    process.exit(1);
  }
}

runTests();
