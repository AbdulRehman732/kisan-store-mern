import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// ===== STYLED COMPONENTS =====
const FooterContainer = styled.footer`
  background: var(--bg-surface);
  border-top: 1px solid var(--border);
  padding: 80px 24px 40px;
  margin-top: 80px;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 60px;
  
  @media (max-width: 1100px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const Column = styled.div`
  h4 {
    font-size: 0.85rem;
    font-weight: 900;
    color: var(--primary);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 32px;
  }
`;

const BrandBlock = styled.div`
  .logo {
    font-family: 'Fraunces', serif;
    font-size: 2.2rem;
    font-weight: 900;
    color: var(--text-primary);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    span { font-weight: 400; opacity: 0.6; }
  }
  p {
    color: var(--text-secondary);
    line-height: 1.8;
    font-size: 1rem;
    font-weight: 600;
    max-width: 320px;
  }
`;

const NavLinks = styled.ul`
  list-style: none;
  padding: 0;
  li { margin-bottom: 16px; }
  a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 700;
    transition: var(--transition-smooth);
    &:hover { color: var(--primary); transform: translateX(8px); display: inline-block; }
  }
`;

const ContactInfo = styled.div`
  p {
    color: var(--text-secondary);
    font-size: 0.95rem;
    font-weight: 700;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .highlight { color: var(--primary); font-weight: 900; }
`;

const SocialStrip = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
  a {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: var(--bg-surface-alt);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: var(--transition-smooth);
    &:hover { background: var(--primary); color: white; transform: translateY(-5px); }
  }
`;

const Copyright = styled.div`
  max-width: 1400px;
  margin: 80px auto 0;
  padding-top: 40px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  
  @media (max-width: 600px) { flex-direction: column; gap: 20px; text-align: center; }
`;

// ===== COMPONENT =====
const Footer = () => {
  return (
    <FooterContainer>
      <ContentWrapper>
        <Column>
          <BrandBlock>
            <Link to="/" className="logo">🌾 Agrotek<span>Elite</span></Link>
            <p>Empowering agricultural strategic operations through high-fidelity intelligence and institutional-grade resource mobilization.</p>
            <SocialStrip>
              <a href="#">📘</a>
              <a href="#">📸</a>
              <a href="#">🐦</a>
              <a href="#">💼</a>
            </SocialStrip>
          </BrandBlock>
        </Column>

        <Column>
          <h4>Strategic Exchange</h4>
          <NavLinks>
            <li><Link to="/products">Asset Catalog</Link></li>
            <li><Link to="/price-list">Market Dynamics</Link></li>
            <li><Link to="/soil-registry">Tactical Recon</Link></li>
            <li><Link to="/crop-doctor">Precision Diagnosis</Link></li>
          </NavLinks>
        </Column>

        <Column>
          <h4>Stakeholder Hub</h4>
          <NavLinks>
            <li><Link to="/profile">Member Identity</Link></li>
            <li><Link to="/my-orders">Procurement History</Link></li>
            <li><Link to="/cart">Dossier Manager</Link></li>
            <li><Link to="/contact">Crisis Support</Link></li>
          </NavLinks>
        </Column>

        <Column>
          <h4>Command Center</h4>
          <ContactInfo>
            <p>📍 <span className="highlight">Faisalabad Strategic Hub</span></p>
            <p>📞 +92 300 0000000</p>
            <p>✉️ command@agrotek-elite.com</p>
            <p style={{ marginTop: '24px', fontStyle: 'italic', opacity: 0.7 }}>"Rooting intelligence, harvesting excellence."</p>
          </ContactInfo>
        </Column>
      </ContentWrapper>

      <Copyright>
        <div>© 2026 Agrotek Elite Intelligence Systems</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Protocol</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Operational Terms</a>
        </div>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
