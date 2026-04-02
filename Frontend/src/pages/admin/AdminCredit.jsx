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

const CountBadge = styled.span`
  background: var(--bg-surface-alt);
  color: var(--primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  padding: 8px 16px;
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CreditGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: var(--spacing-xl);
`;

const DebtCard = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: var(--spacing-xl);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
  transition: var(--transition-smooth);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-10px);
    border-color: var(--accent);
    box-shadow: var(--shadow-premium);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 4px;
    background: #FF5252;
    opacity: 0.6;
  }
`;

const StakeholderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;

  .avatar {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: var(--bg-surface-alt);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    font-weight: 900;
    color: var(--primary);
    border: 1.5px solid var(--border);
  }

  .details {
    h4 { font-size: 1.4rem; color: var(--text-primary); margin-bottom: 4px; letter-spacing: -0.01em; }
    p { font-size: 0.8rem; color: var(--text-secondary); font-weight: 700; opacity: 0.7; letter-spacing: 0.02em; }
  }
`;

const DebtMetric = styled.div`
  background: rgba(212, 106, 79, 0.05);
  padding: 24px;
  border-radius: var(--radius-md);
  border: 1px dashed #FF5252;
  margin-bottom: 32px;
  
  .label { font-size: 0.7rem; font-weight: 900; color: #FF5252; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.1em; }
  .amount { font-size: 2.2rem; font-weight: 900; color: #FF5252; letter-spacing: -0.02em; }
`;

const InvoiceLog = styled.div`
  .log-title { font-size: 0.75rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 16px; letter-spacing: 0.1em; opacity: 0.8; }
  
  .invoice-item {
    display: flex;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
    
    &:last-child { border-bottom: none; }
    
    .invoice-id { font-family: 'JetBrains Mono', monospace; font-weight: 800; color: var(--text-primary); font-size: 0.9rem; }
    .invoice-meta { font-size: 0.7rem; color: var(--text-secondary); font-weight: 700; margin-top: 4px; }
    .invoice-val { font-weight: 900; color: var(--primary); font-size: 1.1rem; }
  }
`;

const ActionBtn = styled.button`
  width: 100%;
  padding: 22px;
  background: var(--primary);
  color: var(--text-inverse);
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.9rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-top: 32px;
  box-shadow: 0 15px 40px rgba(76, 175, 80, 0.2);
  transition: var(--transition-smooth);
  
  &:hover { background: var(--accent); color: var(--text-inverse); transform: translateY(-3px); box-shadow: var(--shadow-premium); }
`;

// ===== COMPONENT =====
const AdminCredit = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCredit = () => {
    api.get('/admin/credit-report')
      .then(r => setReports(r.data.creditReport || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCredit(); }, []);

  return (
    <PageContainer>
      <Topbar>
        <PageTitle>Credit Analysis Hub <small>STAKEHOLDER DEBT MONITORING</small></PageTitle>
        {reports.length > 0 && <CountBadge>{reports.length} ACTIVE ARREARS</CountBadge>}
      </Topbar>

      {loading ? (
        <div style={{display:'flex',justifyContent:'center',padding:'150px'}}><div style={{width:'60px',height:'60px',border:'5px solid var(--border)',borderTopColor:'var(--primary)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} /></div>
      ) : reports.length === 0 ? (
        <div style={{textAlign:'center', padding:'120px 40px', background:'var(--bg-surface)', borderRadius:'var(--radius-card)', border:'1px dashed var(--border)'}}>
          <div style={{fontSize:'5rem', marginBottom:'24px'}}>🏁</div>
          <h3>Credit Exposure Zero</h3>
          <p style={{color:'var(--text-secondary)', fontWeight:600}}>No active outstanding institutional debts recorded in the database.</p>
        </div>
      ) : (
        <CreditGrid>
          {reports.map(r => (
            <DebtCard key={r.farmer._id}>
              <StakeholderInfo>
                <div className="avatar">{r.farmer.first_name[0]}{r.farmer.last_name[0]}</div>
                <div className="details">
                  <h4>{r.farmer.first_name} {r.farmer.last_name}</h4>
                  <p>ID: {r.farmer._id.slice(-8).toUpperCase()} · {r.farmer.phone}</p>
                </div>
              </StakeholderInfo>

              <DebtMetric>
                <div className="label">Cumulative Institutional Debt</div>
                <div className="amount">Rs. {r.totalDebt.toLocaleString()}</div>
              </DebtMetric>

              <InvoiceLog>
                <div className="log-title">Unsettled Deployment Logs</div>
                {r.pendingOrders.map(o => (
                  <div key={o._id} className="invoice-item">
                    <div>
                      <div className="invoice-id">#{o._id.slice(-8).toUpperCase()}</div>
                      <div className="invoice-meta">{new Date(o.createdAt).toLocaleDateString()} · {o.itemsSummary}</div>
                    </div>
                    <div className="invoice-val">Rs. {o.due.toLocaleString()}</div>
                  </div>
                ))}
              </InvoiceLog>

              <ActionBtn onClick={() => window.location.hash = `/admin/orders`}>Authorize Settlement</ActionBtn>
            </DebtCard>
          ))}
        </CreditGrid>
      )}
    </PageContainer>
  );
};

export default AdminCredit;
