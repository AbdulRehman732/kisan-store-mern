import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

// ===== ANIMATIONS =====
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(76, 175, 80, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
`;

const entrance = keyframes`
  from { opacity: 0; transform: scale(0.5) translateY(50px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

// ===== STYLED COMPONENTS =====
const CartButton = styled.div`
  position: fixed;
  bottom: 40px;
  right: 40px;
  background: var(--primary);
  color: var(--text-inverse);
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-premium);
  cursor: pointer;
  transition: var(--transition-smooth);
  z-index: 5000;
  border: 4px solid var(--accent);
  animation: ${entrance} 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid var(--accent);
    opacity: 0.5;
    animation: ${pulse} 2s infinite;
  }

  &:hover {
    transform: scale(1.1) translateY(-10px);
    background: var(--accent);
    color: var(--text-inverse);
    border-color: var(--primary);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CountBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--accent);
  color: var(--text-inverse);
  font-size: 0.75rem;
  font-weight: 900;
  min-width: 24px;
  height: 24px;
  border-radius: 50%;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--primary);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  z-index: 1;
`;

const CartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const FloatingCart = () => {
  const { itemCount } = useCart();
  const navigate = useNavigate();

  if (itemCount === 0) return null;

  return (
    <CartButton onClick={() => navigate('/cart')} title="Review Procurement Dossier">
      <CartIcon />
      <CountBadge>{itemCount}</CountBadge>
    </CartButton>
  );
};

export default FloatingCart;
