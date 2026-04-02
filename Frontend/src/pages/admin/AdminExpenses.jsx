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

const ActionBtn = styled.button`
  padding: 16px 28px;
  background: var(--primary);
  color: var(--text-inverse);
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: var(--transition-smooth);
  box-shadow: var(--shadow-subtle);

  &:hover { background: var(--accent); color: var(--text-inverse); transform: translateY(-3px); box-shadow: var(--shadow-premium); }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`;

const MetricCard = styled.div`
  background: var(--bg-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
  
  .label { font-size: 0.7rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px; opacity: 0.7; }
  .value { font-size: 1.8rem; font-weight: 900; color: ${p => p.$danger ? '#FF5252' : 'var(--text-primary)'}; letter-spacing: -0.01em; }
`;

const FilterStrip = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  align-items: center;
  
  select, input {
    padding: 12px 20px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--text-primary);
    text-transform: uppercase;
    &:focus { outline: none; border-color: var(--accent); }
  }
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
  thead th { padding: 16px; text-align: left; font-size: 0.7rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; border-bottom: 1px solid var(--border); }
  tbody td { padding: 20px 16px; border-bottom: 1px solid var(--border); font-size: 0.95rem; font-weight: 700; color: var(--text-primary); }
  tbody tr:hover { background: var(--bg-surface-alt); }
`;

const Badge = styled.span`
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  font-size: 0.65rem;
  font-weight: 900;
  text-transform: uppercase;
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary);
  border: 1px solid currentColor;
`;

const RowBtn = styled.button`
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.7rem;
  text-transform: uppercase;
  background: var(--bg-surface-alt);
  border: 1px solid var(--border);
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition-fast);
  &:hover { background: ${p => p.$danger ? '#FF5252' : 'var(--primary)'}; color: var(--text-inverse); }
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
  margin-bottom: 20px;
  label { display: block; font-size: 0.75rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px; }
  input, select, textarea {
    width: 100%;
    padding: 16px;
    background: var(--bg-surface-alt);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    color: var(--text-primary);
    font-weight: 700;
    &:focus { outline: none; border-color: var(--accent); }
  }
`;

// ===== COMPONENT =====
const CATEGORIES = ['Supplies','Utilities','Salary','Rent','Transport','Marketing','Maintenance','Personal','Other'];
const emptyForm = { title:'', amount:'', category:'Other', method:'Cash', accountId:'', spentAt: new Date().toISOString().slice(0,10), note:'' };

const AdminExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  
  // Filters
  const [catFilter, setCatFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchAll = () => {
    setLoading(true);
    Promise.all([api.get('/expenses'), api.get('/accounts')])
      .then(([e, a]) => { setExpenses(e.data.expenses || []); setAccounts(a.data.accounts || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = expenses.filter(e => {
    const matchesCat = catFilter === 'All' || e.category === catFilter;
    const spentDate = new Date(e.spentAt).toISOString().split('T')[0];
    return matchesCat && (!startDate || spentDate >= startDate) && (!endDate || spentDate <= endDate);
  });

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const thisMonth = expenses.filter(e => new Date(e.spentAt).getMonth() === new Date().getMonth()).reduce((s, e) => s + e.amount, 0);
  const topCat = Object.entries(expenses.reduce((a,e)=>{a[e.category]=(a[e.category]||0)+e.amount; return a;},{})).sort((a,b)=>b[1]-a[1])[0];

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount), accountId: form.accountId || undefined };
      if (isEditing) await api.put(`/expenses/${form._id}`, payload);
      else await api.post('/expenses', payload);
      setShowModal(false); setForm(emptyForm); fetchAll();
    } catch (err) { alert(err.response?.data?.message || 'Operation Refused.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/expenses/${confirmDel}`);
      setConfirmDel(null); fetchAll();
    } catch (err) { alert('Deletion refused.'); }
  };

  return (
    <PageContainer>
      <Topbar>
        <PageTitle>Expenses <small>Business Expenditures</small></PageTitle>
        <ActionBtn onClick={() => { setForm(emptyForm); setIsEditing(false); setShowModal(true); }}>+ Record Expense</ActionBtn>
      </Topbar>

      <MetricsGrid>
        <MetricCard $danger><div className="label">Total Expenses</div><div className="value">Rs. {totalSpent.toLocaleString()}</div></MetricCard>
        <MetricCard><div className="label">This Month</div><div className="value">Rs. {thisMonth.toLocaleString()}</div></MetricCard>
        <MetricCard><div className="label">Total Records</div><div className="value">{expenses.length} Logged</div></MetricCard>
        {topCat && <MetricCard><div className="label">Highest Category</div><div className="value" style={{fontSize:'1.3rem'}}>{topCat[0]}</div><div className="sub">Rs. {topCat[1].toLocaleString()}</div></MetricCard>}
      </MetricsGrid>

      <FilterStrip>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div style={{display:'flex', gap:'8px', alignItems:'center'}}><label style={{fontSize:'0.6rem', fontWeight:900}}>FROM</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
        <div style={{display:'flex', gap:'8px', alignItems:'center'}}><label style={{fontSize:'0.6rem', fontWeight:900}}>TO</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
        {(startDate || endDate || catFilter !== 'All') && <button onClick={() => {setStartDate(''); setEndDate(''); setCatFilter('All');}} style={{background:'none', border:'none', color:'var(--text-secondary)', fontWeight:900, cursor:'pointer', fontSize:'0.75rem'}}>RESET FILTERS</button>}
      </FilterStrip>

      {loading ? (
        <div style={{display:'flex',justifyContent:'center',padding:'120px'}}><div style={{width:'60px',height:'60px',border:'5px solid var(--border)',borderTopColor:'var(--primary)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} /></div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign:'center', padding:'100px', background:'var(--bg-surface)', borderRadius:'var(--radius-card)', border:'1px dashed var(--border)'}}>
          <span style={{fontSize:'5rem', display:'block', marginBottom:'24px'}}>💸</span>
          <h3>No matching financial entries.</h3>
        </div>
      ) : (
        <TableCard>
          <EliteTable>
            <thead>
              <tr><th>Title</th><th>Category</th><th>Source Account</th><th>Date</th><th style={{textAlign:'right'}}>Amount</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(exp => (
                <tr key={exp._id}>
                  <td><div style={{fontWeight:900}}>{exp.title}</div><div style={{fontSize:'0.7rem', opacity:0.6}}>{exp.method}</div></td>
                  <td><Badge>{exp.category}</Badge></td>
                  <td style={{color:'var(--text-secondary)'}}>{exp.account?.name || 'Institutional Cash'}</td>
                  <td style={{color:'var(--text-secondary)'}}>{new Date(exp.spentAt).toLocaleDateString()}</td>
                  <td style={{textAlign:'right', fontWeight:900, color:'#FF5252'}}>- Rs. {exp.amount.toLocaleString()}</td>
                  <td>
                    <div style={{display:'flex', gap:'8px'}}>
                      <RowBtn onClick={() => { setForm({...exp, spentAt: new Date(exp.spentAt).toISOString().slice(0,10), accountId: exp.account?._id || ''}); setIsEditing(true); setShowModal(true); }}>Edit</RowBtn>
                      <RowBtn $danger onClick={() => setConfirmDel(exp._id)}>Delete</RowBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </EliteTable>
        </TableCard>
      )}

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <h3 style={{fontSize:'2.2rem', marginBottom:'32px'}}>{isEditing ? 'Edit Expense' : 'Record Expense'}</h3>
            <form onSubmit={handleSubmit}>
              <FormGroup><label>Expense Title</label><input required value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder="e.g. Electricity Bill, Salary..." /></FormGroup>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                <FormGroup><label>Amount (Rs.)</label><input type="number" required value={form.amount} onChange={e => setForm({...form, amount:e.target.value})} /></FormGroup>
                <FormGroup><label>Category</label><select value={form.category} onChange={e => setForm({...form, category:e.target.value})}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></FormGroup>
              </div>
              <FormGroup><label>Deduct From Account</label><select value={form.accountId} onChange={e => setForm({...form, accountId:e.target.value})}><option value="">-- Manual Cash (No Deduct) --</option>{accounts.map(a => <option key={a._id} value={a._id}>{a.name} (AVAIL: {a.balance.toLocaleString()})</option>)}</select></FormGroup>
              <FormGroup><label>Note / Ref</label><textarea rows={3} value={form.note} onChange={e => setForm({...form, note:e.target.value})} /></FormGroup>
              <div style={{display:'flex', gap:'16px', marginTop:'32px'}}>
                <ActionBtn type="button" onClick={() => setShowModal(false)} style={{flex:1, background:'var(--bg-surface-alt)', color:'var(--text-primary)', border:'1px solid var(--border)'}}>Cancel</ActionBtn>
                <ActionBtn type="submit" disabled={saving} style={{flex:2}}>{saving ? 'Saving...' : 'Save Expense'}</ActionBtn>
              </div>
            </form>
          </ModalCard>
        </ModalOverlay>
      )}

      {confirmDel && (
        <ModalOverlay onClick={() => setConfirmDel(null)}>
          <ModalCard style={{textAlign:'center'}}>
            <div style={{fontSize:'4rem', marginBottom:'24px'}}>⚠️</div>
            <h3>Delete Expense?</h3>
            <p style={{color:'var(--text-secondary)', marginBottom:'32px'}}>Deleting this record is permanent. If linked to an account, the funds will be restored.</p>
            <div style={{display:'flex', gap:'16px'}}>
              <ActionBtn onClick={() => setConfirmDel(null)} style={{flex:1, background:'var(--bg-surface-alt)', color:'var(--text-primary)', border:'1px solid var(--border)'}}>Cancel</ActionBtn>
              <ActionBtn onClick={handleDelete} style={{flex:1, background:'#FF5252', borderColor:'#FF5252'}}>Yes, Delete</ActionBtn>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default AdminExpenses;
