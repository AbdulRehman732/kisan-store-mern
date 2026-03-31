import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 40px;
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 50px;
  h2 { font-size: 2.8rem; color: var(--primary); margin-bottom: 12px; }
  p { color: var(--text-muted); font-size: 1.2rem; max-width: 600px; margin: 0 auto; }
`;

const SymptomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const SymptomCard = styled.div`
  padding: 30px;
  background: ${p => p.selected ? 'var(--primary)' : 'var(--white)'};
  color: ${p => p.selected ? 'white' : 'var(--primary)'};
  border-radius: var(--radius-card);
  border: 1px solid ${p => p.selected ? 'var(--primary)' : 'var(--border-soft)'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${p => p.selected ? 'var(--shadow-premium)' : 'var(--shadow-subtle)'};
  
  &:hover { transform: translateY(-5px); border-color: var(--primary); }
  
  .icon { font-size: 2.5rem; margin-bottom: 15px; display: block; }
  span { font-weight: 800; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em; }
`;

const Recommendation = styled.div`
  margin-top: 60px;
  padding: 50px;
  background: var(--bg-cream);
  border-radius: 40px;
  text-align: left;
  border: 1px solid var(--accent);
  animation: fadeIn 0.5s ease;

  h3 { font-size: 1.8rem; color: var(--primary); margin-bottom: 20px; display: flex; align-items: center; gap: 15px; }
  p { color: var(--text-muted); line-height: 1.7; font-size: 1.1rem; margin-bottom: 30px; }
  
  .product-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 30px;
    border-radius: 20px;
    border: 1px solid var(--border-soft);
  }
`;

const GoToMarketBtn = styled.button`
  background: var(--primary);
  color: white;
  padding: 14px 28px;
  border-radius: var(--radius-pill);
  font-weight: 800;
  text-transform: uppercase;
  &:hover { background: var(--text-charcoal); }
`;

const SYMPTOMS = [
  { id: 'yellow', label: 'Yellowing Leaves', icon: '🍂', advice: 'Nitrogen deficiency detected. Institutional recommendation: Urea fertilization required for chlorophyll restoration.', product: 'Urea' },
  { id: 'spots', label: 'Brown/Black Spots', icon: '🍄', advice: 'Fungal infection likely. Institutional recommendation: Apply specialized Pesticide or Fungicide immediately.', product: 'Pesticide' },
  { id: 'wilting', label: 'Sudden Wilting', icon: '🥀', advice: 'Root-level moisture stress or Potassium deficiency. Potash application and irrigation adjustment recommended.', product: 'DAP' },
  { id: 'stunted', label: 'Stunted Growth', icon: '🌱', advice: 'Phosphorus deficiency or low soil organic matter. High-Phosphorus fertilizer (DAP) recommended for root establishment.', product: 'DAP' },
  { id: 'falling', label: 'Fruit/Flower Fall', icon: '🍎', advice: 'Micronutrient imbalance or severe heat stress. Balanced fertilization and hormonal regulator application advised.', product: 'Fertilizer' },
];

const CropDoctor = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <h2>🌿 AI Crop Doctor</h2>
        <p>Expert diagnostic system. Select your crop's symptoms for an institutional-grade treatment recommendation.</p>
      </Header>

      <SymptomGrid>
        {SYMPTOMS.map(s => (
          <SymptomCard 
            key={s.id} 
            selected={selected?.id === s.id}
            onClick={() => setSelected(s)}
          >
            <span className="icon">{s.icon}</span>
            <span>{s.label}</span>
          </SymptomCard>
        ))}
      </SymptomGrid>

      {selected && (
        <Recommendation>
          <h3><span>🏥</span> Diagnostic Result: {selected.label}</h3>
          <p>{selected.advice}</p>
          <div className="product-box">
            <div>
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>RECOMENDED ACTIONABLE</h4>
              <strong style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>Apply High-Yield {selected.product}</strong>
            </div>
            <GoToMarketBtn onClick={() => navigate('/products')}>Visit Marketplace 🚜</GoToMarketBtn>
          </div>
        </Recommendation>
      )}

      <div style={{ marginTop: '40px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        ⚠️ Notice: Diagnostics are based on common agricultural markers. For certified laboratory results, consult our Field Officers.
      </div>
    </Container>
  );
};

export default CropDoctor;
