import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../api';
import { useAuth } from '../context/AuthContext';

// ===== ANIMATIONS =====
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

// ===== STYLED COMPONENTS =====
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Modal = styled.div`
  background: white;
  border-radius: 20px;
  padding: 28px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: ${fadeIn} 0.25s ease;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
`;

const ModalTitle = styled.h3`
  font-family: 'Amiri', serif;
  font-size: 1.3rem;
  color: #1a5c2e;
  font-weight: 700;
`;

const CloseBtn = styled.button`
  background: #f5f5f5;
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  color: #616161;

  &:hover { background: #eeeeee; color: #212121; }
`;

const ProductInfo = styled.div`
  background: #e8f5ed;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const ProductName = styled.div`
  font-weight: 700;
  color: #1a5c2e;
  font-size: 0.95rem;
`;

const ProductPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: #1a5c2e;

  small {
    font-size: 0.75rem;
    color: #9e9e9e;
    font-weight: 500;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 18px;

  label {
    display: block;
    font-size: 0.87rem;
    font-weight: 700;
    color: #616161;
    margin-bottom: 7px;
  }

  input, textarea, select {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e0e0e0;
    border-radius: 10px;
    font-family: 'Nunito', sans-serif;
    font-size: 0.92rem;
    color: #212121;
    background: white;
    transition: all 0.25s ease;

    &:focus {
      outline: none;
      border-color: #2d7a47;
      box-shadow: 0 0 0 3px rgba(45,122,71,0.1);
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }
`;

const ItemRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
  margin-bottom: 10px;
`;

const ItemField = styled.div`
  flex: ${p => p.flex || 1};

  label {
    display: block;
    font-size: 0.82rem;
    font-weight: 700;
    color: #9e9e9e;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 10px 12px;
    border: 1.5px solid #e0e0e0;
    border-radius: 8px;
    font-family: 'Nunito', sans-serif;
    font-size: 0.88rem;
    transition: all 0.25s ease;

    &:focus {
      outline: none;
      border-color: #2d7a47;
      box-shadow: 0 0 0 3px rgba(45,122,71,0.1);
    }
  }
`;

const RemoveItemBtn = styled.button`
  background: #ffebee;
  color: #c62828;
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.25s ease;
  margin-bottom: 1px;

  &:hover { background: #e53935; color: white; }
`;

const AddItemBtn = styled.button`
  background: none;
  border: 1.5px dashed #2d7a47;
  color: #2d7a47;
  padding: 8px 14px;
  border-radius: 8px;
  font-family: 'Nunito', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-top: 4px;

  &:hover { background: #e8f5e9; }
`;

const OrderSummary = styled.div`
  background: #fafafa;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 18px;
  border: 1px solid #eeeeee;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  color: #616161;
  padding: 3px 0;

  &.total {
    font-weight: 800;
    font-size: 1rem;
    color: #1a5c2e;
    border-top: 1px solid #eeeeee;
    margin-top: 6px;
    padding-top: 8px;
  }
`;

const Alert = styled.div`
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${p => p.success ? '#e8f5e9' : '#ffebee'};
  color: ${p => p.success ? '#2e7d32' : '#c62828'};
  border: 1px solid ${p => p.success ? '#a5d6a7' : '#ef9a9a'};
`;

const BtnRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 6px;
`;

const CancelBtn = styled.button`
  flex: 1;
  padding: 12px;
  background: #f5f5f5;
  color: #616161;
  border: none;
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover { background: #eeeeee; }
`;

const SubmitBtn = styled.button`
  flex: 2;
  padding: 12px;
  background: #2d7a47;
  color: white;
  border: none;
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover { background: #1a5c2e; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

// ===== COMPONENT =====
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

  const addItem = () => setItems([...items, { product: product._id, quantity: 1, price: product.price }]);
  const removeItem = i => { if (items.length > 1) setItems(items.filter((_, idx) => idx !== i)); };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!pickupDate) return setError('Please select a pickup date');
    if (!farmerPhone) return setError('Please enter your phone number');

    setLoading(true);
    try {
      await api.post('/orders', { items, pickupDate, farmerPhone, notes });
      setSuccess(true);
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Overlay onClick={e => e.target === e.currentTarget && onClose()}>
      <Modal>
        <ModalHeader>
          <ModalTitle>🛒 Place Order</ModalTitle>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </ModalHeader>

        <ProductInfo>
          <ProductName>🌱 {product.name}</ProductName>
          <ProductPrice>
            Rs. {product.price.toLocaleString()}
            <small> / {product.unit}</small>
          </ProductPrice>
        </ProductInfo>

        {success ? (
          <Alert success>✅ Order placed successfully! Redirecting...</Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <Alert>⚠️ {error}</Alert>}

            {/* Items */}
            <FormGroup>
              <label>Order Items</label>
              {items.map((item, i) => (
                <ItemRow key={i}>
                  <ItemField flex={2}>
                    <label>Product</label>
                    <input value={product.name} disabled style={{ background: '#fafafa', color: '#9e9e9e' }} />
                  </ItemField>
                  <ItemField>
                    <label>Qty</label>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={item.quantity}
                      onChange={e => updateItem(i, 'quantity', e.target.value)}
                    />
                  </ItemField>
                  <ItemField>
                    <label>Price</label>
                    <input value={`Rs.${item.price.toLocaleString()}`} disabled style={{ background: '#fafafa', color: '#9e9e9e' }} />
                  </ItemField>
                  {items.length > 1 && (
                    <RemoveItemBtn type="button" onClick={() => removeItem(i)}>✕</RemoveItemBtn>
                  )}
                </ItemRow>
              ))}
              <AddItemBtn type="button" onClick={addItem}>+ Add More Items</AddItemBtn>
            </FormGroup>

            {/* Order Summary */}
            <OrderSummary>
              {items.map((item, i) => (
                <SummaryRow key={i}>
                  <span>{product.name} × {item.quantity}</span>
                  <span>Rs. {(item.quantity * item.price).toLocaleString()}</span>
                </SummaryRow>
              ))}
              <SummaryRow className="total">
                <span>Total Amount</span>
                <span>Rs. {totalAmount.toLocaleString()}</span>
              </SummaryRow>
            </OrderSummary>

            <FormGroup>
              <label>Pickup Date</label>
              <input
                type="date"
                value={pickupDate}
                min={minDate}
                onChange={e => setPickupDate(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Contact Phone</label>
              <input
                type="tel"
                value={farmerPhone}
                onChange={e => setFarmerPhone(e.target.value)}
                placeholder="0300-1234567"
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Notes <span style={{ color: '#9e9e9e', fontWeight: 400 }}>(optional)</span></label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any special instructions or requests..."
              />
            </FormGroup>

            <BtnRow>
              <CancelBtn type="button" onClick={onClose}>Cancel</CancelBtn>
              <SubmitBtn type="submit" disabled={loading}>
                {loading ? 'Placing Order...' : '✅ Confirm Order'}
              </SubmitBtn>
            </BtnRow>
          </form>
        )}
      </Modal>
    </Overlay>
  );
};

export default OrderModal;