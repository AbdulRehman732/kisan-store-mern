import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const SearchInput = styled.input`
  padding: 18px 24px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  width: 420px;
  color: var(--text-primary);
  transition: var(--transition-smooth);
  
  &:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 15px var(--accent-glow); }
  &::placeholder { color: var(--text-secondary); opacity: 0.4; }
  @media (max-width: 600px) { width: 100%; }
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
  
  thead th {
    background: var(--primary);
    padding: 24px;
    text-align: left;
    font-size: 0.72rem;
    font-weight: 900;
    color: var(--text-inverse);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  tbody td {
    padding: 24px;
    border-bottom: 1px solid var(--border);
    color: var(--text-primary);
    font-weight: 600;
    vertical-align: middle;
  }

  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: var(--bg-surface-alt); }
`;

const Avatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: var(--bg-surface-alt);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  border: 1px solid var(--border);
  transition: var(--transition-smooth);
`;

const StakeholderCell = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  cursor: pointer;
  
  &:hover {
    ${Avatar} { background: var(--primary); color: var(--text-inverse); transform: scale(1.1); }
    .name { color: var(--accent); transform: translateX(8px); }
  }

  .name { font-weight: 900; color: var(--text-primary); fontSize: 1.25rem; transition: var(--transition-smooth); }
  .id-label { font-size: 0.7rem; color: var(--text-secondary); font-weight: 800; text-transform: uppercase; margin-top: 4px; letter-spacing: 0.05em; opacity: 0.7; }
`;

const StatusBadge = styled.span`
  padding: 8px 16px;
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
  padding: 10px 18px;
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.72rem;
  text-transform: uppercase;
  cursor: pointer;
  background: ${p => p.$warning ? 'rgba(212, 106, 79, 0.1)' : 'var(--primary)'};
  color: ${p => p.$warning ? '#FF5252' : 'var(--text-inverse)'};
  border: 1px solid ${p => p.$warning ? '#FF5252' : 'var(--primary)'};
  transition: var(--transition-smooth);

  &:hover {
    background: ${p => p.$warning ? '#FF5252' : 'var(--accent)'};
    color: var(--text-inverse);
    transform: translateY(-2px);
    box-shadow: var(--shadow-premium);
  }
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
  padding: var(--spacing-xl);
`;

const ModalCard = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: var(--spacing-xxl);
  width: 100%;
  max-width: 480px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-premium);
  text-align: center;
  animation: entrance 0.4s ease;
`;

// ===== COMPONENT =====
const AdminFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmToggle, setConfirmToggle] = useState(null);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    api.get(`/admin/farmers?page=${page}&limit=10&search=${debouncedSearch}`)
      .then(res => {
        setFarmers(res.data.farmers || []);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages);
          setTotalRecords(res.data.pagination.totalRecords);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, debouncedSearch]);

  const handleStatusUpdate = async () => {
    if (!confirmToggle) return;
    try {
      await api.put(`/admin/farmers/${confirmToggle._id}/status`, { isActive: !confirmToggle.isActive });
      setFarmers(farmers.map(f => f._id === confirmToggle._id ? { ...f, isActive: !f.isActive } : f));
      setConfirmToggle(null);
    } catch (err) { alert(err.response?.data?.message || 'Authorization protocol failure.'); }
  };

  return (
    <PageContainer>
      <Topbar>
        <PageTitle>Stakeholder Registry <small>SYSTEM-WIDE USER INDEX</small></PageTitle>
        <SearchInput
          placeholder="Analyze identity, entity or contact metadata..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </Topbar>

      {loading ? (
        <div style={{display:'flex',justifyContent:'center',padding:'150px'}}><div style={{width:'60px',height:'60px',border:'5px solid var(--border)',borderTopColor:'var(--primary)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} /></div>
      ) : farmers.length === 0 ? (
        <div style={{textAlign:'center', padding:'120px 40px', background:'var(--bg-surface)', borderRadius:'var(--radius-card)', border:'1px dashed var(--border)'}}>
          <div style={{fontSize:'5rem', marginBottom:'24px'}}>👨‍🌾</div>
          <h3>Registry Baseline Empty</h3>
          <p>No active results found matching the current database query.</p>
        </div>
      ) : (
        <TableCard>
          <EliteTable>
            <thead>
              <tr>
                <th>Institutional Identity</th>
                <th>Digital Comms</th>
                <th>Strategic Contact</th>
                <th>Authorized On</th>
                <th>Status & Ops</th>
              </tr>
            </thead>
            <tbody>
              {farmers.map(f => (
                <tr key={f._id}>
                  <td>
                    <StakeholderCell onClick={() => navigate(`/admin/farmers/${f._id}`)}>
                      <Avatar>👤</Avatar>
                      <div>
                        <div className="name">{f.first_name} {f.last_name}</div>
                        <div className="id-label">ENTITY ID: {f._id.slice(-8).toUpperCase()}</div>
                      </div>
                    </StakeholderCell>
                  </td>
                  <td><a href={`mailto:${f.email}`} style={{color:'var(--text-primary)', fontWeight:900, textDecoration:'none', borderBottom:'1px solid var(--border)'}}>{f.email.toLowerCase()}</a></td>
                  <td>
                    <div style={{display:'flex', flexDirection:'column', gap:'4px', fontWeight:800, color:'var(--text-secondary)'}}>
                      {Array.isArray(f.phone) ? f.phone.map((p, i) => <div key={i}>{p}</div>) : <div>{f.phone}</div>}
                    </div>
                  </td>
                  <td style={{color:'var(--text-secondary)', fontWeight:700, fontSize:'0.9rem'}}>
                    {new Date(f.createdAt).toLocaleDateString('en-PK', { day:'numeric', month:'short', year:'numeric' })}
                  </td>
                  <td>
                    <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
                      <StatusBadge $active={f.isActive !== false}>{f.isActive === false ? 'Suspended' : 'Verified'}</StatusBadge>
                      <ActionBtn $warning={f.isActive} onClick={() => setConfirmToggle(f)}>
                        {f.isActive ? 'Suspend' : 'Activate'}
                      </ActionBtn>
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
          <ActionBtn onClick={() => setPage(p => p - 1)} disabled={page === 1} style={{background:'var(--bg-surface-alt)', color:'var(--text-primary)', border:'1px solid var(--border)'}}>← PREVIOUS</ActionBtn>
          <span style={{fontWeight:900, color:'var(--primary)'}}>{page} / {totalPages}</span>
          <ActionBtn onClick={() => setPage(p => p + 1)} disabled={page === totalPages} style={{background:'var(--bg-surface-alt)', color:'var(--text-primary)', border:'1px solid var(--border)'}}>NEXT →</ActionBtn>
        </div>
      )}

      {confirmToggle && (
        <ModalOverlay onClick={() => setConfirmToggle(null)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <div style={{fontSize:'4rem', marginBottom:'24px'}}>{confirmToggle.isActive ? '🔒' : '🔓'}</div>
            <h3 style={{fontSize:'2rem', marginBottom:'12px'}}>Protocol Authorization</h3>
            <p style={{color:'var(--text-secondary)', fontWeight:600, marginBottom:'32px', lineHeight:1.6}}>
              Confirm the {confirmToggle.isActive ? 'SUSPENSION' : 'ACTIVATION'} of stakeholder "{confirmToggle.first_name} {confirmToggle.last_name}" within the institutional database.
            </p>
            <div style={{display:'flex', gap:'16px'}}>
              <ActionBtn onClick={() => setConfirmToggle(null)} style={{flex:1, background:'var(--bg-surface-alt)', color:'var(--text-primary)', border:'1px solid var(--border)'}}>DISMISS</ActionBtn>
              <ActionBtn onClick={handleStatusUpdate} style={{flex:2, background: confirmToggle.isActive ? '#FF5252' : 'var(--primary)', borderColor: confirmToggle.isActive ? '#FF5252' : 'var(--primary)'}}>CONFIRM PROTOCOL</ActionBtn>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default AdminFarmers;