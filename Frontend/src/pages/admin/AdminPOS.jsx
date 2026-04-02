import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../api';

// ===== STYLED COMPONENTS =====
const PageContainer = styled.div`
  padding: var(--spacing-xl);
  animation: entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  background: var(--bg-app);
  min-height: 100vh;
`;

const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xxl);
`;

const PageTitle = styled.h2`
  font-size: 3.5rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  small { font-size: 1rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7; }
`;

const POSGrid = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: var(--spacing-xl);
  @media (max-width: 1200px) { grid-template-columns: 1fr; }
`;

const EliteCard = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: var(--spacing-xl);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
  transition: var(--transition-smooth);
  
  &:hover { border-color: var(--accent); }
`;

const CardTitle = styled.h3`
  font-size: 1.6rem;
  color: var(--text-primary);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0.9;
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: var(--spacing-lg);
  
  label {
    display: block;
    font-size: 0.75rem;
    font-weight: 900;
    color: var(--text-secondary);
    text-transform: uppercase;
    margin-bottom: 10px;
    letter-spacing: 0.1em;
  }
  
  input {
    width: 100%;
    padding: 18px 24px;
    background: var(--bg-surface-alt);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 1.1rem;
    color: var(--text-primary);
    font-weight: 600;
    transition: var(--transition-smooth);
    
    &:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 15px var(--accent-glow); }
    &::placeholder { color: var(--text-secondary); opacity: 0.4; }
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  margin-top: 8px;
  z-index: 1000;
  max-height: 280px;
  overflow-y: auto;
  box-shadow: var(--shadow-premium);
  animation: entrance 0.3s ease;
`;

const ResultItem = styled.div`
  padding: 16px 24px;
  cursor: pointer;
  border-bottom: 1px solid var(--border);
  transition: var(--transition-fast);
  
  &:hover { background: var(--bg-surface-alt); }
  &:last-child { border-bottom: none; }
  
  .title { font-weight: 800; color: var(--text-primary); font-size: 1rem; margin-bottom: 4px; }
  .meta { font-size: 0.75rem; color: var(--text-secondary); font-weight: 600; opacity: 0.7; }
`;

const EliteTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  thead th {
    padding: 16px;
    text-align: left;
    font-size: 0.72rem;
    font-weight: 900;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    border-bottom: 1px solid var(--border);
  }
  
  tbody td {
    padding: 20px 16px;
    border-bottom: 1px solid var(--border);
    color: var(--text-primary);
    font-weight: 600;
  }
`;

const QtyBox = styled.input`
  width: 70px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-surface-alt);
  color: var(--text-primary);
  text-align: center;
  font-weight: 800;
  &:focus { outline: none; border-color: var(--accent); }
`;

const SummaryBox = styled.div`
  background: var(--bg-surface-alt);
  padding: 24px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  margin-top: 24px;
  
  .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-weight: 700; color: var(--text-secondary); }
  .total { font-size: 1.8rem; color: var(--text-primary); font-weight: 900; margin-top: 16px; border-top: 1px solid var(--border); padding-top: 16px; }
`;

const RecordBtn = styled.button`
  width: 100%;
  padding: 24px;
  background: var(--primary);
  color: var(--text-inverse);
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 1.1rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-top: 32px;
  box-shadow: 0 15px 40px rgba(76, 175, 80, 0.2);
  transition: var(--transition-smooth);
  
  &:hover:not(:disabled) { background: var(--accent); color: var(--text-inverse); transform: translateY(-3px); box-shadow: 0 20px 50px var(--accent-glow); }
  &:disabled { opacity: 0.4; pointer-events: none; }
`;

// ===== COMPONENT =====
const AdminPOS = () => {
  const [farmers, setFarmers] = useState([]);
  const [products, setProducts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [searchFarmers, setSearchFarmers] = useState('');
  const [searchProducts, setSearchProducts] = useState('');
  const [showFarmerResults, setShowFarmerResults] = useState(false);
  const [showProductResults, setShowProductResults] = useState(false);

  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [cart, setCart] = useState([]);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Cash');
  const [accountId, setAccountId] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    api.get('/admin/farmers').then(r => setFarmers(r.data.farmers || [])).catch(()=>{});
    api.get('/products').then(r => setProducts(r.data.products || [])).catch(()=>{});
    api.get('/accounts').then(r => setAccounts(r.data.accounts || [])).catch(()=>{});
  }, []);

  const addToCart = (p) => {
    const existing = cart.find(c => c.product === p._id);
    if (existing) {
      setCart(cart.map(c => c.product === p._id ? {...c, quantity: c.quantity + 1} : c));
    } else {
      setCart([...cart, { product: p._id, name: p.name, quantity: 1, price: p.price, taxAmount: p.taxAmount || 0, stock: p.stock }]);
    }
    setSearchProducts('');
    setShowProductResults(false);
  };

  const removeFromCart = (pid) => setCart(cart.filter(c => c.product !== pid));
  const updateQty = (pid, q) => setCart(cart.map(c => c.product === pid ? {...c, quantity: Number(q)} : c));
  const updatePrice = (pid, pr) => setCart(cart.map(c => c.product === pid ? {...c, price: Number(pr)} : c));

  const filteredFarmers = farmers.filter(f => searchFarmers && (f.first_name + ' ' + f.last_name + ' ' + f.phone).toLowerCase().includes(searchFarmers.toLowerCase())).slice(0, 5);
  const filteredProducts = products.filter(p => searchProducts && (p.name + ' ' + p.category).toLowerCase().includes(searchProducts.toLowerCase())).slice(0, 5);

  const subtotal = cart.reduce((s, c) => s + (c.price * c.quantity), 0);
  const tax = cart.reduce((s, c) => s + (c.taxAmount * c.quantity), 0);
  const total = subtotal + tax;

  const handleRecordSale = async () => {
    if (!selectedFarmer) return alert('Authorization Error: Select a stakeholder.');
    if (cart.length === 0) return alert('Transaction Error: Empty inventory log.');
    if (Number(payAmount) > total + 0.01) return alert('Financial Error: Payment exceeds authorization total.');

    setProcessing(true);
    try {
      await api.post('/admin/orders/shop-sale', {
        farmerId: selectedFarmer._id,
        farmerPhone: selectedFarmer.phone,
        items: cart.map(c => ({ product: c.product, quantity: c.quantity, price: c.price, taxAmount: c.taxAmount })),
        payment: {
          amount: Number(payAmount) || 0,
          method: payMethod,
          accountId: accountId || undefined
        }
      });
      alert('Institutional Sale Authorized & Recorded.');
      setSelectedFarmer(null);
      setCart([]);
      setPayAmount('');
      api.get('/products').then(r => setProducts(r.data.products || [])).catch(()=>{});
    } catch (err) {
      alert(err.response?.data?.message || 'Authorization Refused.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <PageContainer>
      <Topbar>
        <PageTitle>Direct POS Terminal <small>EXECUTIVE RETAIL ENGINE</small></PageTitle>
      </Topbar>

      <POSGrid>
        <div style={{display:'flex', flexDirection:'column', gap:'var(--spacing-xl)'}}>
          <EliteCard>
            <CardTitle>📡 Logistics & Asset Identification</CardTitle>
            <SearchWrapper>
              <label>IDENTIFY STAKEHOLDER</label>
              <input 
                placeholder="Enter Name, Entity ID or Contact..." 
                value={selectedFarmer ? `${selectedFarmer.first_name} ${selectedFarmer.last_name} (${selectedFarmer.phone})` : searchFarmers}
                onChange={e => { setSearchFarmers(e.target.value); setShowFarmerResults(true); if (selectedFarmer) setSelectedFarmer(null); }}
              />
              {showFarmerResults && filteredFarmers.length > 0 && (
                <SearchResults>
                  {filteredFarmers.map(f => (
                    <ResultItem key={f._id} onClick={() => { setSelectedFarmer(f); setShowFarmerResults(false); setSearchFarmers(''); }}>
                      <div className="title">{f.first_name} {f.last_name}</div>
                      <div className="meta">CID: {f._id.slice(-6)} · {f.phone}</div>
                    </ResultItem>
                  ))}
                </SearchResults>
              )}
            </SearchWrapper>

            <SearchWrapper>
              <label>INITIALIZE ASSET DISCOVERY</label>
              <input 
                placeholder="Specification, Category or Nutrient Index..." 
                value={searchProducts}
                onChange={e => { setSearchProducts(e.target.value); setShowProductResults(true); }}
              />
              {showProductResults && filteredProducts.length > 0 && (
                <SearchResults>
                  {filteredProducts.map(p => (
                    <ResultItem key={p._id} onClick={() => addToCart(p)}>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <div className="title">{p.name}</div>
                        <div style={{fontWeight:900, color:'var(--primary)'}}>Rs. {p.price.toLocaleString()}</div>
                      </div>
                      <div className="meta">AVAILABILITY: {p.stock} {p.unit} · {p.category}</div>
                    </ResultItem>
                  ))}
                </SearchResults>
              )}
            </SearchWrapper>
          </EliteCard>

          <EliteCard>
            <CardTitle>📜 Operational Inventory Log</CardTitle>
            {cart.length === 0 ? (
              <div style={{textAlign:'center', padding:'60px', color:'var(--text-secondary)', opacity:0.6, fontSize:'1.1rem', fontWeight:600}}>Initializing... No assets currently logged for mobilization.</div>
            ) : (
              <EliteTable>
                <thead>
                  <tr>
                    <th>Asset Specification</th>
                    <th>Valuation</th>
                    <th>Magnitude</th>
                    <th style={{textAlign:'right'}}>Line Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(c => (
                    <tr key={c.product}>
                      <td>
                        <div style={{fontWeight:900, color:'var(--text-primary)'}}>{c.name}</div>
                        <div style={{fontSize:'0.65rem', color:'var(--text-secondary)', fontWeight:800}}>AVAIL: {c.stock}</div>
                      </td>
                      <td>
                        <input type="number" value={c.price} onChange={e => updatePrice(c.product, e.target.value)} style={{width:'100px', padding:'8px', borderRadius:'6px', border:'1px solid var(--border)', background:'var(--bg-surface-alt)', color:'var(--text-primary)', fontWeight:800}} />
                      </td>
                      <td>
                        <QtyBox type="number" min="1" value={c.quantity} onChange={e => updateQty(c.product, e.target.value)} />
                      </td>
                      <td style={{textAlign:'right', fontWeight:900, color:'var(--primary)', fontSize:'1.1rem'}}>Rs. {(c.price * c.quantity).toLocaleString()}</td>
                      <td style={{textAlign:'right'}}>
                        <button onClick={() => removeFromCart(c.product)} style={{background:'none', border:'none', color:'#FF5252', cursor:'pointer', fontSize:'1.2rem'}}>✖</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </EliteTable>
            )}
          </EliteCard>
        </div>

        <div>
          <EliteCard style={{position:'sticky', top:'120px'}}>
            <CardTitle>🧾 Financial Summary Audit</CardTitle>
            <SummaryBox>
              <div className="row"><span>Asset Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
              <div className="row"><span>Institutional Levy</span><span>Rs. {tax.toLocaleString()}</span></div>
              <div className="total"><span>TOTAL PAYABLE</span><span>Rs. {total.toLocaleString()}</span></div>
            </SummaryBox>

            <div style={{marginTop:'40px'}}>
              <CardTitle>💰 Monetary Authorization</CardTitle>
              <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                <SearchWrapper>
                  <label>Initial Mobilization Fund (Rs.)</label>
                  <input type="number" placeholder="0.00" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
                  {Number(payAmount) < total && Number(payAmount) > 0 && (
                    <div style={{fontSize:'0.75rem', color:'#F5B611', fontWeight:900, marginTop:'8px', textTransform:'uppercase'}}>⚠️ RESIDUAL RS. {(total - Number(payAmount)).toLocaleString()} LOGGED AS SYSTEM CREDIT</div>
                  )}
                </SearchWrapper>

                {Number(payAmount) > 0 && (
                  <>
                    <SearchWrapper>
                      <label>Clearing Protocol</label>
                      <select value={payMethod} onChange={e => setPayMethod(e.target.value)} style={{width:'100%', padding:'18px', background:'var(--bg-surface-alt)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', color:'var(--text-primary)', fontWeight:700}}>
                        <option value="Cash">Physical Currency (Cash)</option>
                        <option value="Bank Transfer">Atomic Bank Transfer</option>
                      </select>
                    </SearchWrapper>
                    <SearchWrapper>
                      <label>Target Treasury Account</label>
                      <select value={accountId} onChange={e => setAccountId(e.target.value)} style={{width:'100%', padding:'18px', background:'var(--bg-surface-alt)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', color:'var(--text-primary)', fontWeight:700}}>
                        <option value="">-- Select Recipient Ledger --</option>
                        {accounts.map(a => <option key={a._id} value={a._id}>{a.name} (AVAIL: {a.balance.toLocaleString()})</option>)}
                      </select>
                    </SearchWrapper>
                  </>
                )}
              </div>
            </div>

            <RecordBtn disabled={processing || cart.length === 0 || !selectedFarmer} onClick={handleRecordSale}>
              {processing ? 'AUTHORIZING...' : 'AUTHORIZE DIRECT DISPATCH'}
            </RecordBtn>
          </EliteCard>
        </div>
      </POSGrid>
    </PageContainer>
  );
};

export default AdminPOS;
