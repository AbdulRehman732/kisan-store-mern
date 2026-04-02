import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import ReviewModal from '../../components/ReviewModal';
import { generateOrderReport } from '../../utils/PDFService';

// ===== STYLED COMPONENTS =====
const PageContainer = styled.div`
  padding: var(--spacing-xl);
  animation: entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  background: var(--bg-app);
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const TopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--spacing-xxl);
  flex-wrap: wrap;
  gap: var(--spacing-lg);
`;

const PageTitle = styled.h2`
  font-size: 3.5rem;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  small { font-size: 1rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7; margin-top: 8px; }
`;

const GlobalStats = styled.div`
  display: flex;
  gap: 16px;
  background: var(--bg-surface-alt);
  padding: 12px 24px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border);
  font-weight: 900;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--primary);
`;

const FilterStrip = styled.div`
  background: var(--bg-surface);
  padding: 24px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-subtle);
  flex-wrap: wrap;
`;

const DateBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  label { font-size: 0.7rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; }
  input { padding: 12px; background: var(--bg-surface-alt); border: 1px solid var(--border); border-radius: 8px; color: var(--text-primary); font-weight: 700; }
`;

const OrderCard = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: var(--spacing-xl);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
  margin-bottom: var(--spacing-lg);
  transition: var(--transition-smooth);
  
  &:hover {
    transform: translateY(-5px);
    border-color: var(--accent);
    box-shadow: var(--shadow-premium);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const OrderIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  h3 { font-size: 1.8rem; color: var(--text-primary); letter-spacing: -0.01em; }
`;

const StatusBadge = styled.span`
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  background: ${p => p.$status === 'Completed' ? 'rgba(76, 175, 80, 0.1)' : p.$status === 'Cancelled' ? 'rgba(212, 106, 79, 0.1)' : 'rgba(245, 182, 17, 0.1)'};
  color: ${p => p.$status === 'Completed' ? '#4CAF50' : p.$status === 'Cancelled' ? '#FF5252' : '#F5B611'};
  border: 1px solid currentColor;
`;

const OrderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: 24px;
  padding: 20px;
  background: var(--bg-surface-alt);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
`;

const Metric = styled.div`
  .label { font-size: 0.65rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 4px; }
  .value { font-size: 1.1rem; font-weight: 900; color: var(--text-primary); }
`;

const ActionBtn = styled.button`
  padding: 12px 24px;
  background: ${p => p.$primary ? 'var(--primary)' : 'var(--bg-surface-alt)'};
  color: ${p => p.$primary ? 'var(--text-inverse)' : 'var(--text-primary)'};
  border: 1px solid ${p => p.$primary ? 'var(--primary)' : 'var(--border)'};
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: var(--transition-smooth);
  
  &:hover:not(:disabled) { 
    background: ${p => p.$primary ? 'var(--accent)' : 'var(--primary)'}; 
    color: var(--text-inverse); 
    transform: translateY(-2px); 
    box-shadow: var(--shadow-premium); 
  }
  &:disabled { opacity: 0.4; }
`;

const WhatsappBtn = styled(ActionBtn)`
  background: rgba(37, 211, 102, 0.1);
  color: #25D366;
  border-color: #25D366;
  &:hover:not(:disabled) { background: #25D366; color: white; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 120px 40px;
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  border: 1px dashed var(--border);
  box-shadow: var(--shadow-subtle);
  
  .icon { font-size: 5rem; margin-bottom: 24px; display: block; }
  h3 { font-size: 2.2rem; color: var(--text-primary); margin-bottom: 12px; }
  p { color: var(--text-secondary); margin-bottom: 32px; font-weight: 600; }
`;

const SupportBridge = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: 40px;
  border: 1px solid var(--border);
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 40px;
  margin-bottom: var(--spacing-xxl);
  box-shadow: var(--shadow-premium);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 4px; height: 100%;
    background: var(--primary);
  }

  .content {
    h3 { font-size: 2rem; color: var(--text-primary); margin-bottom: 12px; }
    p { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px; font-weight: 600; }
  }

  .qr-wrap {
    background: var(--white);
    padding: 16px;
    border-radius: 24px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.12);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--primary-light, #e8f5e9);
    transition: var(--transition-smooth);
    position: relative;
    &:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 15px 50px rgba(0,0,0,0.15); }
    img { width: 100%; height: auto; display: block; border-radius: 12px; }
    span { font-size: 0.7rem; font-weight: 900; color: var(--text-primary); margin-top: 12px; text-transform: uppercase; letter-spacing: 0.15em; }
    
    .badge {
      position: absolute;
      top: -10px;
      right: -10px;
      background: var(--primary);
      color: white;
      font-size: 0.6rem;
      padding: 4px 8px;
      border-radius: 8px;
      font-weight: 900;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 30px;
    .qr-wrap { width: 180px; margin: 0 auto; }
  }
`;

// ===== COMPONENT =====
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cancelling, setCancelling] = useState(null);
  const [reviewModal, setReviewModal] = useState({ show: false, productId: '', productName: '' });
  const { user } = useAuth();

  const fetchOrders = () => {
    api.get('/orders/my')
      .then(res => setOrders(res.data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async orderId => {
    if (!window.confirm('Confirm protocol abandonment?')) return;
    setCancelling(orderId);
    try {
      await api.put(`/orders/${orderId}/cancel`);
      fetchOrders();
    } catch (err) { alert('Authorization failure.'); } 
    finally { setCancelling(null); }
  };

  const filtered = orders.filter(o => {
    const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
    return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
  });

  const openReview = (productId, productName) => setReviewModal({ show: true, productId, productName });

  if (!user) return (
    <PageContainer>
      <ContentWrapper>
        <EmptyState>
          <span className="icon">🔐</span>
          <h3>Authorization Protocol Required</h3>
          <p>Active session identified as null. Please authenticate to access registry.</p>
          <ShopBtn to="/login" as={Link}>Authorize Strategic Access</ShopBtn>
        </EmptyState>
      </ContentWrapper>
    </PageContainer>
  );

  return (
    <PageContainer>
      <ContentWrapper>
        <TopHeader>
          <PageTitle>Procurement History <small>Institutional Fertilizer & Seed Allocations</small></PageTitle>
          <GlobalStats>{orders.length} TOTAL LOGS</GlobalStats>
        </TopHeader>

        <FilterStrip>
          <DateBox><label>FROM</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></DateBox>
          <DateBox><label>TO</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></DateBox>
          {(startDate || endDate) && <button onClick={() => {setStartDate(''); setEndDate('');}} style={{background:'none', border:'none', color:'var(--text-secondary)', fontWeight:900, cursor:'pointer', fontSize:'0.75rem'}}>RESET</button>}
          <ActionBtn 
            $primary
            style={{marginLeft:'auto'}}
            onClick={() => generateOrderReport({ orders: filtered, title: 'Procurement Statement', userName: `${user?.first_name} ${user?.last_name}`, dateRange: startDate || endDate ? `${startDate || 'Base'} to ${endDate || 'Final'}` : 'Global History' })}
            disabled={filtered.length === 0}
          >
            📥 Download Strategic Statement
          </ActionBtn>
        </FilterStrip>

        <SupportBridge>
          <div className="content">
            <h3>Institutional Support Bridge</h3>
            <p>
              Strategic assistance is available for your procurement activities. <br/>
              Scan the QR code or click the direct deep-link to initiate a verified correspondence with our Administrative Support Unit.
            </p>
            <ActionBtn 
              $primary 
              as="a" 
              href={`https://wa.me/923000000000?text=${encodeURIComponent(`Institutional Support Request from ${user?.first_name} ${user?.last_name}.\nIdentity: ${user?.email}`)}`}
              target="_blank"
              style={{textDecoration:'none', display:'inline-block'}}
            >
              🟢 Initiate Direct Correspondence
            </ActionBtn>
          </div>
          <div className="qr-wrap">
            <div className="badge">VERIFIED</div>
            <img 
               src={`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(`https://wa.me/923000000000?text=${encodeURIComponent(`Institutional Support Request from ${user?.first_name} ${user?.last_name}.\nIdentity: ${user?.email}`)}`)}`} 
               alt="Support QR" 
            />
            <span>Scan to Chat</span>
          </div>
        </SupportBridge>

        {loading ? (
          <div style={{display:'flex',justifyContent:'center',padding:'120px'}}><div style={{width:'60px',height:'60px',border:'5px solid var(--border)',borderTopColor:'var(--primary)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} /></div>
        ) : filtered.length === 0 ? (
          <EmptyState>
            <span className="icon">📦</span>
            <h3>No Records Discovered</h3>
            <p>Your institutional procurement history is currently neutral.</p>
            <ActionBtn $primary as={Link} to="/products" style={{textDecoration:'none', display:'inline-block'}}>Browse Asset Catalog</ActionBtn>
          </EmptyState>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
            {filtered.map(order => (
              <OrderCard key={order._id}>
                <OrderHeader>
                  <OrderIdentity>
                    <OrderId>#{order._id.slice(-8).toUpperCase()}</OrderId>
                    <h3>{order.items?.map(i => i.product?.name).join(', ') || 'Manifest Allocation'}</h3>
                  </OrderIdentity>
                  <StatusBadge $status={order.status}>{order.status}</StatusBadge>
                </OrderHeader>

                <OrderGrid>
                  <Metric><div className="label">Asset Volume</div><div className="value">{order.items?.length || 0} Entities</div></Metric>
                  <Metric><div className="label">Deployment Value</div><div className="value">Rs. {order.totalAmount?.toLocaleString()}</div></Metric>
                  <Metric><div className="label">Scheduled Logistics</div><div className="value">{new Date(order.pickupDate).toLocaleDateString()}</div></Metric>
                  <Metric><div className="label">Registry Timestamp</div><div className="value">{new Date(order.createdAt).toLocaleDateString()}</div></Metric>
                </OrderGrid>

                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:'20px', flexWrap:'wrap'}}>
                  <div style={{flex:1}}>
                    {order.notes && <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', padding:'12px', background:'var(--bg-surface-alt)', borderRadius:'8px', borderLeft:'4px solid var(--primary)'}}><strong>Operational Remark:</strong> {order.notes}</div>}
                  </div>
                  <div style={{display:'flex', gap:'12px'}}>
                    {order.status === 'Pending' && <ActionBtn onClick={() => handleCancel(order._id)} disabled={cancelling === order._id}>{cancelling === order._id ? 'AUTHORIZING...' : 'ABANDON'}</ActionBtn>}
                    {order.status === 'Completed' && order.items?.[0]?.product && <ActionBtn onClick={() => openReview(order.items[0].product._id, order.items[0].product.name)}>Submit Feedback</ActionBtn>}
                    <ActionBtn $primary as={Link} to={`/invoice/${order._id}`} style={{textDecoration:'none'}}>Official Invoice</ActionBtn>
                  </div>
                </div>
              </OrderCard>
            ))}
          </div>
        )}
      </ContentWrapper>

      {reviewModal.show && (
        <ReviewModal 
          productId={reviewModal.productId} 
          productName={reviewModal.productName} 
          onClose={() => setReviewModal({ ...reviewModal, show: false })}
          onSuccess={() => setReviewModal({ ...reviewModal, show: false })}
        />
      )}
    </PageContainer>
  );
};

export default MyOrders;