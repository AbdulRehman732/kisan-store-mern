import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../../api';

// ===== ANIMATIONS =====
const spin = keyframes`to { transform: rotate(360deg); }`;
const fadeIn = keyframes`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;

// ===== STYLED COMPONENTS =====
const PageContainer = styled.div`
  padding: 40px;
  animation: ${fadeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 54px;
  flex-wrap: wrap;
  gap: 24px;
`;

const PageTitle = styled.h2`
  font-size: 3rem;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 16px;
  small { font-size: 1rem; color: var(--text-muted); font-weight: 500; font-family: 'Inter', sans-serif; }
`;

const SearchInput = styled.input`
  padding: 18px 28px;
  background: var(--white);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 600;
  width: 380px;
  transition: var(--transition);
  &:focus { outline: none; border-color: var(--primary); box-shadow: var(--shadow-premium); }
  &::placeholder { color: var(--text-muted); opacity: 0.5; }
  @media (max-width: 600px) { width: 100%; }
`;

const TableCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--border-soft);
`;

const TableScroll = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead th {
    background: var(--primary);
    padding: 24px 32px;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--white);
  }

  tbody td {
    padding: 24px 32px;
    border-bottom: 1px solid var(--bg-cream);
    color: var(--text-charcoal);
    font-weight: 600;
    vertical-align: middle;
  }

  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: var(--bg-cream); }
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: var(--bg-cream);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  flex-shrink: 0;
  border: 1px solid var(--border-soft);
`;

const FarmerCell = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;

  .name {
    font-weight: 800;
    color: var(--primary);
    font-size: 1.15rem;
  }
  .sub {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 700;
    text-transform: uppercase;
    margin-top: 4px;
    letter-spacing: 0.05em;
  }
`;

const SpinnerWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid var(--bg-cream);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: ${spin} 0.8s cubic-bezier(0.16, 1, 0.3, 1) infinite;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 100px 24px;
  background: var(--white);
  border-radius: var(--radius-card);
  border: 1px dashed var(--border-soft);

  .icon { font-size: 4rem; display: block; margin-bottom: 24px; opacity: 0.5; }
  h3 { font-size: 1.8rem; color: var(--primary); margin-bottom: 12px; }
  p { color: var(--text-muted); font-weight: 500; }
`;

const CountBadge = styled.span`
  background: var(--bg-cream);
  color: var(--primary);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-pill);
  padding: 6px 18px;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const PhoneList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.9rem;
  color: var(--text-charcoal);
  font-weight: 700;
`;

const EmailLink = styled.a`
  color: var(--text-charcoal);
  text-decoration: none;
  font-weight: 700;
  border-bottom: 2px solid transparent;
  transition: var(--transition);
  &:hover { border-bottom-color: var(--accent); color: var(--primary); }
`;

const StatusBadge = styled.span`
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--bg-cream);
  color: var(--primary);
  border: 1px solid var(--border-soft);
`;

// ===== COMPONENT =====
const AdminFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/farmers')
      .then(res => setFarmers(res.data.farmers || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = farmers.filter(f =>
    `${f.first_name} ${f.last_name} ${f.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageContainer>
      <Topbar>
        <PageTitle>
          Stakeholder Registry
          <CountBadge>{filtered.length} AUTHORIZED USERS</CountBadge>
        </PageTitle>
        <SearchInput
          type="text"
          placeholder="Search by identity or credentials..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </Topbar>

      {loading ? (
        <SpinnerWrap><Spinner /></SpinnerWrap>
      ) : filtered.length === 0 ? (
        <EmptyState>
          <div className="icon">👨‍🌾</div>
          <h3>Registry empty</h3>
          <p>No stakeholders match the specified criteria in the current view.</p>
        </EmptyState>
      ) : (
        <TableCard>
          <TableScroll>
            <Table>
              <thead>
                <tr>
                  <th>Institutional Identity</th>
                  <th>Digital Communication</th>
                  <th>Strategic Contact</th>
                  <th>Enlistment Date</th>
                  <th>Operational Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f._id}>
                    <td>
                      <FarmerCell>
                        <Avatar>👤</Avatar>
                        <div>
                          <div className="name">{f.first_name} {f.last_name}</div>
                          <div className="sub">Operational ID: {f._id.slice(-8).toUpperCase()}</div>
                        </div>
                      </FarmerCell>
                    </td>
                    <td>
                      <EmailLink href={`mailto:${f.email}`}>{f.email.toLowerCase()}</EmailLink>
                    </td>
                    <td>
                      <PhoneList>
                        {Array.isArray(f.phone) ? f.phone.map((p, i) => (
                          <div key={i}>{p}</div>
                        )) : <div>{f.phone}</div>}
                      </PhoneList>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                      {new Date(f.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <StatusBadge>Active Participant</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableScroll>
        </TableCard>
      )}
    </PageContainer>
  );
};

export default AdminFarmers;
