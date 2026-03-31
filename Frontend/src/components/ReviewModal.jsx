import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../api';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(26, 42, 18, 0.7);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Modal = styled.div`
  background: #f5f0e8;
  border-radius: 20px;
  padding: 30px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h3`
  font-family: "Playfair Display", serif;
  color: #2c4a1e;
  margin-bottom: 20px;
`;

const Stars = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 2rem;
  cursor: pointer;
`;

const Star = styled.span`
  color: ${p => p.active ? '#d46a4f' : '#ccc'};
  transition: transform 0.2s;
  &:hover { transform: scale(1.2); }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  border: 1.5px solid #d1d1d1;
  font-family: "Inter", sans-serif;
  margin-bottom: 20px;
  min-height: 100px;
  &:focus { outline: none; border-color: #2c4a1e; }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: #2c4a1e;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  &:disabled { opacity: 0.6; }
`;

const ReviewModal = ({ productId, productName, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment });
      alert('Review submitted successfully!');
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Title>Rate {productName}</Title>
        <Stars>
          {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} active={rating >= s} onClick={() => setRating(s)}>★</Star>
          ))}
        </Stars>
        <TextArea 
          placeholder="Share your experience with this product..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <SubmitBtn onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </SubmitBtn>
        <button 
          style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
          onClick={onClose}
        >
          Cancel
        </button>
      </Modal>
    </Overlay>
  );
};

export default ReviewModal;
