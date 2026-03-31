import React, { useState } from "react";
import styled from "styled-components";
import ReviewSection from "./ReviewSection";
import PriceTrendChart from "./PriceTrendChart";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(43, 57, 34, 0.4);
  backdrop-filter: blur(12px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const Modal = styled.div`
  background: var(--white);
  border-radius: var(--radius-card);
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 60px;
  position: relative;
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-premium);
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--bg-cream);
  color: var(--primary);
  font-size: 1.2rem;
  &:hover { transform: rotate(90deg); background: var(--accent); }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Gallery = styled.div``;

const MainImg = styled.div`
  height: 400px;
  background: var(--bg-cream);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8rem;
  overflow: hidden;
  margin-bottom: 20px;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const Thumbs = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Thumb = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: var(--bg-cream);
  cursor: pointer;
  overflow: hidden;
  border: 2px solid ${p => p.active ? 'var(--primary)' : 'transparent'};
  &:hover { opacity: 0.8; }
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const Info = styled.div`
  h2 { font-size: 2.8rem; margin-bottom: 12px; color: var(--primary); }
  .badge { display: inline-block; padding: 6px 14px; background: var(--bg-cream); border-radius: var(--radius-pill); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-bottom: 20px; }
  .desc { line-height: 1.7; color: var(--text-muted); margin-bottom: 30px; font-size: 1.1rem; }
  .price { font-size: 2.2rem; font-weight: 900; margin-bottom: 10px; color: var(--primary); }
  .unit { font-weight: 400; font-size: 1rem; color: var(--text-muted); }
  .stock { font-weight: 800; font-size: 0.9rem; color: ${p => p.inStock ? 'var(--primary)' : '#d46a4f'}; margin-bottom: 30px; }
`;

const BuyBtn = styled.button`
  width: 100%;
  padding: 22px;
  background: var(--text-charcoal);
  color: var(--white);
  border-radius: var(--radius-pill);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  &:hover { background: var(--primary); transform: translateY(-3px); }
  &:disabled { opacity: 0.5; }
`;

const ProductDetailModal = ({ product, onClose, onBuy }) => {
  const [activeImg, setActiveImg] = useState(product.image?.[0] || null);

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Modal>
        <CloseBtn onClick={onClose}>✕</CloseBtn>
        <Grid>
          <Gallery>
            <MainImg>
              {activeImg ? (
                <img src={`http://localhost:5000${activeImg}`} alt={product.name} />
              ) : (
                '📦'
              )}
            </MainImg>
            <Thumbs>
              {product.image?.map((img, i) => (
                <Thumb key={i} active={activeImg === img} onClick={() => setActiveImg(img)}>
                  <img src={`http://localhost:5000${img}`} alt="thumbnail" />
                </Thumb>
              ))}
            </Thumbs>
          </Gallery>
          <Info inStock={product.stock > 0}>
            <div className="badge">{product.category}</div>
            <h2>{product.name}</h2>
            <div className="price">Rs. {product.price.toLocaleString()} <span className="unit">/ {product.unit}</span></div>
            <div className="stock">{product.stock > 0 ? `Verified Reserve: ${product.stock} units` : 'Operational Status: Out of Stock'}</div>
            <p className="desc">{product.description || 'Institutional-grade agricultural asset for high-yield farming operations.'}</p>
            <BuyBtn onClick={onBuy} disabled={product.stock === 0}>
              {product.stock > 0 ? 'Buy & Schedule Delivery 🚜' : 'Restocking Procedure Initiated'}
            </BuyBtn>
          </Info>
        </Grid>
        
        <PriceTrendChart history={product.priceHistory} />
        <ReviewSection productId={product._id} />
      </Modal>
    </Overlay>
  );
};

export default ProductDetailModal;
