import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import api from '../../api';
import { generateOrderReport } from '../../utils/PDFService';

// ===== STYLED COMPONENTS =====
const PageContainer = styled.div`
  padding: var(--spacing-xl);
  animation: entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  background: var(--bg-app);
  min-height: 100vh;
`;

const BackBtn = styled.button`
  background: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
  padding: 12px 24px;
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.8rem;
  cursor: pointer;
  transition: var(--transition-smooth);
  margin-bottom: var(--spacing-xl);
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  
  &:hover { transform: translateX(-8px); background: var(--bg-surface-alt); border-color: var(--primary); }
`;

const ProfileHero = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: var(--spacing-xl);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 200px; height: 200px;
    background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
    opacity: 0.3;
  }
`;

const AvatarLarge = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 20px;
  background: var(--bg-surface-alt);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  border: 1.5px solid var(--border);
  box-shadow: var(--shadow-subtle);
`;

const ProfileInfo = styled.div`
  flex: 1;
  h2 { font-size: 2.8rem; color: var(--text-primary); margin-bottom: 8px; letter-spacing: -0.02em; }
  .meta { color: var(--text-secondary); font-weight: 700; font-size: 1rem; display: flex; align-items: center; gap: 12px; opacity: 0.8; }
`;

const StatusBadge = styled.span`
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${p => p.$active ? 'rgba(76, 175, 80, 0.1)' : 'rgba(212, 106, 79, 0.1)'};
  color: ${p => p.$active ? '#4CAF50' : '#FF5252'};
  border: 1px solid currentColor;
`;

const ActionBtn = styled.button`
  padding: 12px 24px;
  background: var(--primary);
  color: var(--text-inverse);
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: var(--transition-smooth);
  box-shadow: var(--shadow-subtle);

  &:hover { background: var(--accent); color: var(--text-inverse); transform: translateY(-3px); box-shadow: var(--shadow-premium); }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
`;

const MetricCard = styled.div`
  background: var(--bg-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
  
  .label { font-size: 0.7rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px; opacity: 0.7; }
  .value { font-size: 2rem; font-weight: 900; color: var(--text-primary); letter-spacing: -0.01em; }
  .sub { font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); margin-top: 8px; }
`;

const LogSection = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: var(--spacing-xl);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  color: var(--text-primary);
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchBox = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  input { flex: 1; padding: 16px 20px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-surface-alt); color: var(--text-primary); font-weight: 700; font-size: 0.95rem; &:focus { outline: none; border-color: var(--accent); } }
  select { padding: 12px 24px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-surface-alt); color: var(--text-primary); font-weight: 900; font-size: 0.85rem; text-transform: uppercase; }
`;

const EliteTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  thead th { padding: 16px; text-align: left; font-size: 0.7rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; border-bottom: 1px solid var(--border); }
  tbody td { padding: 20px 16px; border-bottom: 1px solid var(--border); font-size: 0.95rem; font-weight: 700; color: var(--text-primary); }
  tbody tr:hover { background: var(--bg-surface-alt); }
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

const ModalContent = styled.div`
  background: var(--bg-surface);
  padding: var(--spacing-xxl);
  border-radius: var(--radius-card);
  width: 600px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-premium);
  animation: entrance 0.4s ease;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  label { display: block; font-size: 0.75rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px; }
  input { width: 100%; padding: 18px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg-surface-alt); color: var(--text-primary); font-weight: 700; &:focus { outline: none; border-color: var(--accent); } }
`;

// ===== COMPONENT =====
const AdminFarmerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', phone: '', address: '', city: '', cnic: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/admin/farmers/${id}/detail`)
      .then(res => {
        setData(res.data);
        const { farmer } = res.data;
        setEditForm({ first_name: farmer.first_name, last_name: farmer.last_name, phone: farmer.phone?.[0] || '', address: farmer.address || '', city: farmer.city || '', cnic: farmer.cnic || '' });
      })
      .catch(() => alert('Record discovery failure.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/admin/farmers/${id}`, { ...editForm, phone: [editForm.phone] });
      setData({ ...data, farmer: res.data.farmer });
      setShowEditModal(false);
    } catch (err) { alert('Authorization protocol failure.'); }
    finally { setSaving(false); }
  };

  const orders = useMemo(() => {
    if (!data) return [];
    return data.orders.filter(o => {
      const matchSearch = String(o._id).toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [data, search, statusFilter]);

  if (loading) return <PageContainer><h2 style={{color:'var(--primary)'}}>Analyzing Stakeholder DNA...</h2></PageContainer>;
  if (!data) return <PageContainer><h2 style={{color:'var(--primary)'}}>Registry Baseline Not Found</h2></PageContainer>;

  const { farmer, summary } = data;

  return (
    <PageContainer>
      <BackBtn onClick={() => navigate('/admin/farmers')}>← Registry Index</BackBtn>

      <ProfileHero>
        <AvatarLarge>👤</AvatarLarge>
        <ProfileInfo>
          <div style={{display:'flex', alignItems:'center', gap:'20px', marginBottom:'8px'}}>
            <h2>{farmer.first_name} {farmer.last_name}</h2>
            <StatusBadge $active={farmer.isActive !== false}>{farmer.isActive === false ? 'Suspended' : 'Verified Stakeholder'}</StatusBadge>
          </div>
          <div className="meta">
            {farmer.phone?.[0] || farmer.phone} · {farmer.email} · ENLISTED: {new Date(farmer.createdAt).toLocaleDateString()}
          </div>
          <div style={{fontSize:'0.65rem', color:'var(--text-secondary)', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', marginTop:'12px'}}>ENTITY_ID: {farmer._id.toUpperCase()}</div>
        </ProfileInfo>
        <ActionBtn onClick={() => setShowEditModal(true)}>Edit Profile Profile</ActionBtn>
      </ProfileHero>

      <MetricsGrid>
        <MetricCard>
          <div className="label">Gross Order Volume</div>
          <div className="value">Rs. {summary.totalPurchased.toLocaleString()}</div>
          <div className="sub">{summary.orderCount} Institutional Orders</div>
        </MetricCard>
        <MetricCard>
          <div className="label">Monetary Settlement</div>
          <div className="value" style={{color:'var(--primary)'}}>Rs. {summary.totalPaid.toLocaleString()}</div>
          <div className="sub">{summary.completedCount} Cleared Transactions</div>
        </MetricCard>
        <MetricCard style={{background: summary.totalBalance > 0 ? 'rgba(212, 106, 79, 0.05)' : 'var(--bg-surface)'}}>
          <div className="label">Open Debentures</div>
          <div className="value" style={{color: summary.totalBalance > 0 ? '#FF5252' : 'var(--primary)'}}>Rs. {summary.totalBalance.toLocaleString()}</div>
          <div className="sub">{summary.totalBalance > 0 ? 'Urgent Liquidity Alert' : 'Credit Baseline Neutral'}</div>
        </MetricCard>
        <MetricCard>
          <div className="label">Operational Efficiency</div>
          <div className="value">{((summary.completedCount / (summary.orderCount || 1)) * 100).toFixed(1)}%</div>
          <div className="sub">{summary.canceledCount} Voided · {summary.pendingCount} Pending</div>
        </MetricCard>
      </MetricsGrid>

      <LogSection>
        <SectionTitle>
          Operational Timeline
          <ActionBtn onClick={() => generateOrderReport({ orders: data.orders, title: 'Strategic Account Audit', userName: `${farmer.first_name} ${farmer.last_name}`, dateRange: 'Full History' })}>
            📥 Generate Audit Report
          </ActionBtn>
        </SectionTitle>

        <SearchBox>
          <input placeholder="Filter by transaction hash or ID..." value={search} onChange={e => setSearch(e.target.value)} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Operations</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Voided</option>
          </select>
        </SearchBox>

        <EliteTable>
          <thead>
            <tr>
              <th>Ref ID</th>
              <th>Deployment Date</th>
              <th>Log Summary</th>
              <th>Gross Value</th>
              <th>Settled</th>
              <th>Protocol Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td style={{fontFamily:'JetBrains Mono, monospace', fontSize:'0.85rem'}}>#{o._id.slice(-8).toUpperCase()}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td style={{fontSize:'0.8rem'}}>{o.items.map(i => `${i.product?.name || 'Asset'} x ${i.quantity}`).join(', ')}</td>
                <td style={{fontWeight:900}}>Rs. {o.grandTotal.toLocaleString()}</td>
                <td style={{color: o.amountPaid >= o.grandTotal ? 'var(--primary)' : '#FF5252'}}>Rs. {o.amountPaid.toLocaleString()}</td>
                <td><StatusBadge $active={o.status === 'Completed'}>{o.status}</StatusBadge></td>
              </tr>
            ))}
          </tbody>
        </EliteTable>
      </LogSection>

      {showEditModal && (
        <ModalOverlay onClick={() => setShowEditModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h3 style={{fontSize:'2.2rem', marginBottom:'32px'}}>Identity Management</h3>
            <form onSubmit={handleUpdate}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                <FormGroup><label>First Name</label><input value={editForm.first_name} onChange={e => setEditForm({...editForm, first_name: e.target.value})} required /></FormGroup>
                <FormGroup><label>Last Name</label><input value={editForm.last_name} onChange={e => setEditForm({...editForm, last_name: e.target.value})} required /></FormGroup>
              </div>
              <FormGroup><label>Operational Contact</label><input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} required /></FormGroup>
              <FormGroup><label>National ID / CNIC</label><input value={editForm.cnic} onChange={e => setEditForm({...editForm, cnic: e.target.value})} /></FormGroup>
              <div style={{display:'flex', gap:'16px', marginTop:'32px'}}>
                <ActionBtn type="button" onClick={() => setShowEditModal(false)} style={{flex:1, background:'var(--bg-surface-alt)', color:'var(--text-primary)', border:'1px solid var(--border)'}}>Dismiss</ActionBtn>
                <ActionBtn type="submit" disabled={saving} style={{flex:2}}>{saving ? 'COMMITING...' : 'AUTHORIZE UPDATE'}</ActionBtn>
              </div>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default AdminFarmerDetail;
