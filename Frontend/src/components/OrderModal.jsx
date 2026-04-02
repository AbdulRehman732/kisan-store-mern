import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Button, GlassCard } from '../styles/StyledComponents';

// ===== STYLED COMPONENTS =====
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(13, 15, 12, 0.85);
  backdrop-filter: blur(40px);
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  animation: entrance 0.4s ease forwards;
`;

const ModalPanel = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: 50px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-premium);
  position: relative;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--bg-surface-alt);
  color: var(--text-primary);
  font-size: 1.2rem;
  border: 1px solid var(--border);
  transition: var(--transition-smooth);
  &:hover { transform: rotate(90deg); background: var(--accent); color: var(--text-inverse); }
`;

const ProductHeader = styled.div`
  background: var(--bg-surface-alt);
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--border);
  
  .name { font-weight: 900; color: var(--primary); font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.05em; }
  .price { font-size: 1.2rem; font-weight: 900; color: var(--text-primary); span { font-size: 0.8rem; color: var(--text-secondary); font-weight: 500; } }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;

  label {
    display: block;
    font-size: 0.75rem;
    font-weight: 900;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 10px;
  }

  input, select, textarea {
    width: 100%;
    padding: 16px 20px;
    background: var(--bg-surface-alt);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    color: var(--text-primary);
    font-weight: 700;
    transition: var(--transition-smooth);
    &:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 15px var(--accent-glow); }
    &::placeholder { color: var(--text-secondary); opacity: 0.4; }
  }
  
  textarea { min-height: 100px; resize: vertical; }
`;

const ItemFlex = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 16px;
  
  .field-lg { flex: 2; }
  .field-sm { flex: 1; }
`;

const SummaryPanel = styled.div`
  background: var(--bg-surface-alt);
  border-radius: 20px;
  padding: 24px;
  margin: 32px 0;
  border: 1px solid var(--border);
  
  .row { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-secondary); padding: 4px 0; font-weight: 700; }
  .total { font-weight: 900; font-size: 1.2rem; color: var(--text-primary); border-top: 1px solid var(--border); margin-top: 12px; padding-top: 16px; }
`;

const FeedbackMsg = styled.div`
  padding: 18px 24px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 900;
  margin-bottom: 24px;
  border: 1px solid currentColor;
  background: ${p => p.$success ? 'rgba(76, 175, 80, 0.1)' : 'rgba(212, 106, 79, 0.1)'};
  color: ${p => p.$success ? '#4CAF50' : '#FF5252'};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
`;

const OrderModal = ({ product, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([{ product: product._id, quantity: 1, price: product.price }]);
  const [pickupDate, setPickupDate] = useState('');
  const [farmerPhone, setFarmerPhone] = useState(user?.phone?.[0] || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const updateItem = (i, field, val) => {
    const updated = [...items];
    updated[i][field] = field === 'quantity' ? Math.max(1, Number(val)) : val;
    setItems(updated);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!pickupDate) return setError('PROTOCOL ERROR: PICKUP DATE REQUIRED');
    if (!farmerPhone) return setError('PROTOCOL ERROR: CONTACT IDENTITY REQUIRED');

    setLoading(true);
    try {
      await api.post('/orders', { items, pickupDate, farmerPhone, notes });
      setSuccess(true);
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'CRITICAL FAILURE: ORDER COMMIT FAILED');
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Overlay onClick={e => e.target === e.currentTarget && onClose()}>
      <ModalPanel>
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '8px' }}>Asset Procurement</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Institutional Fulfillment Protocol</p>
        </div>
        <CloseBtn onClick={onClose}>✕</CloseBtn>

        <ProductHeader>
          <div className="name">📦 {product.name}</div>
          <div className="price">Rs. {product.price.toLocaleString()} <span>/ {product.unit}</span></div>
        </ProductHeader>

        {success ? (
          <FeedbackMsg $success>✅ COMMIT SUCCESS: PROTOCOL INITIALIZED. REDIRECTING...</FeedbackMsg>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <FeedbackMsg>⚠️ {error}</FeedbackMsg>}

            <FormGroup>
              <label>Asset Mobilization Details</label>
              {items.map((item, i) => (
                <ItemFlex key={i}>
                  <div className="field-lg">
                    <label>Designated Asset</label>
                    <input value={product.name} disabled style={{ opacity: 0.6 }} />
                  </div>
                  <div className="field-sm">
                    <label>Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={item.quantity}
                      onChange={e => updateItem(i, 'quantity', e.target.value)}
                    />
                  </div>
                </ItemFlex>
              ))}
            </FormGroup>

            <SummaryPanel>
              {items.map((item, i) => (
                <div className="row" key={i}>
                  <span>{product.name} × {item.quantity}</span>
                  <span>Rs. {(item.quantity * item.price).toLocaleString()}</span>
                </div>
              ))}
              <div className="row total">
                <span>Aggregate Fiscal Maginitude</span>
                <span>Rs. {totalAmount.toLocaleString()}</span>
              </div>
            </SummaryPanel>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <FormGroup>
                <label>Designated Pickup Date</label>
                <input
                  type="date"
                  value={pickupDate}
                  min={minDate}
                  onChange={e => setPickupDate(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Verification Hotline</label>
                <input
                  type="tel"
                  value={farmerPhone}
                  onChange={e => setFarmerPhone(e.target.value)}
                  placeholder="0300-0000000"
                  required
                />
              </FormGroup>
            </div>

            <FormGroup>
              <label>Operational Metadata (Notes)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Specify tactical deployment instructions..."
              />
            </FormGroup>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Button type="button" outline style={{ flex: 1 }} onClick={onClose}>ABORT</Button>
              <Button type="submit" disabled={loading} primary style={{ flex: 2 }}>
                {loading ? 'COMMITTING...' : 'AUTHORIZE PROCUREMENT'}
              </Button>
            </div>
            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⚠️ Digital authorization logs are permanent.
            </p>
          </form>
        )}
      </ModalPanel>
    </Overlay>
  );
};

export default OrderModal;