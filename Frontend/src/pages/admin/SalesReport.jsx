import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

const BtnGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const ExportBtn = styled.button`
  padding: 16px 32px;
  border-radius: var(--radius-pill);
  border: 1px solid ${p => p.$variant === 'pdf' ? 'var(--border-soft)' : 'var(--text-charcoal)'};
  background: ${p => p.$variant === 'pdf' ? 'var(--bg-cream)' : 'var(--text-charcoal)'};
  color: ${p => p.$variant === 'pdf' ? 'var(--primary)' : 'var(--white)'};
  font-weight: 800;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: var(--transition);
  box-shadow: ${p => p.$variant === 'pdf' ? 'none' : 'var(--shadow-premium)'};

  &:hover {
    background: var(--primary);
    color: var(--white);
    transform: translateY(-3px);
    border-color: var(--primary);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin-bottom: 54px;
`;

const StatCard = styled.div`
  background: ${p => p.$highlight ? 'var(--primary)' : 'var(--white)'};
  color: ${p => p.$highlight ? 'var(--white)' : 'var(--primary)'};
  border-radius: var(--radius-card);
  padding: 40px;
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--border-soft);
  text-align: center;
  transition: var(--transition);

  &:hover { transform: translateY(-5px); }

  .icon { font-size: 2.2rem; margin-bottom: 16px; opacity: 0.9; }
  .val { font-size: 1.8rem; font-weight: 900; letter-spacing: -0.02em; }
  .label { 
    font-size: 0.75rem; 
    color: ${p => p.$highlight ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)'}; 
    text-transform: uppercase; 
    font-weight: 800; 
    letter-spacing: 0.1em; 
    margin-top: 8px; 
  }
`;

const FilterCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-sm);
  padding: 32px 40px;
  margin-bottom: 40px;
  border: 1px solid var(--border-soft);
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  align-items: flex-end;
  box-shadow: var(--shadow-premium);
`;

const FormGroup = styled.div`
  flex: 1;
  min-width: 200px;
  
  label {
    display: block;
    font-size: 0.7rem;
    font-weight: 800;
    color: var(--primary);
    text-transform: uppercase;
    margin-bottom: 12px;
    letter-spacing: 0.12em;
  }

  input, select {
    width: 100%;
    padding: 16px 20px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--bg-cream);
    background: var(--bg-cream);
    font-size: 0.95rem;
    color: var(--text-charcoal);
    font-weight: 700;
    transition: var(--transition);

    &:focus { outline: none; border-color: var(--primary); background: var(--white); }
  }
`;

const ResetBtn = styled.button`
  padding: 16px 24px;
  background: var(--bg-cream);
  color: var(--primary);
  border: none;
  border-radius: var(--radius-pill);
  cursor: pointer;
  font-weight: 800;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: var(--transition);
  &:hover { background: var(--white); border: 1px solid var(--primary); }
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
  
  .icon { font-size: 4rem; opacity: 0.3; margin-bottom: 24px; }
  h3 { font-size: 1.8rem; color: var(--primary); }
`;

const ItemsList = styled.div`
  max-width: 280px;
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
  font-weight: 500;
`;

// ===== COMPONENT =====
const SalesReport = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter(o => {
    const date = new Date(o.createdAt);
    if (dateFrom && date < new Date(dateFrom)) return false;
    if (dateTo && date > new Date(dateTo + 'T23:59:59')) return false;
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    return true;
  });

  const totalRevenue = filtered
    .filter(o => o.status === 'Completed')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(43, 57, 34); // Deep Forest
    doc.text('Strategic Performance Report', 14, 25);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Institutional Generation Date: ${new Date().toLocaleString('en-PK')}`, 14, 34);
    
    doc.setFontSize(11);
    doc.setTextColor(43, 57, 34);
    doc.text(`Manifest Summary: ${filtered.length} Entries | Total Realized Revenue: Rs. ${totalRevenue.toLocaleString()}`, 14, 42);

    autoTable(doc, {
      startY: 50,
      head: [['TRACE ID', 'ENTITY', 'CONTACT', 'MANIFEST', 'VALUATION', 'STATUS', 'TIMESTAMP']],
      body: filtered.map((o) => [
        o._id.slice(-8).toUpperCase(),
        `${o.farmer?.first_name} ${o.farmer?.last_name}`,
        o.farmerPhone,
        o.items?.map(item => item.product?.name).join(', ') || '—',
        `Rs. ${o.totalAmount?.toLocaleString()}`,
        o.status.toUpperCase(),
        new Date(o.createdAt).toLocaleDateString('en-PK')
      ]),
      styles: { fontSize: 8, font: 'helvetica' },
      headStyles: { fillColor: [43, 57, 34], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [244, 233, 214] }, // bg-cream
      margin: { top: 50 }
    });

    doc.save(`KisanStore-Strategic-Report-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const exportExcel = () => {
    const data = filtered.map((o, i) => ({
      'Operational #': i + 1,
      'Trace ID': o._id.toUpperCase(),
      'Entity Name': `${o.farmer?.first_name} ${o.farmer?.last_name}`,
      'Secure Contact': o.farmerPhone,
      'Asset Manifest': o.items?.map(item => item.product?.name).join(', ') || '—',
      'Valuation (Rs.)': o.totalAmount,
      'Schedule Date': new Date(o.pickupDate).toLocaleDateString('en-PK'),
      'Transaction Date': new Date(o.createdAt).toLocaleDateString('en-PK'),
      'Fulfillment Status': o.status
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Strategic Sales Data');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf]), `KisanStore-Analytical-Export-${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <PageContainer>
      <Topbar>
        <PageTitle>
          Operational Analytics
          <small> Institutional sales and performance tracking</small>
        </PageTitle>
        <BtnGroup>
          <ExportBtn $variant="pdf" onClick={exportPDF}>📄 EXPORT STRATEGIC PDF</ExportBtn>
          <ExportBtn onClick={exportExcel}>📈 EXPORT DATA XLSX</ExportBtn>
        </BtnGroup>
      </Topbar>

      {/* Summary Cards */}
      <StatsGrid>
        {[
          {icon:'📋',label:'Total Manifests',val:filtered.length},
          {icon:'✅',label:'Fulfillment Rate',val:filtered.filter(o=>o.status==='Completed').length},
          {icon:'🕒',label:'Active Pipeline',val:filtered.filter(o=>o.status==='Pending').length},
          {icon:'💰',label:'Net Revenue',val:`Rs. ${totalRevenue.toLocaleString()}`, highlight: true},
        ].map((s,i) => (
          <StatCard key={i} $highlight={s.highlight}>
            <div className="icon">{s.icon}</div>
            <div className="val">{s.val}</div>
            <div className="label">{s.label}</div>
          </StatCard>
        ))}
      </StatsGrid>

      {/* Filters */}
      <FilterCard>
        <FormGroup>
          <label>Audit Start Date</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <label>Audit End Date</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <label>Operational Scope</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Transactions</option>
            <option value="Pending">🕒 PENDING FULFILLMENT</option>
            <option value="Completed">✅ DEPLOYED / COMPLETED</option>
            <option value="Cancelled">❌ CANCELLED / ABORTED</option>
          </select>
        </FormGroup>
        <ResetBtn onClick={() => { setDateFrom(''); setDateTo(''); setStatusFilter('All'); }}>
          RESET AUDIT PARAMETERS
        </ResetBtn>
      </FilterCard>

      {/* Orders Table */}
      {loading ? (
        <SpinnerWrap><Spinner /></SpinnerWrap>
      ) : filtered.length === 0 ? (
        <EmptyState>
          <div className="icon">📊</div>
          <h3>No audit data found</h3>
          <p>No transactions match the specified parameters in the institutional database.</p>
        </EmptyState>
      ) : (
        <TableCard>
          <TableScroll>
            <Table>
              <thead>
                <tr>
                  <th>Trace ID & Entity</th>
                  <th>Inventory Manifest</th>
                  <th>Institutional Valuation</th>
                  <th>Audit Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o._id}>
                    <td>
                      <div style={{fontWeight:800, color: 'var(--primary)', fontSize: '1.1rem'}}>{o.farmer?.first_name} {o.farmer?.last_name}</div>
                      <div style={{fontSize:'0.75rem', color:'var(--text-muted)', fontWeight: 700}}>TRACE: #{o._id.slice(-8).toUpperCase()}</div>
                    </td>
                    <td>
                      <ItemsList>
                        {o.items?.map(item => item.product?.name).join(', ')}
                      </ItemsList>
                    </td>
                    <td style={{fontWeight:800, color:'var(--text-charcoal)'}}>
                      Rs. {o.totalAmount?.toLocaleString()}
                    </td>
                    <td style={{color:'var(--text-muted)', fontSize:'0.85rem', fontWeight: 600}}>
                      {new Date(o.createdAt).toLocaleDateString('en-PK', {day:'numeric', month:'short', year:'numeric'})}
                    </td>
                    <td><StatusBadge $status={o.status}>{o.status}</StatusBadge></td>
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

export default SalesReport;
