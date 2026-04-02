import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../api';
import { Button, GlassCard } from '../styles/StyledComponents';

// ===== STYLED COMPONENTS =====
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(13, 15, 12, 0.85);
  backdrop-filter: blur(40px);
  z-index: 6000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  animation: entrance 0.4s ease forwards;
`;

const ModalPanel = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: 48px;
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--border);
  position: relative;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-surface-alt);
  color: var(--text-primary);
  font-size: 1rem;
  border: 1px solid var(--border);
  transition: var(--transition-smooth);
  &:hover { transform: rotate(90deg); background: var(--accent); color: var(--text-inverse); }
`;

const Title = styled.h3`
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 32px;
`;

const StarStrip = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  font-size: 2.2rem;
  cursor: pointer;
`;

const StarBox = styled.span`
  color: ${p => p.$active ? 'var(--accent)' : 'var(--border)'};
  transition: var(--transition-smooth);
  &:hover { transform: scale(1.2); color: var(--accent); }
  filter: ${p => p.$active ? 'none' : 'grayscale(1)'};
  opacity: ${p => p.$active ? 1 : 0.3};
`;

const FeedbackField = styled.textarea`
  width: 100%;
  padding: 20px;
  background: var(--bg-surface-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-primary);
  min-height: 140px;
  margin-bottom: 32px;
  transition: var(--transition-smooth);
  &:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 15px var(--accent-glow); }
  &::placeholder { color: var(--text-secondary); opacity: 0.4; }
`;

const ReviewModal = ({ productId, productName, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment });
      alert('Operational brief authenticated successfully.');
      onSuccess();
    } catch (err) {
      alert('Communication failure: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalPanel onClick={e => e.stopPropagation()}>
        <CloseBtn onClick={onClose}>✕</CloseBtn>
        <Title>Stakeholder Review</Title>
        <Subtitle>Commit operational feedback for {productName}</Subtitle>
        
        <StarStrip>
          {[1, 2, 3, 4, 5].map(s => (
            <StarBox key={s} $active={rating >= s} onClick={() => setRating(s)}>★</StarBox>
          ))}
        </StarStrip>

        <FeedbackField 
          placeholder="Document technical observations, yield performance, or asset quality ledger..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          required
        />

        <Button onClick={handleSubmit} disabled={loading || !comment} primary block>
          {loading ? 'TRANSMITTING...' : 'COMMIT FEEDBACK TO LOG'}
        </Button>
        
        <button 
          style={{ width: '100%', marginTop: '20px', background: 'none', border: 'none', color: 'var(--text-secondary)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', opacity: 0.6 }}
          onClick={onClose}
        >
          Abort Protocol
        </button>
      </ModalPanel>
    </Overlay>
  );
};

export default ReviewModal;
