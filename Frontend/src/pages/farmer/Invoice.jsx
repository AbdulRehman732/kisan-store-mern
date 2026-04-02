import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import api from "../../api";

// ===== STYLED COMPONENTS =====
const PageBackground = styled.div`
  min-height: 100vh;
  background: var(--bg-app);
  padding: 80px 24px;
  animation: entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  @media print { padding: 0; background: white; }
`;

const InvoicePaper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: white;
  color: #1a1a1a;
  padding: 80px;
  box-shadow: 0 40px 100px rgba(0,0,0,0.1);
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  &::before {
    content: 'AUTHORIZED DOCUMENT';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 8rem;
    font-weight: 900;
    opacity: 0.03;
    pointer-events: none;
    white-space: nowrap;
  }

  @media print {
    padding: 40px;
    box-shadow: none;
    max-width: 100%;
    margin: 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 80px;
  border-bottom: 4px solid #f5f5f5;
  padding-bottom: 40px;
`;

const BrandBlock = styled.div`
  .logo { font-family: 'Fraunces', serif; font-size: 2.2rem; font-weight: 900; color: #2B3922; margin-bottom: 12px; }
  .tagline { font-size: 0.75rem; font-weight: 800; color: #666; text-transform: uppercase; letter-spacing: 0.15em; }
`;

const DocMeta = styled.div`
  text-align: right;
  h1 { font-size: 3rem; margin: 0; color: #2B3922; letter-spacing: -0.02em; }
  p { font-size: 1rem; color: #888; font-weight: 700; margin-top: 4px; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 60px;
  margin-bottom: 80px;
`;

const InfoBox = styled.div`
  h4 { font-size: 0.7rem; font-weight: 900; color: #aaa; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 16px; }
  p { font-size: 1rem; font-weight: 700; color: #333; margin-bottom: 4px; line-height: 1.5; }
  .highlight { color: #2B3922; }
`;

const LineTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 60px;
  
  th { text-align: left; padding: 20px; background: #2B3922; color: white; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; }
  td { padding: 24px 20px; border-bottom: 1px solid #eee; font-size: 1rem; color: #444; }
  tr:last-child td { border-bottom: 2px solid #2B3922; }
`;

const FiscalSummary = styled.div`
  margin-left: auto;
  width: 350px;
  
  .row { display: flex; justify-content: space-between; padding: 12px 0; font-weight: 700; font-size: 1rem; color: #666; }
  .total { font-size: 1.6rem; color: #2B3922; font-weight: 900; border-top: 2px solid #eee; margin-top: 12px; padding-top: 24px; }
  .due { font-size: 1.8rem; color: #D46A4F; font-weight: 900; background: #fff5f2; margin-top: 20px; padding: 24px; border-radius: 8px; border-left: 6px solid #D46A4F; }
`;

const PrintFAB = styled.button`
  position: fixed;
  bottom: 40px; right: 40px;
  background: var(--primary);
  color: white;
  border: none;
  padding: 20px 40px;
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  cursor: pointer;
  transition: var(--transition-smooth);
  z-index: 5000;
  
  &:hover { background: var(--accent); transform: scale(1.05); }
  @media print { display: none; }
`;

// ===== COMPONENT =====
const Invoice = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data.order))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageBackground><div style={{textAlign:'center', padding:'100px', color:'var(--text-secondary)', fontWeight:900}}>SYNCHRONIZING DOCUMENT...</div></PageBackground>;
  if (!order) return <PageBackground><div style={{textAlign:'center', padding:'100px', color:'var(--text-secondary)', fontWeight:900}}>ERROR: DOCUMENT NOT DISCOVERED</div></PageBackground>;

  const balance = (order.grandTotal || order.totalAmount) - (order.amountPaid || 0);

  return (
    <PageBackground>
      <InvoicePaper>
        <Header>
          <BrandBlock>
            <div className="logo">🌾 Agrotek<span>Elite</span></div>
            <div className="tagline">Institutional Fertilizer & Seed Consortium</div>
          </BrandBlock>
          <DocMeta>
            <h1>INVOICE</h1>
            <p>CERTIFICATE ID: AG-INV-{order._id.substring(18).toUpperCase()}</p>
          </DocMeta>
        </Header>

        <Grid>
          <InfoBox>
            <h4>AUTHORIZED STAKEHOLDER</h4>
            <p className="highlight">{order.farmer?.first_name} {order.farmer?.last_name}</p>
            <p>{order.farmerPhone}</p>
            <p>{order.farmer?.address || "Primary Registered Field Address"}</p>
            <p>{order.farmer?.city || 'Central Region'}</p>
          </InfoBox>
          <InfoBox style={{ textAlign: 'right' }}>
            <h4>TEMPORAL METRICS</h4>
            <p>Authorization Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Designated Mobilization: {new Date(order.pickupDate).toLocaleDateString()}</p>
            <p>Protocol Status: <span style={{color: order.status === 'completed' ? '#4CAF50' : '#F5B611'}}>{order.status.toUpperCase()}</span></p>
          </InfoBox>
        </Grid>

        <LineTable>
          <thead>
            <tr>
              <th>Asset Specification</th>
              <th style={{textAlign:'center'}}>Quantity</th>
              <th style={{textAlign:'right'}}>Rate (PKR)</th>
              <th style={{textAlign:'right'}}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td>
                  <div style={{fontWeight:900, color:'#111'}}>{item.product?.name}</div>
                  <div style={{fontSize:'0.75rem', color:'#888', marginTop:'4px'}}>{item.product?.category.toUpperCase()} // STRATEGIC CLASS</div>
                </td>
                <td style={{textAlign:'center', fontWeight:800}}>{item.quantity} {item.product?.unit}</td>
                <td style={{textAlign:'right'}}>Rs. {item.price.toLocaleString()}</td>
                <td style={{textAlign:'right', fontWeight:900}}>Rs. {(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </LineTable>

        <FiscalSummary>
          <div className="row"><span>Gross Asset Valuation</span><span>Rs. {order.totalAmount.toLocaleString()}</span></div>
          <div className="row"><span>Institutional Levy (Tax)</span><span>Rs. {(order.taxTotal || 0).toLocaleString()}</span></div>
          <div className="row total"><span>Aggregate Magnitude</span><span>Rs. {(order.grandTotal || order.totalAmount).toLocaleString()}</span></div>
          
          {order.amountPaid > 0 && <div className="row" style={{color:'#4CAF50'}}><span>Fiscal Commitment (Paid)</span><span>Rs. {order.amountPaid.toLocaleString()}</span></div>}
          
          {balance > 0 ? (
            <div className="due">
              <div style={{fontSize:'0.7rem', marginBottom:'8px', opacity:0.8}}>OS_BALANCE_REMAINING</div>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <span>BALANCE DUE</span>
                <span>Rs. {balance.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div style={{textAlign:'center', marginTop:'32px', background:'#f0fdf4', color:'#166534', padding:'16px', borderRadius:'8px', fontWeight:900, border:'1px solid #4CAF50'}}>
              ✅ FISCAL CLEARANCE VERIFIED
            </div>
          )}
        </FiscalSummary>

        <div style={{ marginTop: '100px', borderTop: '1px solid #f5f5f5', paddingTop: '40px', textAlign: 'center', fontSize: '0.8rem', color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <p>Electronic Verification Protocol Enabled. Physical Signature Redundant.</p>
          <p style={{ marginTop: '12px', color: '#888' }}>© 2026 Agrotek Elite Intelligence Consortium. All Rights Authorized.</p>
        </div>
      </InvoicePaper>
      <PrintFAB onClick={() => window.print()}>🖨️ Generate Physical Certificate</PrintFAB>
    </PageBackground>
  );
};

export default Invoice;
