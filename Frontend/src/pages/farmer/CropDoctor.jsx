import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ===== STYLED COMPONENTS =====
const PageContainer = styled.div`
  padding: var(--spacing-xl);
  animation: entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  background: var(--bg-app);
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
`;

const TopHeader = styled.div`
  margin-bottom: var(--spacing-xxl);
`;

const PageTitle = styled.h2`
  font-size: 3.5rem;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  small { font-size: 1rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7; margin-top: 8px; }
`;

const SymptomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xxl);
`;

const SymptomCard = styled.div`
  padding: 40px 20px;
  background: ${p => p.$selected ? 'var(--primary)' : 'var(--bg-surface)'};
  color: ${p => p.$selected ? 'var(--text-inverse)' : 'var(--text-primary)'};
  border-radius: var(--radius-card);
  border: 1px solid ${p => p.$selected ? 'var(--primary)' : 'var(--border)'};
  cursor: pointer;
  transition: var(--transition-smooth);
  box-shadow: ${p => p.$selected ? 'var(--shadow-premium)' : 'var(--shadow-subtle)'};
  
  &:hover { transform: translateY(-5px); border-color: var(--accent); }
  
  .icon { font-size: 3rem; margin-bottom: 20px; display: block; opacity: 0.9; }
  span { font-weight: 900; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; }
`;

const DiagnosticReport = styled.div`
  margin-top: 60px;
  padding: 60px;
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  text-align: left;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-premium);
  position: relative;
  overflow: hidden;

  &::before { content: ''; position: absolute; top: 0; left: 0; width: 6px; height: 100%; background: var(--primary); }

  h3 { font-size: 2rem; color: var(--text-primary); margin-bottom: 24px; display: flex; align-items: center; gap: 16px; }
  p { color: var(--text-secondary); line-height: 1.8; font-size: 1.1rem; margin-bottom: 40px; font-weight: 600; }
`;

const PrescriptionBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-surface-alt);
  padding: 32px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  
  @media (max-width: 600px) { flex-direction: column; gap: 24px; text-align: center; }

  h4 { font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px; font-weight: 900; letter-spacing: 0.1em; }
  strong { font-size: 1.4rem; color: var(--primary); font-weight: 900; }
`;

const ActionBtn = styled.button`
  padding: 14px 28px;
  background: var(--primary);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  cursor: pointer;
  transition: var(--transition-smooth);
  
  &:hover { background: var(--accent); color: var(--text-inverse); transform: translateY(-3px); box-shadow: var(--shadow-premium); }
`;

const SYMPTOMS = [
  { id: 'yellow', label: 'Yellowing Leaves', icon: '🍂', advice: 'Nitrogen deficiency detected. High-fidelity chlorophyll analysis suggests institutional-grade Urea fertilization for restoration.', product: 'Premium Urea' },
  { id: 'spots', label: 'Necrotic Blotching', icon: '🍄', advice: 'Fungal colonization identified. Tactical application of specialized Fungicide or tactical Pesticide protocol required.', product: 'Tactical Pesticide' },
  { id: 'wilting', label: 'Sudden Flaccidity', icon: '🥀', advice: 'Root-level hydraulic stress or Potassium index failure. Institutional Potash application and irrigation recalibration advised.', product: 'High-K Potash' },
  { id: 'stunted', label: 'Inhibited Vigor', icon: '🌱', advice: 'Phosphorus deficiency or soil organic matrix degradation. High-precision DAP mobilization recommended for root anchoring.', product: 'Agrotek DAP' },
  { id: 'falling', label: 'Premature Abscission', icon: '🍎', advice: 'Micronutrient imbalance identified. Balanced precision fertilization and hormonal regulator deployment synchronized with heat-stress protocols.', product: 'Multi-Micro Nutrient' },
];

// ===== COMPONENT =====
const CropDoctor = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  return (
    <PageContainer>
      <ContentWrapper>
        <TopHeader>
          <PageTitle>Crop Doctor <small>PRECISION CLINICAL DIAGNOSIS & AI SURVEILLANCE</small></PageTitle>
          <p style={{color: 'var(--text-secondary)', fontWeight: 700, fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto'}}>Expert diagnostic matrix. Identify your crop's symptomatic profile for an institutional-grade treatment recommendation.</p>
        </TopHeader>

        <SymptomGrid>
          {SYMPTOMS.map(s => (
            <SymptomCard 
              key={s.id} 
              $selected={selected?.id === s.id}
              onClick={() => setSelected(s)}
            >
              <span className="icon">{s.icon}</span>
              <span>{s.label}</span>
            </SymptomCard>
          ))}
        </SymptomGrid>

        {selected && (
          <DiagnosticReport>
            <h3><span>🛡️</span> Diagnostic Intelligence: {selected.label}</h3>
            <p>{selected.advice}</p>
            <PrescriptionBox>
              <div>
                <h4>Tactical Prescription</h4>
                <strong>Deploy {selected.product} Protocol</strong>
              </div>
              <ActionBtn onClick={() => navigate('/products')}>Authorize Procurement 🚜</ActionBtn>
            </PrescriptionBox>
          </DiagnosticReport>
        )}

        <div style={{ marginTop: '60px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>
          ⚠️ Institutional Clause: Diagnostics are based on common agricultural markers. For certified laboratory validation, consult Field Logistics.
        </div>
      </ContentWrapper>
    </PageContainer>
  );
};

export default CropDoctor;
