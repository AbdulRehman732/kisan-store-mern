import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import ReviewSection from "./ReviewSection";
import PriceTrendChart from "./PriceTrendChart";
import { Button, GlassCard } from "../styles/StyledComponents";

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
  width: 100%;
  max-width: 1100px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 60px;
  position: relative;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-premium);

  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: var(--bg-app); }
  &::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 10px; }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--bg-surface-alt);
  color: var(--text-primary);
  font-size: 1.2rem;
  border: 1px solid var(--border);
  transition: var(--transition-smooth);
  &:hover { transform: rotate(90deg); background: var(--accent); color: var(--text-inverse); }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  @media (max-width: 1000px) { grid-template-columns: 1fr; }
`;

const AssetGallery = styled.div``;

const PrimaryDisplay = styled.div`
  height: 440px;
  background: var(--bg-surface-alt);
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8rem;
  overflow: hidden;
  margin-bottom: 24px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
  img { width: 100%; height: 100%; object-fit: cover; transition: var(--transition-slow); }
  &:hover img { transform: scale(1.05); }
`;

const ThumbnailStrip = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ThumbBox = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 16px;
  background: var(--bg-surface-alt);
  cursor: pointer;
  overflow: hidden;
  border: 2px solid ${p => p.$active ? 'var(--accent)' : 'var(--border)'};
  transition: var(--transition-smooth);
  &:hover { opacity: 0.8; transform: translateY(-3px); }
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const AssetDetails = styled.div`
  h2 { font-size: 3.2rem; margin-bottom: 12px; color: var(--text-primary); letter-spacing: -0.02em; }
  .badge { display: inline-block; padding: 6px 14px; background: var(--bg-surface-alt); border-radius: var(--radius-pill); font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: var(--primary); margin-bottom: 24px; border: 1px solid var(--border); }
  .description { font-size: 1.1rem; color: var(--text-secondary); line-height: 1.8; margin-bottom: 40px; font-weight: 600; }
  .price-tier { font-size: 3rem; font-weight: 900; margin-bottom: 8px; color: var(--text-primary); letter-spacing: -0.01em; span { font-size: 1.2rem; color: var(--text-secondary); font-weight: 500; } }
  .reserve-status { font-weight: 900; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: ${p => p.$inStock ? 'var(--primary)' : '#FF5252'}; margin-bottom: 40px; display: flex; align-items: center; gap: 8px; &::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: currentColor; } }
`;

const ActionProtocol = styled(Button)`
  width: 100%;
  padding: 24px;
`;

const SectionHeader = styled.h4`
  font-size: 0.85rem;
  text-transform: uppercase;
  color: var(--text-secondary);
  letter-spacing: 0.2em;
  font-weight: 900;
  margin: 60px 0 32px;
  display: flex;
  align-items: center;
  gap: 16px;
  &::after { content: ''; flex: 1; height: 1px; background: var(--border); }
`;

const ProductDetailModal = ({ product, onClose, onBuy }) => {
  const [activeImg, setActiveImg] = useState(product.image?.[0] || null);

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalPanel>
        <CloseBtn onClick={onClose}>✕</CloseBtn>
        <ContentGrid>
          <AssetGallery>
            <PrimaryDisplay>
              {activeImg ? (
                <img src={`http://localhost:5000${activeImg}`} alt={product.name} />
              ) : (
                '📦'
              )}
            </PrimaryDisplay>
            <ThumbnailStrip>
              {product.image?.map((img, i) => (
                <ThumbBox key={i} $active={activeImg === img} onClick={() => setActiveImg(img)}>
                  <img src={`http://localhost:5000${img}`} alt="thumbnail" />
                </ThumbBox>
              ))}
            </ThumbnailStrip>
          </AssetGallery>

          <AssetDetails $inStock={product.stock > 0}>
            <div className="badge">{product.category}</div>
            <h2>{product.name}</h2>
            <div className="price-tier">Rs. {product.price.toLocaleString()} <span>/ {product.unit}</span></div>
            <div className="reserve-status">{product.stock > 0 ? `Authorized Reserve: ${product.stock} units` : 'Supply Protocol: Depleted'}</div>
            <p className="description">{product.description || 'Institutional-grade agricultural asset optimized for precision operational deployment.'}</p>
            <ActionProtocol onClick={onBuy} disabled={product.stock === 0} amber block>
              {product.stock > 0 ? 'COMMIT TO PROCUREMENT LOG' : 'RESTOCKING INITIALIZED'}
            </ActionProtocol>
          </AssetDetails>
        </ContentGrid>
        
        <SectionHeader>Analytical Price Dynamics</SectionHeader>
        <div style={{ background: 'var(--bg-surface-alt)', borderRadius: '24px', padding: '32px', border: '1px solid var(--border)' }}>
          <PriceTrendChart history={product.priceHistory} />
        </div>

        <SectionHeader>Stakeholder Feedback Ledger</SectionHeader>
        <ReviewSection productId={product._id} />
      </ModalPanel>
    </Overlay>
  );
};

export default ProductDetailModal;
