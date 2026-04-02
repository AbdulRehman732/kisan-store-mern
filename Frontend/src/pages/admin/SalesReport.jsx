import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

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
  background: ${p => p.$variant === 'pdf' ? 'var(--bg-surface-alt)' : 'var(--primary)'};
  color: ${p => p.$variant === 'pdf' ? 'var(--text-primary)' : 'var(--text-inverse)'};
  border: 1px solid ${p => p.$variant === 'pdf' ? 'var(--border)' : 'var(--primary)'};
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;

  &:hover { 
    background: ${p => p.$variant === 'pdf' ? 'var(--primary)' : 'var(--accent)'}; 
    color: var(--text-inverse); 
    transform: translateY(-3px); 
    box-shadow: var(--shadow-premium);
    border-color: transparent;
  }
`;

const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
`;

const MetricCard = styled.div`
  background: ${p => p.$highlight ? 'var(--primary)' : 'var(--bg-surface)'};
  color: ${p => p.$highlight ? 'var(--text-inverse)' : 'var(--text-primary)'};
  padding: var(--spacing-lg);
  border-radius: var(--radius-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
  text-align: center;
  transition: var(--transition-smooth);

  .icon { font-size: 2.5rem; margin-bottom: 12px; opacity: 0.9; }
  .value { font-size: 2rem; font-weight: 900; letter-spacing: -0.02em; }
  .label { font-size: 0.72rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6; margin-top: 8px; }
`;

const ChartCard = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
  
  h3 { color: var(--text-primary); font-size: 1.6rem; margin-bottom: 32px; letter-spacing: -0.01em; }
`;

const FilterStrip = styled.div`
  background: var(--bg-surface-alt);
  padding: 24px 32px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  align-items: flex-end;
  margin-bottom: var(--spacing-xl);
`;

const FormGroup = styled.div`
  flex: 1;
  min-width: 220px;
  label { display: block; font-size: 0.7rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.12em; }
  input, select {
    width: 100%;
    padding: 16px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    color: var(--text-primary);
    font-weight: 700;
    transition: var(--transition-smooth);
    &:focus { outline: none; border-color: var(--accent); }
  }
`;

const TableCard = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-subtle);
  border: 1px solid var(--border);
`;

const EliteTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  thead th { padding: 24px; text-align: left; font-size: 0.72rem; font-weight: 900; color: var(--text-inverse); text-transform: uppercase; background: var(--primary); }
  tbody td { padding: 24px; border-bottom: 1px solid var(--border); color: var(--text-primary); font-weight: 600; }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: var(--bg-surface-alt); }
`;

const StatusBadge = styled.span`
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${p => p.$status === 'Completed' ? 'rgba(76, 175, 80, 0.1)' : p.$status === 'Cancelled' ? 'rgba(212, 106, 79, 0.1)' : 'rgba(245, 182, 17, 0.1)'};
  color: ${p => p.$status === 'Completed' ? '#4CAF50' : p.$status === 'Cancelled' ? '#FF5252' : '#F5B611'};
  border: 1px solid currentColor;
`;

// ===== COMPONENT =====
const SalesReport = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    api.get('/orders').then(res => setOrders(res.data.orders || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter(o => {
    const date = new Date(o.createdAt);
    if (dateFrom && date < new Date(dateFrom)) return false;
    if (dateTo && date > new Date(dateTo + 'T23:59:59')) return false;
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    return true;
  });

  const totalRevenue = filtered.filter(o => o.status === 'Completed').reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const categorySales = filtered.filter(o => o.status === 'Completed').reduce((acc, o) => {
    o.items?.forEach(item => {
      const cat = item.product?.category || 'General';
      acc[cat] = (acc[cat] || 0) + (item.price * item.quantity);
    });
    return acc;
  }, {});

  const barData = Object.keys(categorySales).map(cat => ({ name: cat, revenue: categorySales[cat] })).sort((a,b) => b.revenue - a.revenue);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.setTextColor(43, 57, 34);
    doc.text('Strategic Performance Report', 14, 25);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(100, 100, 100);
    doc.text(`Institutional Generation Date: ${new Date().toLocaleString()}`, 14, 34);
    autoTable(doc, {
      startY: 45,
      head: [['TRACE ID', 'ENTITY', 'MANIFEST', 'VALUATION', 'STATUS', 'DATE']],
      body: filtered.map(o => [o._id.slice(-8).toUpperCase(), `${o.farmer?.first_name} ${o.farmer?.last_name}`, o.items?.map(i => i.product?.name).join(', '), `Rs. ${o.totalAmount?.toLocaleString()}`, o.status.toUpperCase(), new Date(o.createdAt).toLocaleDateString()]),
      headStyles: { fillColor: [43, 57, 34] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    doc.save("agrotek_strategic_report.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map(o => ({ 'Trace ID': o._id.toUpperCase(), 'Entity': `${o.farmer?.first_name} ${o.farmer?.last_name}`, 'Valuation': o.totalAmount, 'Status': o.status, 'Date': new Date(o.createdAt).toLocaleDateString() })));
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Sales Data');
    XLSX.writeFile(wb, "agrotek_data_export.xlsx");
  };

  const COLORS = ['#2B3922', '#F5B611', '#5C7A4A', '#A88D3E', '#1A2A12'];

  return (
    <PageContainer>
      <Topbar>
        <PageTitle>Operational Intelligence <small>INSTITUTIONAL METRICS & ANALYTICS</small></PageTitle>
        <div style={{display:'flex', gap:'16px'}}>
          <ActionBtn $variant="pdf" onClick={exportPDF}>📄 Export Strategic PDF</ActionBtn>
          <ActionBtn onClick={exportExcel}>📈 Export Data XLSX</ActionBtn>
        </div>
      </Topbar>

      <AnalyticsGrid>
        {[
          {i:'📋',l:'Total Manifests',v:filtered.length},
          {i:'✅',l:'Fulfillment Count',v:filtered.filter(o=>o.status==='Completed').length},
          {i:'🕒',l:'In-Flight Pipeline',v:filtered.filter(o=>o.status==='Pending').length},
          {i:'💰',l:'Net Realized Revenue',v:`Rs. ${totalRevenue.toLocaleString()}`, highlight: true},
        ].map((s,i) => (
          <MetricCard key={i} $highlight={s.highlight}>
            <div className="icon">{s.icon}</div>
            <div className="value">{s.val}</div>
            <div className="label">{s.label}</div>
          </MetricCard>
        ))}
      </AnalyticsGrid>

      {!loading && barData.length > 0 && (
        <ChartCard>
          <h3>Strategic Revenue Allocation (by Category)</h3>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'var(--text-secondary)', fontSize:12, fontWeight:700}} height={60} interval={0} angle={-20} textAnchor="end" />
                <YAxis axisLine={false} tickLine={false} tick={{fill:'var(--text-secondary)', fontSize:12, fontWeight:700}} tickFormatter={v => `Rs. ${v/1000}k`} />
                <Tooltip cursor={{fill:'var(--bg-surface-alt)'}} contentStyle={{borderRadius:'12px', border:'none', boxShadow:'var(--shadow-premium)', fontWeight:900}} />
                <Bar dataKey="revenue" radius={[10, 10, 0, 0]} barSize={50}>
                  {barData.map((e,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <FilterStrip>
        <FormGroup><label>Audit Start Date</label><input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></FormGroup>
        <FormGroup><label>Audit End Date</label><input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} /></FormGroup>
        <FormGroup><label>Operational Scope</label><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="All">Global Manifests</option><option value="Pending">Pending Fulfillment</option><option value="Completed">Deployed / Finalized</option><option value="Cancelled">Voided / Aborted</option></select></FormGroup>
        <ActionBtn onClick={() => {setDateFrom(''); setDateTo(''); setStatusFilter('All');}} style={{background:'var(--bg-app)', color:'var(--text-primary)', border:'1px solid var(--border)', height:'56px'}}>Reset Parameters</ActionBtn>
      </FilterStrip>

      {loading ? (
        <div style={{display:'flex',justifyContent:'center',padding:'120px'}}><div style={{width:'60px',height:'60px',border:'5px solid var(--border)',borderTopColor:'var(--primary)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} /></div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign:'center', padding:'100px', background:'var(--bg-surface)', borderRadius:'var(--radius-card)', border:'1px dashed var(--border)'}}>
          <h3 style={{color:'var(--text-secondary)'}}>No matching analytical results found.</h3>
        </div>
      ) : (
        <TableCard>
          <EliteTable>
            <thead>
              <tr><th>Trace ID & Entity</th><th>Asset Manifest</th><th>Institutional Valuation</th><th>Audit Date</th><th>Protocol Status</th></tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o._id}>
                  <td><div style={{fontWeight:900}}>{o.farmer?.first_name} {o.farmer?.last_name}</div><div style={{fontSize:'0.65rem', color:'var(--text-secondary)', fontWeight:800}}>TRACE: #{o._id.slice(-8).toUpperCase()}</div></td>
                  <td style={{fontSize:'0.85rem', color:'var(--text-secondary)', maxWidth:'300px'}}>{o.items?.map(i => i.product?.name).join(', ')}</td>
                  <td style={{fontWeight:900}}>Rs. {o.totalAmount?.toLocaleString()}</td>
                  <td style={{color:'var(--text-secondary)', fontSize:'0.9rem'}}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td><StatusBadge $status={o.status}>{o.status}</StatusBadge></td>
                </tr>
              ))}
            </tbody>
          </EliteTable>
        </TableCard>
      )}
    </PageContainer>
  );
};

export default SalesReport;