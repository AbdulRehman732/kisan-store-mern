import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import ReviewModal from '../../components/ReviewModal';

// ===== ANIMATIONS =====
const spin = keyframes`to { transform: rotate(360deg); }`;

// ===== STYLED COMPONENTS =====
// ===== STYLED COMPONENTS =====
const PageWrap = styled.div`
  min-height: calc(100vh - 120px);
  background: var(--bg-cream);
  padding: 80px 24px;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 3.5rem;
  color: var(--primary);
  margin-bottom: 48px;
  text-align: left;
  small {
    display: block;
    font-family: inherit;
    font-size: 1.1rem;
    color: var(--text-muted);
    font-weight: 500;
    margin-top: 8px;
  }
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const OrderCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-card);
  padding: 48px;
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--border-soft);
  transition: var(--transition);
  &:hover { transform: translateY(-5px); }
  @media (max-width: 600px) { padding: 32px; }
`;

const OrderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
  @media (max-width: 768px) { flex-direction: column; }
`;

const OrderLeft = styled.div`
  flex: 1;
`;

const OrderTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const OrderName = styled.h3`
  font-size: 1.8rem;
  color: var(--primary);
  letter-spacing: -0.02em;
  margin: 0;
`;

const StatusBadge = styled.span`
  padding: 6px 16px;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: ${p => p.status === 'Completed' ? 'var(--primary)' : p.status === 'Cancelled' ? '#fdf2f0' : 'var(--accent)'};
  color: ${p => p.status === 'Completed' ? 'var(--white)' : p.status === 'Cancelled' ? '#d46a4f' : 'var(--primary)'};
`;

const OrderDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  font-size: 1rem;
  color: var(--text-muted);
  font-weight: 600;
  span { display: flex; align-items: center; gap: 8px; }
`;

const OrderNote = styled.div`
  margin-top: 24px;
  padding: 20px;
  background: var(--bg-cream);
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  color: var(--text-muted);
  border-left: 4px solid var(--primary);
`;

const OrderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  @media (max-width: 768px) { align-items: flex-start; width: 100%; }
`;

const StatusIcon = styled.div`
  font-size: 3rem;
  height: 80px;
  width: 80px;
  background: var(--bg-cream);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  border: 1px solid var(--border-soft);
`;

const ActionBtn = styled.button`
  padding: 14px 28px;
  border-radius: var(--radius-pill);
  font-weight: 800;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: var(--transition);
  border: none;
  background: ${p => p.primary ? 'var(--text-charcoal)' : 'var(--bg-cream)'};
  color: ${p => p.primary ? 'var(--white)' : 'var(--primary)'};
  &:hover { transform: translateY(-2px); box-shadow: var(--shadow-premium); }
  &:disabled { opacity: 0.5; }
`;

const CancelBtn = styled(ActionBtn)`
  background: #fdf2f0;
  color: #d46a4f;
  &:hover { background: #d46a4f; color: white; }
`;

const RateBtn = styled(ActionBtn)`
  background: var(--accent);
  color: var(--primary);
  width: 100%;
  &:hover { background: var(--primary); color: var(--white); }
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

const EmptyState = styled.div`
  background: var(--white);
  border-radius: var(--radius-card);
  padding: 100px 48px;
  text-align: center;
  box-shadow: var(--shadow-premium);
  span { font-size: 4rem; display: block; margin-bottom: 24px; }
  h3 { font-size: 1.8rem; color: var(--primary); margin-bottom: 12px; }
  p { color: var(--text-muted); font-size: 1.1rem; margin-bottom: 32px; }
`;

const ShopBtn = styled(Link)`
  display: inline-flex;
  padding: 20px 40px;
  background: var(--primary);
  color: var(--white);
  border-radius: var(--radius-pill);
  font-weight: 800;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: var(--transition);
  &:hover { transform: translateY(-3px); box-shadow: var(--shadow-premium); }
`;

// ===== COMPONENT =====
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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
    if (!window.confirm('Authorize order cancellation?')) return;
    setCancelling(orderId);
    try {
      await api.put(`/orders/${orderId}/cancel`);
      fetchOrders();
    } catch (err) { alert('Authorization failed.'); } finally { setCancelling(null); }
  };

  const openReview = (productId, productName) => {
    setReviewModal({ show: true, productId, productName });
  };

  if (!user) return (
    <PageWrap>
      <Container>
        <EmptyState>
          <span>🔐</span>
          <h3>Authorization Required</h3>
          <p>Please authenticate to access your procurement history.</p>
          <ShopBtn to="/login">Sign In</ShopBtn>
        </EmptyState>
      </Container>
    </PageWrap>
  );

  return (
    <PageWrap>
      <Container>
        <PageTitle>
          Procurement History
          <small>Tracking institutional fertilizer and seed allocations</small>
        </PageTitle>

        {loading ? (
          <SpinnerWrap><Spinner /></SpinnerWrap>
        ) : orders.length === 0 ? (
          <EmptyState>
            <span>📦</span>
            <h3>No records found</h3>
            <p>Your agricultural procurement history is currently empty.</p>
            <ShopBtn to="/products">Browse Catalog</ShopBtn>
          </EmptyState>
        ) : (
          <OrdersList>
            {orders.map(order => (
              <OrderCard key={order._id}>
                <OrderTop>
                  <OrderLeft>
                    <OrderTitleRow>
                      <OrderName>
                        {order.items?.map(i => i.product?.name).join(', ') || 'Order Reference'}
                      </OrderName>
                      <StatusBadge status={order.status}>{order.status}</StatusBadge>
                    </OrderTitleRow>
                    <OrderDetails>
                      <span>📦 {order.items?.length} Line Items</span>
                      <span>💰 Val: Rs. {order.totalAmount?.toLocaleString()}</span>
                      <span>🚜 Schedule: {new Date(order.pickupDate).toLocaleDateString()}</span>
                      <span>🗓️ Logged: {new Date(order.createdAt).toLocaleDateString()}</span>
                    </OrderDetails>
                    {order.notes && <OrderNote>Operational Remark: {order.notes}</OrderNote>}
                  </OrderLeft>
                  <OrderRight>
                    <StatusIcon>
                      {order.status === 'Pending' && '⏳'}
                      {order.status === 'Completed' && '🌿'}
                      {order.status === 'Cancelled' && '❌'}
                    </StatusIcon>
                    {order.status === 'Pending' && (
                      <CancelBtn onClick={() => handleCancel(order._id)} disabled={cancelling === order._id}>
                        {cancelling === order._id ? 'PROCESSING...' : 'CANCEL ORDER'}
                      </CancelBtn>
                    )}
                    {order.status === 'Completed' && order.items?.[0]?.product && (
                       <RateBtn onClick={() => openReview(order.items[0].product._id, order.items[0].product.name)}>
                         SUBMIT FEEDBACK
                       </RateBtn>
                    )}
                    <Link 
                      to={`/invoice/${order._id}`} 
                      style={{ 
                        textDecoration:'none', 
                        width:'100%', 
                        display:'block',
                        marginTop: order.status === 'Pending' ? '0' : '8px'
                      }}
                    >
                      <ActionBtn style={{ width:'100%' }}>OFFICIAL INVOICE</ActionBtn>
                    </Link>
                  </OrderRight>
                </OrderTop>
              </OrderCard>
            ))}
          </OrdersList>
        )}
      </Container>
      {reviewModal.show && (
        <ReviewModal 
          productId={reviewModal.productId} 
          productName={reviewModal.productName} 
          onClose={() => setReviewModal({ ...reviewModal, show: false })}
          onSuccess={() => setReviewModal({ ...reviewModal, show: false })}
        />
      )}
    </PageWrap>
  );
};

export default MyOrders;
