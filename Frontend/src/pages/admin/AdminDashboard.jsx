import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../api';

// ===== ANIMATIONS =====
const spin = keyframes`to { transform: rotate(360deg); }`;
const fadeIn = keyframes`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;

// ===== STYLED COMPONENTS =====
const PageTitle = styled.h2`
  font-size: 3rem;
  color: var(--primary);
  margin-bottom: 54px;
  animation: ${fadeIn} 0.5s ease-out;

  small {
    display: block;
    font-family: 'Inter', sans-serif;
    font-size: 1.1rem;
    color: var(--text-muted);
    font-weight: 500;
    margin-top: 12px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
`;

const StatCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-card);
  padding: 32px;
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--border-soft);
  text-align: left;
  transition: var(--transition);
  &:hover { transform: translateY(-5px); }
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 20px;
  width: 50px;
  height: 50px;
  background: var(--bg-cream);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
`;

const StatValue = styled.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 32px;
  margin-bottom: 48px;
  @media (max-width: 1100px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: var(--white);
  border-radius: var(--radius-card);
  padding: 40px;
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--border-soft);
  margin-bottom: 32px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const CardTitle = styled.h3`
  font-size: 1.8rem;
  color: var(--primary);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  thead th {
    padding: 20px;
    text-align: left;
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--text-charcoal);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border-bottom: 2px solid var(--bg-cream);
  }
  tbody td {
    padding: 20px;
    border-bottom: 1px solid var(--bg-cream);
    color: var(--text-muted);
    font-weight: 500;
  }
  tbody tr:hover { background: var(--bg-cream); }
`;

const StatusBadge = styled.span`
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  background: ${p => p.$status === 'Completed' ? 'var(--primary)' : p.$status === 'Cancelled' ? '#fdf2f0' : 'var(--accent)'};
  color: ${p => p.$status === 'Completed' ? 'var(--white)' : p.$status === 'Cancelled' ? '#d46a4f' : 'var(--primary)'};
`;

const LogTypeBadge = styled.span`
  font-size: 0.7rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  background: var(--bg-cream);
  color: var(--primary);
  text-transform: uppercase;
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
  border: 4px solid var(--bg-cream);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const ContentSection = styled.div`
  animation: ${fadeIn} 0.6s ease-out;
`;

const TableScroll = styled.div`
  overflow-x: auto;
`;

// ===== COMPONENT =====
const COLORS = ['var(--primary)', 'var(--accent)', '#d46a4f', '#1565c0'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/audit-logs?limit=10')
    ])
    .then(([dashRes, logsRes]) => {
      setData(dashRes.data);
      setLogs(logsRes.data.logs || []);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <SpinnerWrap><Spinner /></SpinnerWrap>;
  if (!data) return null;

  const { stats, monthlyOrders, statusBreakdown, recentOrders } = data;

  const statCards = [
    { icon: '👨‍🌾', label: 'Farmers', val: stats?.totalFarmers || 0 },
    { icon: '🌱', label: 'Products', val: stats?.totalProducts || 0 },
    { icon: '📦', label: 'Orders', val: stats?.totalOrders || 0 },
    { icon: '⏳', label: 'Pending', val: stats?.pendingOrders || 0 },
    { icon: '✅', label: 'Completed', val: stats?.completedOrders || 0 },
    { icon: '💰', label: 'Revenue', val: `Rs.${(stats?.totalRevenue || 0).toLocaleString()}` },
  ];

  return (
    <ContentSection>
      <PageTitle>
        Performance Insights
        <small>Real-time authoritative overview of KisanStore ecosystem</small>
      </PageTitle>

      <StatsGrid>
        {statCards.map((s, i) => (
          <StatCard key={i}>
            <StatIcon>{s.icon}</StatIcon>
            <StatValue>{s.val}</StatValue>
            <StatLabel>{s.label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      <ChartsGrid>
        <Card>
          <CardTitle style={{ marginBottom:'32px' }}>Monthly Order Trends</CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyOrders || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-cream)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'var(--bg-cream)'}} />
              <Bar dataKey="orders" fill="var(--primary)" radius={[10, 10, 0, 0]} barSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardTitle style={{ marginBottom:'32px' }}>Status Distribution</CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusBreakdown || []}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={8}
              >
                {(statusBreakdown || []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </ChartsGrid>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <button style={{ background:'var(--primary)', color:'var(--white)', padding:'10px 20px', borderRadius:'var(--radius-pill)', fontWeight:800, fontSize:'0.75rem' }}>VIEW ALL ORDERS</button>
        </CardHeader>
        <TableScroll>
          <Table>
            <thead>
              <tr>
                <th>Farmer Entity</th>
                <th>Items</th>
                <th>Transaction Value</th>
                <th>Schedule</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(recentOrders || []).map(o => (
                <tr key={o._id}>
                  <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{o.farmer?.first_name} {o.farmer?.last_name}</td>
                  <td>{o.items?.length} sku(s)</td>
                  <td style={{ fontWeight: 800, color: 'var(--text-charcoal)' }}>Rs. {o.totalAmount?.toLocaleString()}</td>
                  <td>{new Date(o.pickupDate).toLocaleDateString()}</td>
                  <td><StatusBadge $status={o.status}>{o.status}</StatusBadge></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableScroll>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Audit</CardTitle>
          <span style={{fontSize:'0.8rem', color:'var(--text-muted)', fontWeight:800}}>LATEST 10 ACTIONS</span>
        </CardHeader>
        <TableScroll>
          <Table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Admin</th>
                <th>Resource</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign:'center', padding:'40px'}}>No logs recorded</td></tr>
              ) : logs.map(log => (
                <tr key={log._id}>
                  <td><LogTypeBadge>{log.action}</LogTypeBadge></td>
                  <td style={{ fontWeight: 800 }}>{log.admin?.first_name || 'System'}</td>
                  <td>{log.resourceType}: {log.resourceId}</td>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableScroll>
      </Card>
    </ContentSection>
  );
};

export default AdminDashboard;