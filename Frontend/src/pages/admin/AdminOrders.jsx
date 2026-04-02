import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../../api';
import { generateOrderReport, generateSingleInvoice } from '../../utils/PDFService';
import CommHubModal from '../../components/CommHubModal';

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
  flex-wrap: wrap;
  gap: var(--spacing-lg);
`;

const PageTitle = styled.h2`
  font-size: 3.5rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  small { font-size: 1rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7; }
`;

const CountBadge = styled.span`
  background: var(--bg-surface-alt);
  color: var(--primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  padding: 10px 24px;
  font-size: 0.85rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FilterStrip = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  align-items: center;
  background: var(--bg-surface-alt);
  padding: 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 300px;
  padding: 16px 24px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 600;
  transition: var(--transition-smooth);
  &:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 15px var(--accent-glow); }
`;

const FilterSelect = styled.select`
  padding: 16px 24px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  cursor: pointer;
  &:focus { outline: none; border-color: var(--accent); }
`;

const TableCard = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-subtle);
  border: 1px solid var(--border);
  overflow-x: auto;
`;

const EliteTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  thead th { padding: 24px; text-align: left; font-size: 0.7rem; font-weight: 900; color: var(--text-inverse); text-transform: uppercase; background: var(--primary); }
  tbody td { padding: 24px; border-bottom: 1px solid var(--border); color: var(--text-primary); font-weight: 700; }
  tbody tr:hover { background: var(--bg-surface-alt); }
`;

const OrderId = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 900;
  color: var(--text-primary);
  background: var(--bg-surface-alt);
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--border);
  display: inline-block;
`;

const StatusBadge = styled.span`
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.65rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${p => p.$status === 'Completed' ? 'rgba(76, 175, 80, 0.1)' : p.$status === 'Cancelled' ? 'rgba(212, 106, 79, 0.1)' : 'rgba(245, 182, 17, 0.1)'};
  color: ${p => p.$status === 'Completed' ? '#4CAF50' : p.$status === 'Cancelled' ? '#FF5252' : '#F5B611'};
  border: 1px solid currentColor;
`;

const ActionBtn = styled.button`
  padding: 10px 20px;
  background: ${p => p.$accent ? 'var(--accent)' : 'var(--bg-surface-alt)'};
  color: ${p => p.$accent ? 'var(--text-inverse)' : 'var(--text-primary)'};
  border: 1px solid ${p => p.$accent ? 'var(--accent)' : 'var(--border)'};
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: var(--transition-smooth);
  
  &:hover:not(:disabled) { background: ${p => p.$accent ? 'var(--primary)' : 'var(--primary)'}; color: var(--text-inverse); transform: translateY(-2px); box-shadow: var(--shadow-premium); }
  &:disabled { opacity: 0.4; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(13, 15, 12, 0.7);
  backdrop-filter: blur(20px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalCard = styled.div`
  background: var(--bg-surface);
  padding: var(--spacing-xxl);
  border-radius: var(--radius-card);
  width: 550px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-premium);
  animation: entrance 0.4s ease;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  label { display: block; font-size: 0.75rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px; }
  input, select, textarea {
    width: 100%;
    padding: 18px;
    background: var(--bg-surface-alt);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    color: var(--text-primary);
    font-weight: 700;
    transition: var(--transition-smooth);
    &:focus { outline: none; border-color: var(--accent); }
  }
`;

// ===== COMPONENT =====
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCommHub, setShowCommHub] = useState(false);
  const [commHubOrder, setCommHubOrder] = useState(null);
  
  // Filtering & Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Payment State
  const [payTarget, setPayTarget] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [payForm, setPayForm] = useState({ amount:'', method:'Cash', accountId:'', paidAt: new Date().toISOString().slice(0,10), reference:'', note:'' });
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const statusQuery = statusFilter !== 'All' ? `&status=${statusFilter}` : "";
      const dateQuery = (startDate ? `&createdAt[gte]=${startDate}` : "") + (endDate ? `&createdAt[lte]=${endDate}` : "");
      const res = await api.get(`/orders?page=${page}&limit=10&search=${debouncedSearch}${statusQuery}${dateQuery}`);
      setOrders(res.data.orders || []);
      if (res.data.pagination) {
        setTotalPages(res.data.pagination.totalPages);
        setTotalRecords(res.data.pagination.totalRecords);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, debouncedSearch, statusFilter, startDate, endDate]);

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    setPaying(true);
    try {
      await api.post(`/admin/orders/${payTarget._id}/payment`, { ...payForm, amount: Number(payForm.amount) });
      setPayTarget(null); fetchOrders();
    } catch (err) { alert(err.response?.data?.message || 'Authorization Refused.'); }
    finally { setPaying(false); }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) { alert('Status authorization failure.'); }
  };

  const triggerCommHub = (o) => { setCommHubOrder(o); setShowCommHub(true); };

  return (
    <PageContainer>
      <Topbar>
        <PageTitle>Procurement Logs <small>Operational Fulfillment & Logistics Control</small></PageTitle>
        <div style={{display:'flex', gap:'16px'}}>
          <ActionBtn onClick={() => generateOrderReport({ orders })}>📤 Bulk Report Export</ActionBtn>
          <CountBadge>{totalRecords} ACTIVE RECORDS</CountBadge>
        </div>
      </Topbar>

      <FilterStrip>
        <SearchInput placeholder="Filter by ID, entity or tactical contact..." value={search} onChange={e => setSearch(e.target.value)} />
        <FilterSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Pending">🕒 Pending</option>
          <option value="Completed">✅ FULFILLED</option>
          <option value="Cancelled">❌ VOIDED</option>
        </FilterSelect>
        <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{background:'var(--bg-surface)', border:'1px solid var(--border)', padding:'10px', borderRadius:'8px', color:'var(--text-primary)'}} />
          <span style={{fontSize:'1.2rem'}}>→</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{background:'var(--bg-surface)', border:'1px solid var(--border)', padding:'10px', borderRadius:'8px', color:'var(--text-primary)'}} />
        </div>
        {(search || statusFilter !== 'All' || startDate || endDate) && <ActionBtn onClick={() => {setSearch(''); setStatusFilter('All'); setStartDate(''); setEndDate('');}}>Reset</ActionBtn>}
      </FilterStrip>

      {loading ? (
        <div style={{display:'flex',justifyContent:'center',padding:'120px'}}><div style={{width:'60px',height:'60px',border:'5px solid var(--border)',borderTopColor:'var(--primary)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} /></div>
      ) : orders.length === 0 ? (
        <div style={{textAlign:'center', padding:'100px', background:'var(--bg-surface)', borderRadius:'var(--radius-card)', border:'1px dashed var(--border)'}}>
          <h3 style={{color:'var(--text-secondary)'}}>No operational orders discovered.</h3>
        </div>
      ) : (
        <TableCard>
          <EliteTable>
            <thead>
              <tr><th>Ref ID</th><th>Stakeholder</th><th>Asset Manifest</th><th>Financial Status</th><th>Protocol Phase</th><th>Logistics</th><th>Operations</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id}>
                  <td><OrderId>#{o._id.slice(-8).toUpperCase()}</OrderId></td>
                  <td>
                    <div style={{fontWeight:900, color:'var(--text-primary)'}}>{o.farmer?.first_name} {o.farmer?.last_name}</div>
                    <div style={{display:'flex', alignItems:'center', gap:'8px', marginTop:'4px'}}>
                      <span style={{fontSize:'0.75rem', color:'var(--text-secondary)', fontWeight:800}}>{o.farmerPhone}</span>
                      <button onClick={() => triggerCommHub(o)} style={{width:'24px',height:'24px',background:'var(--primary)',borderRadius:'50%',fontSize:'11px',border:'none',color:'white', cursor:'pointer'}}>💬</button>
                    </div>
                  </td>
                  <td style={{fontSize:'0.85rem', color:'var(--text-secondary)', maxWidth:'250px'}}>{o.items?.map(i => i.product?.name).join(', ')}</td>
                  <td>
                    <div style={{fontWeight:900, color:'var(--text-primary)'}}>Rs. {o.grandTotal.toLocaleString()}</div>
                    <div style={{fontSize:'0.7rem', fontWeight:900, color: o.amountPaid >= o.grandTotal ? '#4CAF50' : '#FF5252', marginTop:'4px'}}>
                      {o.amountPaid >= o.grandTotal ? 'FULLY SETTLED' : `OWED: Rs. ${(o.grandTotal - o.amountPaid).toLocaleString()}`}
                    </div>
                  </td>
                  <td><StatusBadge $status={o.status}>{o.status}</StatusBadge></td>
                  <td style={{fontSize:'0.85rem', color:'var(--text-secondary)', fontWeight:800}}>{new Date(o.pickupDate).toLocaleDateString()}</td>
                  <td>
                    <div style={{display:'flex', gap:'8px'}}>
                      <ActionBtn onClick={() => generateSingleInvoice(o)}>Print</ActionBtn>
                      <ActionBtn $accent onClick={() => { setPayTarget(o); api.get('/accounts').then(r => setAccounts(r.data.accounts || [])); }}>Pay</ActionBtn>
                      <select style={{padding:'8px', borderRadius:'var(--radius-pill)', background:'var(--bg-surface-alt)', border:'1px solid var(--border)', fontSize:'0.7rem', fontWeight:900}} value={o.status} onChange={e => handleStatusUpdate(o._id, e.target.value)}>
                        <option value="Pending">Pending</option>
                        <option value="Completed">FULFILLED</option>
                        <option value="Cancelled">VOIDED</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </EliteTable>
        </TableCard>
      )}

      {totalPages > 1 && (
        <div style={{display:'flex', justifyContent:'center', margin:'40px 0', gap:'20px'}}>
          <ActionBtn onClick={() => setPage(p => p - 1)} disabled={page === 1}>← PREV</ActionBtn>
          <span style={{fontWeight:900, color:'var(--primary)'}}>{page} / {totalPages}</span>
          <ActionBtn onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>NEXT →</ActionBtn>
        </div>
      )}

      {payTarget && (
        <ModalOverlay onClick={() => setPayTarget(null)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <h3 style={{fontSize:'2.2rem', marginBottom:'32px'}}>Execute Strategic Settlement</h3>
            <form onSubmit={handleRecordPayment}>
              <FormGroup><label>Monetary Magnitude (Rs.)</label><input type="number" required value={payForm.amount} onChange={e => setPayForm({...payForm, amount: e.target.value})} /></FormGroup>
              <FormGroup><label>Settlement Method</label><select value={payForm.method} onChange={e => setPayForm({...payForm, method: e.target.value})}><option value="Cash">In-Hand Cash</option><option value="Bank Transfer">Institutional Bank Transfer</option><option value="Credit">Stakeholder Credit Line</option></select></FormGroup>
              <FormGroup><label>Ledger Allocation</label><select value={payForm.accountId} onChange={e => setPayForm({...payForm, accountId: e.target.value})}><option value="">-- Manual Journal Entry --</option>{accounts.map(a => <option key={a._id} value={a._id}>{a.name} (AVAIL: {a.balance.toLocaleString()})</option>)}</select></FormGroup>
              <FormGroup><label>Audit Note</label><textarea rows={3} value={payForm.note} onChange={e => setPayForm({...payForm, note: e.target.value})} /></FormGroup>
              <div style={{display:'flex', gap:'16px', marginTop:'32px'}}>
                <ActionBtn type="button" onClick={() => setPayTarget(null)} style={{flex:1}}>Abort</ActionBtn>
                <ActionBtn type="submit" disabled={paying} $accent style={{flex:1}}>{paying ? 'COMMITTING...' : 'Authorize Strategic Settlement'}</ActionBtn>
              </div>
            </form>
          </ModalCard>
        </ModalOverlay>
      )}

      {showCommHub && (
        <CommHubModal isOpen={showCommHub} onClose={() => setShowCommHub(false)} order={commHubOrder} onSendEmail={async (e, s, t) => { await api.post('/auth/send-template-email', { email: e, subject: s, text: t }); alert('Institutional Dispatch Successful.'); }} />
      )}
    </PageContainer>
  );
};

export default AdminOrders;
