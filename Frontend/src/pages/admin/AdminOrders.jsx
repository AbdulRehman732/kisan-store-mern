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

const Filters = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 18px 28px;
  background: var(--white);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 600;
  width: 320px;
  transition: var(--transition);
  &:focus { outline: none; border-color: var(--primary); box-shadow: var(--shadow-premium); }
  &::placeholder { color: var(--text-muted); opacity: 0.5; }
`;

const FilterSelect = styled.select`
  padding: 18px 24px;
  background: var(--white);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary);
  cursor: pointer;
  transition: var(--transition);
  &:focus { outline: none; border-color: var(--primary); }
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

const StatusBadge = styled.span`
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${p =>
    p.$status === 'Completed' ? 'var(--bg-cream)' :
    p.$status === 'Cancelled' ? '#fdf2f0' :
    'var(--accent)'
  };
  color: ${p =>
    p.$status === 'Completed' ? 'var(--primary)' :
    p.$status === 'Cancelled' ? '#d46a4f' :
    'var(--primary)'
  };
  border: 1px solid var(--border-soft);
`;

const StatusSelect = styled.select`
  padding: 10px 16px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-soft);
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  background: var(--white);
  transition: var(--transition);
  color: var(--primary);

  &:focus { outline: none; border-color: var(--primary); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
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

const OrderId = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 800;
  background: var(--bg-cream);
  padding: 4px 10px;
  border-radius: 6px;
  display: inline-block;
`;

const ItemsList = styled.div`
  max-width: 280px;
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
  font-weight: 500;
`;

// ===== COMPONENT =====
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updating, setUpdating] = useState(null);

  const fetchOrders = () => {
    api.get('/orders')
      .then(res => setOrders(res.data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = orders.filter(o => {
    const matchSearch = search === '' ||
      `${o.farmer?.first_name} ${o.farmer?.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      o.farmerPhone?.includes(search) ||
      o._id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Fulfillment Update Failed');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <PageContainer>
      <Topbar>
        <PageTitle>
          Fulfillment Registry
          <CountBadge>{filtered.length} ACTIVE MANIFESTS</CountBadge>
        </PageTitle>
      </Topbar>

      <Filters>
        <SearchInput
          type="text"
          placeholder="Search by ID, Name or Contact..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <FilterSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Operations</option>
          <option value="Pending">🕒 PENDING FULFILLMENT</option>
          <option value="Completed">✅ DEPLOYED / COMPLETED</option>
          <option value="Cancelled">❌ CANCELLED / ABORTED</option>
        </FilterSelect>
      </Filters>

      {loading ? (
        <SpinnerWrap><Spinner /></SpinnerWrap>
      ) : filtered.length === 0 ? (
        <EmptyState>
          <div className="icon">📦</div>
          <h3>No manifest match found</h3>
          <p>No operational data matches the current search criteria.</p>
        </EmptyState>
      ) : (
        <TableCard>
          <TableScroll>
            <Table>
              <thead>
                <tr>
                  <th>Trace ID</th>
                  <th>Consignee</th>
                  <th>Manifest Assets</th>
                  <th>Institutional Value</th>
                  <th>Operation Date</th>
                  <th>Fulfillment Status</th>
                  <th style={{textAlign: 'right'}}>Authorization</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o._id}>
                    <td><OrderId>#{o._id.slice(-8).toUpperCase()}</OrderId></td>
                    <td>
                      <div style={{fontWeight:800, color: 'var(--primary)', fontSize: '1.1rem'}}>{o.farmer?.first_name} {o.farmer?.last_name}</div>
                      <div style={{fontSize:'0.8rem', color:'var(--text-muted)', fontWeight: 700}}>{o.farmerPhone}</div>
                    </td>
                    <td>
                      <ItemsList>
                        {o.items?.map(i => i.product?.name).join(', ')}
                      </ItemsList>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--text-charcoal)' }}>Rs. {o.totalAmount?.toLocaleString()}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                      {new Date(o.pickupDate).toLocaleDateString('en-PK', {day:'numeric', month:'short', year: 'numeric'})}
                    </td>
                    <td><StatusBadge $status={o.status}>{o.status}</StatusBadge></td>
                    <td style={{textAlign: 'right'}}>
                      <StatusSelect
                        value={o.status}
                        disabled={updating === o._id}
                        onChange={e => handleStatusChange(o._id, e.target.value)}
                      >
                        <option value="Pending">Mark Pending</option>
                        <option value="Completed">Authorize Completion</option>
                        <option value="Cancelled">Authorize Cancellation</option>
                      </StatusSelect>
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

export default AdminOrders;