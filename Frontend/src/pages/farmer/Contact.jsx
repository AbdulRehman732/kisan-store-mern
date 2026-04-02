import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Button, GlassCard, SectionTitle } from '../../styles/StyledComponents';

// ===== STYLED COMPONENTS =====
const PageContainer = styled.div`
  padding: var(--spacing-xl);
  animation: entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  background: var(--bg-app);
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const TopHeader = styled.div`
  margin-bottom: var(--spacing-xxl);
  max-width: 800px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--spacing-xxl);
  @media (max-width: 1100px) { grid-template-columns: 1fr; }
`;

const OperationalCore = styled(GlassCard)`
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--primary);
  color: var(--text-inverse);
  border: none;

  h3 { font-size: 2.5rem; color: var(--accent); margin-bottom: 48px; letter-spacing: -0.02em; }
`;

const InfoItem = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 40px;

  .icon-box {
    width: 64px; height: 64px;
    background: rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.1);
    font-size: 1.8rem;
    box-shadow: var(--shadow-subtle);
  }

  .text {
    h4 { font-size: 0.8rem; font-weight: 900; color: var(--text-inverse); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px; opacity: 0.6; }
    p { font-size: 1.1rem; font-weight: 700; color: var(--text-inverse); line-height: 1.6; }
  }
`;

const ContactForm = styled.form`
  background: var(--bg-surface);
  padding: 80px;
  border-radius: var(--radius-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-premium);
  display: flex;
  flex-direction: column;
  gap: 32px;
  @media (max-width: 600px) { padding: 40px; }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  label { font-size: 0.75rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.12em; }
  input, textarea {
    padding: 18px 24px;
    background: var(--bg-surface-alt);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    color: var(--text-primary);
    transition: var(--transition-smooth);

    &:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 15px var(--accent-glow); }
    &::placeholder { color: var(--text-secondary); opacity: 0.4; }
  }

  textarea { min-height: 200px; resize: vertical; }
`;

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Communication Authorization Established. Sector Logistics will contact you momentarily.');
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <TopHeader>
          <SectionTitle>Operational Support <small>INSTITUTIONAL CRISIS & LOGISTICS DISPATCH</small></SectionTitle>
          <p style={{ marginTop: '24px', fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 600, lineHeight: 1.6 }}>
            For complex asset procurement or localized strategic analysis, establish a direct link with our institutional support division.
          </p>
        </TopHeader>

        <Grid>
          <OperationalCore>
            <h3>Global Core HQ</h3>
            <InfoItem>
              <div className="icon-box">📍</div>
              <div className="text">
                <h4>Consortium Headquarters</h4>
                <p>Agrotek Elite Plaza, Sector 7-C<br />Institutional District, Central Hub</p>
              </div>
            </InfoItem>
            <InfoItem>
              <div className="icon-box">📞</div>
              <div className="text">
                <h4>Operational Hotline</h4>
                <p>+92 (300) AGROTEK ELITE<br />Active Monitoring Stream</p>
              </div>
            </InfoItem>
            <InfoItem>
              <div className="icon-box">✉️</div>
              <div className="text">
                <h4>Secure Protocol</h4>
                <p>ops@agrotek-elite.com<br />intelligence@agrotek-elite.com</p>
              </div>
            </InfoItem>
          </OperationalCore>

          <ContactForm onSubmit={handleSubmit}>
            <InputGroup>
              <label>Personnel / Entity Identity</label>
              <input type="text" placeholder="Authorized Stakeholder Name" required />
            </InputGroup>
            <InputGroup>
              <label>Tactical Correspondence (Email)</label>
              <input type="email" placeholder="stakeholder@agrotek-elite.com" required />
            </InputGroup>
            <InputGroup>
              <label>Logistics Requirements / Query</label>
              <textarea placeholder="Specify strategic asset needs or technical field challenges..." required />
            </InputGroup>
            <Button type="submit" block amber>AUTHORIZE COMMUNICATION PROTOCOL</Button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⚠️ Digital integrity report generated upon submission.
            </p>
          </ContactForm>
        </Grid>
      </ContentWrapper>
    </PageContainer>
  );
};

export default Contact;
