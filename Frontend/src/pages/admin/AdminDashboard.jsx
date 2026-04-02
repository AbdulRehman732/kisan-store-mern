import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

// ===== STYLED COMPONENTS =====
const PageContainer = styled.div`
  padding: var(--spacing-xl);
  animation: entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const Header = styled.div`
  margin-bottom: var(--spacing-xxl);
`;

const Title = styled.h2`
  font-size: 3.5rem;
  color: var(--text-primary);
  margin-bottom: 8px;
  
  small {
    display: block;
    font-size: 1.1rem;
    color: var(--text-secondary);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.7;
    margin-top: 12px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xxl);
`;

const StatCard = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: var(--spacing-xl);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
  transition: var(--transition-smooth);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -50%; left: -50%; width: 200%; height: 200%;
    background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
    opacity: 0;
    transition: var(--transition-smooth);
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-premium);
    border-color: var(--accent);
    &::after { opacity: 0.1; }
  }
`;

const IconBox = styled.div`
  width: 54px;
  height: 54px;
  background: var(--bg-surface-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-size: 1.8rem;
  margin-bottom: 24px;
  border: 1px solid var(--border);
`;

const Val = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
`;

const Lab = styled.div`
  font-size: 0.75rem;
  font-weight: 900;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xxl);
  @media (max-width: 1200px) { grid-template-columns: 1fr; }
`;

const DataCard = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: var(--spacing-xl);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  h3 { font-size: 1.8rem; color: var(--text-primary); }
`;

const EliteTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  thead th {
    padding: 20px;
    text-align: left;
    font-size: 0.72rem;
    font-weight: 900;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    border-bottom: 1px solid var(--border);
  }

  tbody td {
    padding: 24px 20px;
    border-bottom: 1px solid var(--border);
    color: var(--text-primary);
    font-weight: 600;
    font-size: 0.95rem;
  }

  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover td { background: var(--bg-surface-alt); }
`;

const StatusPill = styled.span`
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${p => p.$s === 'Completed' ? 'rgba(76, 175, 80, 0.1)' : p.$s === 'Cancelled' ? 'rgba(212, 106, 79, 0.1)' : 'rgba(245, 182, 17, 0.1)'};
  color: ${p => p.$s === 'Completed' ? '#4CAF50' : p.$s === 'Cancelled' ? '#d46a4f' : '#F5B611'};
  border: 1px solid currentColor;
`;

// ===== COMPONENT =====
const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'150px'}}><div style={{width:'60px',height:'60px',border:'5px solid var(--border)',borderTopColor:'var(--primary)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} /></div>;
  if (!data) return null;

  const { stats, monthlyOrders, statusBreakdown, recentOrders } = data;
  const chartColors = ['var(--primary)', 'var(--accent)', '#FF5252', '#2196F3'];

  return (
    <PageContainer>
      <Header>
        <Title>
          Institutional Analytics
          <small>Nexus Command Intelligence — Baseline Audit</small>
        </Title>
      </Header>

      <StatsGrid>
        {[
          { i: '👥', l: 'Stakeholders', v: stats?.totalFarmers || 0 },
          { i: '📦', l: 'Authorized Orders', v: stats?.totalOrders || 0 },
          { i: '💰', l: 'Global Revenue', v: `Rs.${(stats?.totalRevenue || 0).toLocaleString()}` },
          { i: '📉', l: 'System Liability', v: `Rs.${(stats?.totalDebt || 0).toLocaleString()}` },
        ].map((s, idx) => (
          <StatCard key={idx}>
            <IconBox>{s.i}</IconBox>
            <Val>{s.v}</Val>
            <Lab>{s.l}</Lab>
          </StatCard>
        ))}
      </StatsGrid>

      <SectionGrid>
        <DataCard>
          <CardHeader><h3>Operational Velocity</h3></CardHeader>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyOrders || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-premium)' }}
                itemStyle={{ color: 'var(--primary)', fontWeight: 800 }}
              />
              <Bar dataKey="orders" fill="var(--primary)" radius={[10, 10, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </DataCard>

        <DataCard>
          <CardHeader><h3>Order Distribution</h3></CardHeader>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={statusBreakdown || []}
                innerRadius={75}
                outerRadius={105}
                paddingAngle={8}
                dataKey="value"
              >
                {(statusBreakdown || []).map((_, i) => (
                  <Cell key={i} fill={chartColors[i % chartColors.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </DataCard>
      </SectionGrid>

      <DataCard style={{marginBottom: 'var(--spacing-xl)'}}>
        <CardHeader>
          <h3>Recent Procurement Logs</h3>
          <button onClick={() => navigate('/admin/orders')} style={{background:'var(--bg-surface-alt)', border:'1px solid var(--border)', color:'var(--text-primary)', padding:'10px 24px', borderRadius:'var(--radius-pill)', fontWeight:900, fontSize:'0.75rem', cursor:'pointer'}}>AUDIT ALL</button>
        </CardHeader>
        <div style={{overflowX:'auto'}}>
          <EliteTable>
            <thead>
              <tr>
                <th>Stakeholder Entity</th>
                <th>Magnitude</th>
                <th>Financial Valuation</th>
                <th>Auth Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map(o => (
                <tr key={o._id}>
                  <td style={{fontWeight:900, color:'var(--primary)'}}>{o.farmer?.first_name} {o.farmer?.last_name}</td>
                  <td>{o.items?.length} units</td>
                  <td style={{fontWeight:900}}>Rs. {o.totalAmount?.toLocaleString()}</td>
                  <td>{new Date(o.pickupDate).toLocaleDateString()}</td>
                  <td><StatusPill $s={o.status}>{o.status}</StatusPill></td>
                </tr>
              ))}
            </tbody>
          </EliteTable>
        </div>
      </DataCard>

      <DataCard>
        <CardHeader>
          <h3>Nexus System Audit</h3>
          <Lab>Latest Security Events</Lab>
        </CardHeader>
        <div style={{overflowX:'auto'}}>
          <EliteTable>
            <thead>
              <tr>
                <th>Protocol Action</th>
                <th>Authorized Agent</th>
                <th>Resource Target</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id}>
                  <td><span style={{background:'var(--bg-surface-alt)', padding:'4px 10px', borderRadius:'6px', fontSize:'0.7rem', fontWeight:900, color:'var(--primary)'}}>{log.action}</span></td>
                  <td style={{fontWeight:800}}>{log.admin?.first_name || 'System Auto'}</td>
                  <td style={{fontSize:'0.85rem', color:'var(--text-secondary)'}}>{log.resourceType} ID: {log.resourceId ? log.resourceId.slice(-8) : 'N/A'}</td>
                  <td style={{fontSize:'0.85rem', opacity:0.7}}>{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </EliteTable>
        </div>
      </DataCard>
    </PageContainer>
  );
};

export default AdminDashboard;