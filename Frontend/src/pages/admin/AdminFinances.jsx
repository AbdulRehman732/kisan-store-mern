import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
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

const FinanceGrid = styled.div`
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

const TabList = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  background: var(--bg-surface-alt);
  padding: 8px;
  border-radius: var(--radius-pill);
  width: fit-content;
  border: 1px solid var(--border);
`;

const Tab = styled.button`
  background: ${p => p.$active ? 'var(--primary)' : 'transparent'};
  color: ${p => p.$active ? 'var(--text-inverse)' : 'var(--text-secondary)'};
  border: none;
  padding: 12px 28px;
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: var(--transition-smooth);
  
  &:hover { color: ${p => p.$active ? 'var(--text-inverse)' : 'var(--primary)'}; }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  label { display: block; font-size: 0.75rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.1em; }
  input, select, textarea {
    width: 100%;
    padding: 18px;
    background: var(--bg-surface-alt);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    color: var(--text-primary);
    font-weight: 600;
    transition: var(--transition-smooth);
    &:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 15px var(--accent-glow); }
  }
`;

const ActionBtn = styled.button`
  width: 100%;
  padding: 24px;
  background: var(--primary);
  color: var(--text-inverse);
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 1.1rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-top: 16px;
  box-shadow: 0 15px 40px rgba(76, 175, 80, 0.2);
  transition: var(--transition-smooth);
  
  &:hover:not(:disabled) { background: var(--accent); color: var(--text-inverse); transform: translateY(-3px); box-shadow: 0 20px 50px var(--accent-glow); }
  &:disabled { opacity: 0.4; pointer-events: none; }
`;

const StatusBox = styled.div`
  background: var(--bg-surface-alt);
  padding: 24px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  h4 { font-size: 0.9rem; color: var(--text-primary); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 900; }
  p { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; font-weight: 600; opacity: 0.8; }
`;

// ===== COMPONENT =====
const AdminFinances = () => {
  const [tab, setTab] = useState('Transfer');
  const [accounts, setAccounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [processing, setProcessing] = useState(false);

  const [transferForm, setTransferForm] = useState({ fromAccountId:'', toAccountId:'', amount:'', date:'', note:'' });
  const [withdrawForm, setWithdrawForm] = useState({ type:'Personal', amount:0, accountId:'', items:[], note:'', date:'' });
  const [withdrawalItems, setWithdrawalItems] = useState([{ product: '', quantity: 1 }]);

  useEffect(() => {
    api.get('/accounts').then(r => setAccounts(r.data.accounts || [])).catch(()=>{});
    api.get('/products').then(r => setProducts(r.data.products || [])).catch(()=>{});
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!transferForm.fromAccountId || !transferForm.toAccountId || !transferForm.amount) return alert('Protocol Error: Fill all required authorizations.');
    if (transferForm.fromAccountId === transferForm.toAccountId) return alert('Logic Error: Source and target accounts must be distinct.');
    
    setProcessing(true);
    try {
      await api.post('/accounts/transfer', transferForm);
      alert('Institutional Transfer Authorized.');
      setTransferForm({ fromAccountId:'', toAccountId:'', amount:'', date:'', note:'' });
      api.get('/accounts').then(r => setAccounts(r.data.accounts || [])).catch(()=>{});
    } catch (err) { alert(err.response?.data?.message || 'Transfer Protocol Failure.'); }
    finally { setProcessing(false); }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const payload = { ...withdrawForm, items: withdrawalItems.filter(i => i.product && i.quantity > 0) };
      await api.post('/accounts/withdraw', payload);
      alert('Internal Withdrawal Authorized.');
      setWithdrawForm({ type:'Personal', amount:0, accountId:'', items:[], note:'', date:'' });
      setWithdrawalItems([{ product: '', quantity: 1 }]);
      api.get('/accounts').then(r => setAccounts(r.data.accounts || [])).catch(()=>{});
    } catch (err) { alert(err.response?.data?.message || 'Withdrawal Protocol Failure.'); }
    finally { setProcessing(false); }
  };

  return (
    <PageContainer>
      <Topbar>
        <PageTitle>Treasury Operations <small>INTERNAL CAPITAL CONTROLS</small></PageTitle>
      </Topbar>

      <FinanceGrid>
        <EliteCard>
          <TabList>
            <Tab $active={tab === 'Transfer'} onClick={() => setTab('Transfer')}>Inter-Ledger Transfer</Tab>
            <Tab $active={tab === 'Withdrawal'} onClick={() => setTab('Withdrawal')}>Internal Capital Usage</Tab>
          </TabList>

          {tab === 'Transfer' ? (
            <form onSubmit={handleTransfer}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px'}}>
                <FormGroup>
                  <label>Source Ledger</label>
                  <select value={transferForm.fromAccountId} onChange={e => setTransferForm({...transferForm, fromAccountId: e.target.value})}>
                    <option value="">-- Select Origin --</option>
                    {accounts.map(a => <option key={a._id} value={a._id}>{a.name} (AVAIL: {a.balance.toLocaleString()})</option>)}
                  </select>
                </FormGroup>
                <FormGroup>
                  <label>Target Ledger</label>
                  <select value={transferForm.toAccountId} onChange={e => setTransferForm({...transferForm, toAccountId: e.target.value})}>
                    <option value="">-- Select Destination --</option>
                    {accounts.map(a => <option key={a._id} value={a._id}>{a.name} (AVAIL: {a.balance.toLocaleString()})</option>)}
                  </select>
                </FormGroup>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px'}}>
                <FormGroup>
                  <label>Transfer Magnitude (Rs.)</label>
                  <input type="number" min="1" value={transferForm.amount} onChange={e => setTransferForm({...transferForm, amount: e.target.value})} placeholder="0.00" />
                </FormGroup>
                <FormGroup>
                  <label>Authorization Date</label>
                  <input type="date" value={transferForm.date || new Date().toISOString().slice(0,10)} onChange={e => setTransferForm({...transferForm, date: e.target.value})} />
                </FormGroup>
              </div>
              <FormGroup>
                <label>Institutional Memo / Audit Reference</label>
                <textarea rows={3} value={transferForm.note} onChange={e => setTransferForm({...transferForm, note: e.target.value})} placeholder="State the operational justification for this movement..." />
              </FormGroup>
              <ActionBtn disabled={processing} type="submit">{processing ? 'Processing Authorization...' : 'Authorize Global Transfer'}</ActionBtn>
            </form>
          ) : (
            <form onSubmit={handleWithdraw}>
              <FormGroup>
                <label>Operational Categorization</label>
                <select value={withdrawForm.type} onChange={e => setWithdrawForm({...withdrawForm, type: e.target.value})}>
                  <option value="Personal">Director Personal Disbursement</option>
                  <option value="Charity">Institutional Philanthropy / Zakat</option>
                  <option value="Office">HQ Operational Overheads</option>
                </select>
              </FormGroup>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px'}}>
                <FormGroup>
                  <label>Liquid Capital Withdrawal (Rs.)</label>
                  <input type="number" value={withdrawForm.amount} onChange={e => setWithdrawForm({...withdrawForm, amount: e.target.value})} placeholder="0.00" />
                </FormGroup>
                {Number(withdrawForm.amount) > 0 && (
                  <FormGroup>
                    <label>Withdrawal Account</label>
                    <select value={withdrawForm.accountId} onChange={e => setWithdrawForm({...withdrawForm, accountId: e.target.value})}>
                      <option value="">-- Select Origin --</option>
                      {accounts.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                    </select>
                  </FormGroup>
                )}
              </div>
              
              <FormGroup>
                <label>Physical Asset Mobilization (Supply Withdrawal)</label>
                {withdrawalItems.map((wi, idx) => (
                  <div key={idx} style={{display:'flex', gap:'12px', marginBottom:'12px'}}>
                    <select style={{flex:3}} value={wi.product} onChange={e => { const n = [...withdrawalItems]; n[idx].product = e.target.value; setWithdrawalItems(n); }}>
                      <option value="">-- Select Asset --</option>
                      {products.map(p => <option key={p._id} value={p._id}>{p.name} (INV: {p.stock} units)</option>)}
                    </select>
                    <input style={{flex:1}} type="number" placeholder="Qty" value={wi.quantity} onChange={e => { const n = [...withdrawalItems]; n[idx].quantity = e.target.value; setWithdrawalItems(n); }} />
                    {idx === withdrawalItems.length - 1 && (
                      <button type="button" onClick={() => setWithdrawalItems([...withdrawalItems, { product:'', quantity:1 }])} style={{padding:'0 20px', borderRadius:'12px', background:'var(--primary)', color:'white', border:'none', fontSize:'1.4rem'}}>+</button>
                    )}
                  </div>
                ))}
              </FormGroup>

              <FormGroup>
                <label>Tactical Note</label>
                <textarea rows={3} value={withdrawForm.note} onChange={e => setWithdrawForm({...withdrawForm, note: e.target.value})} placeholder="Internal justification for internal capital consumption..." />
              </FormGroup>
              <ActionBtn disabled={processing} type="submit">{processing ? 'Recording Protocol...' : 'Authorize Internal Withdrawal'}</ActionBtn>
            </form>
          )}
        </EliteCard>

        <div style={{display:'flex', flexDirection:'column', gap:'var(--spacing-xl)'}}>
          <EliteCard>
            <h3 style={{fontSize:'1.5rem', marginBottom:'24px', color:'var(--text-primary)'}}>Audit Governance</h3>
            <StatusBox>
              <h4>Operational Visibility</h4>
              <p>
                All inter-ledger movements and internal capital usages are subject to automated 
                recursive audits. Ensure all tactical notes contain verifiable operational 
                justifications for future compliance reviews.
              </p>
            </StatusBox>
          </EliteCard>
          
          <EliteCard style={{background:'var(--bg-surface-alt)'}}>
            <h4 style={{fontSize:'0.8rem', fontWeight:900, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'16px'}}>Capital Balance Index</h4>
            {accounts.map(a => (
              <div key={a._id} style={{display:'flex', justifyContent:'space-between', padding:'16px 0', borderBottom:'1px solid var(--border)'}}>
                <span style={{fontWeight:800}}>{a.name}</span>
                <span style={{fontWeight:900, color:'var(--primary)'}}>Rs. {a.balance.toLocaleString()}</span>
              </div>
            ))}
          </EliteCard>
        </div>
      </FinanceGrid>
    </PageContainer>
  );
};

export default AdminFinances;
