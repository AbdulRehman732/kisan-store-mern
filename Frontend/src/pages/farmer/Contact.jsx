import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;

// ===== STYLED COMPONENTS =====
const PageWrap = styled.div`
  min-height: calc(100vh - 120px);
  background: var(--bg-cream);
  padding: 120px 24px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeIn} 1s ease-out;
`;

const SectionTitle = styled.h1`
  font-size: 4rem;
  color: var(--primary);
  text-align: left;
  margin-bottom: 24px;
  @media (max-width: 768px) { font-size: 2.8rem; }
`;

const Subtitle = styled.p`
  text-align: left;
  color: var(--text-muted);
  max-width: 700px;
  margin-bottom: 80px;
  font-size: 1.2rem;
  line-height: 1.7;
  font-weight: 500;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 60px;
  @media (max-width: 1000px) { grid-template-columns: 1fr; }
`;

const InfoCard = styled.div`
  background: var(--primary);
  color: var(--white);
  padding: 64px;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-premium);
  display: flex;
  flex-direction: column;
  justify-content: center;

  h3 {
    font-size: 2.2rem;
    color: var(--accent);
    margin-bottom: 48px;
    letter-spacing: -0.02em;
  }
`;

const InfoItem = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 40px;

  .icon {
    font-size: 1.8rem;
    height: 60px;
    width: 60px;
    background: rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  h4 {
    font-weight: 800;
    color: var(--white);
    margin-bottom: 8px;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  p {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    line-height: 1.6;
    font-weight: 500;
  }
`;

const ContactForm = styled.form`
  background: var(--white);
  padding: 80px;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-premium);
  display: flex;
  flex-direction: column;
  gap: 32px;
  border: 1px solid var(--border-soft);
  @media (max-width: 600px) { padding: 40px; }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  label {
    font-size: 0.75rem;
    font-weight: 800;
    color: var(--primary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  input, textarea {
    padding: 20px 24px;
    border: 1px solid var(--bg-cream);
    background: var(--bg-cream);
    border-radius: var(--radius-sm);
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-charcoal);
    transition: var(--transition);

    &:focus {
      outline: none;
      border-color: var(--primary);
      background: var(--white);
    }
    &::placeholder { color: var(--text-muted); opacity: 0.5; }
  }

  textarea {
    min-height: 180px;
    resize: vertical;
  }
`;

const SubmitBtn = styled.button`
  background: var(--text-charcoal);
  color: var(--white);
  padding: 24px;
  border: none;
  border-radius: var(--radius-pill);
  font-weight: 800;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 16px;

  &:hover {
    background: var(--primary);
    transform: translateY(-3px);
    box-shadow: var(--shadow-premium);
  }
`;

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Strategic Brief Received. Our agricultural operations team will contact you shortly.');
  };

  return (
    <PageWrap>
      <Container>
        <SectionTitle>Global Operations Support</SectionTitle>
        <Subtitle>
          For complex procurement inquiries or localized expert analysis, connect with our institutional support division. 
          Bridging the gap between heritage farming and modern logistics.
        </Subtitle>

        <Grid>
          <InfoCard>
            <h3>Operational Core</h3>
            <InfoItem>
              <span className="icon">📍</span>
              <div>
                <h4>General Headquarters</h4>
                <p>Agrotek Plaza, Sector 7-C<br />Institutional District, Lahore, PK</p>
              </div>
            </InfoItem>
            <InfoItem>
              <span className="icon">📞</span>
              <div>
                <h4>24/7 Logistics Hot-line</h4>
                <p>+92 (300) AGROTEK<br />Active Monitoring Sequence</p>
              </div>
            </InfoItem>
            <InfoItem>
              <span className="icon">✉️</span>
              <div>
                <h4>Digital Correspondence</h4>
                <p>ops@kisanstore.pk<br />intelligence@kisanstore.pk</p>
              </div>
            </InfoItem>
          </InfoCard>

          <ContactForm onSubmit={handleSubmit}>
            <InputGroup>
              <label>Full Name / Entity</label>
              <input type="text" placeholder="Authorized Personnel" required />
            </InputGroup>
            <InputGroup>
              <label>Secure Email</label>
              <input type="email" placeholder="ops@domain.pk" required />
            </InputGroup>
            <InputGroup>
              <label>Operational Query</label>
              <textarea placeholder="Specify asset requirements or technical challenges..." required />
            </InputGroup>
            <SubmitBtn type="submit">Authorize Communication</SubmitBtn>
          </ContactForm>
        </Grid>
      </Container>
    </PageWrap>
  );
};

export default Contact;

