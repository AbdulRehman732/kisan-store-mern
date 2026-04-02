import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import api from '../../api';

// ===== ANIMATIONS =====
const tickerAnim = keyframes`from { transform: translateX(0); } to { transform: translateX(-50%); }`;
const float = keyframes`0% { transform: translateY(0); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0); }`;

// ===== STYLED COMPONENTS =====
const PageWrap = styled.div`
  background: var(--bg-app);
  overflow: hidden;
`;

const Ticker = styled.div`
  background: var(--primary);
  color: var(--text-inverse);
  padding: 16px 0;
  font-size: 0.9rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  border-bottom: 2px solid var(--accent);
`;

const TickerTrack = styled.div`
  display: flex;
  gap: 100px;
  animation: ${tickerAnim} 45s linear infinite;
  white-space: nowrap;
`;

const Hero = styled.section`
  min-height: 95vh;
  position: relative;
  display: flex;
  align-items: center;
  background: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, var(--primary) 0%, transparent 100%);
    opacity: 0.85;
  }
`;

const HeroContent = styled.div`
  max-width: 900px;
  position: relative;
  z-index: 10;
  padding: var(--spacing-xxl);
  animation: entrance 1.2s cubic-bezier(0.16, 1, 0.3, 1);
`;

const EliteBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 24px;
  background: var(--glass-heavy);
  border: 1px solid var(--accent);
  color: var(--accent);
  border-radius: var(--radius-pill);
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px var(--accent-glow);
`;

const HeroTitle = styled.h1`
  font-size: clamp(3.5rem, 8vw, 7.5rem);
  color: var(--text-inverse);
  line-height: 0.9;
  margin-bottom: 32px;
  span { color: var(--accent); }
`;

const HeroDesc = styled.p`
  font-size: 1.4rem;
  color: var(--text-inverse);
  opacity: 0.9;
  max-width: 700px;
  line-height: 1.7;
  margin-bottom: 54px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

const ActionBtn = styled(Link)`
  padding: 24px 54px;
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  transition: var(--transition-smooth);
  
  &.heavy {
    background: var(--accent);
    color: var(--primary);
    box-shadow: 0 20px 50px var(--accent-glow);
    &:hover { transform: translateY(-8px); background: var(--text-inverse); }
  }
  
  &.light {
    border: 2px solid rgba(255,255,255,0.4);
    color: var(--text-inverse);
    backdrop-filter: blur(10px);
    &:hover { background: rgba(255,255,255,0.1); border-color: white; transform: translateY(-5px); }
  }
`;

const MetricsSection = styled.section`
  background: var(--bg-surface);
  margin-top: -80px;
  position: relative;
  z-index: 20;
  padding: 100px 0;
  border-radius: var(--radius-card) var(--radius-card) 0 0;
  border: 1px solid var(--border);
  box-shadow: 0 -30px 100px rgba(0,0,0,0.15);
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 48px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 48px;
`;

const MetricItem = styled.div`
  text-align: center;
  h4 { font-family: 'Fraunces', serif; font-size: 4.5rem; color: var(--primary); margin-bottom: 8px; }
  p { font-size: 0.8rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.2em; opacity: 0.7; }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 40px;
  max-width: 1400px;
  margin: 120px auto;
  padding: 0 48px;
`;

const FeatureCard = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: 80px 54px;
  border: 1px solid var(--border);
  transition: var(--transition-smooth);
  text-align: center;
  position: relative;
  overflow: hidden;

  .icon { font-size: 4.5rem; margin-bottom: 32px; display: block; animation: ${float} 6s ease-in-out infinite; }
  h3 { font-size: 2.2rem; color: var(--text-primary); margin-bottom: 20px; }
  p { font-size: 1.1rem; color: var(--text-secondary); line-height: 1.8; opacity: 0.8; }

  &:hover {
    transform: translateY(-20px);
    box-shadow: var(--shadow-premium);
    border-color: var(--accent);
  }
`;

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/featured')
      .then(res => setFeatured(res.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const dataPoints = [
    'UREA INDEX: RS. 3,500/BAG', 'DAP LIQUIDITY: RS. 9,800/BAG', 'GENETIC SEED YIELD: +24%',
    'OPERATIONAL COVERAGE: 18 DISTRICTS', 'AUTH DEBENTURES: VERIFIED', 'INSTITUTIONAL TRUST: 99.8%'
  ];

  return (
    <PageWrap>
      <Ticker>
        <TickerTrack>
          {[...dataPoints, ...dataPoints].map((d, i) => (
            <div key={i} style={{display:'flex', alignItems:'center', gap:'16px'}}>
              <span style={{color:'var(--accent)'}}>✦</span> {d}
            </div>
          ))}
        </TickerTrack>
      </Ticker>

      <Hero>
        <div style={{maxWidth:'1400px', margin:'0 auto', width:'100%', padding:'0 48px'}}>
          <HeroContent>
            <EliteBadge>🏛️ Institutional Agricultural Gateway</EliteBadge>
            <HeroTitle>Pakistan's <span>Elite</span> Operational Hub</HeroTitle>
            <HeroDesc>
              Engineering the future of high-yield agriculture. We provide the 
              institutional-grade assets required for modern, state-of-the-art production.
            </HeroDesc>
            <NavLinks>
              <ActionBtn to="/products" className="heavy">Procure Assets 🚜</ActionBtn>
              <ActionBtn to="/contact" className="light">Consult Officer 💬</ActionBtn>
            </NavLinks>
          </HeroContent>
        </div>
      </Hero>

      <MetricsSection>
        <MetricGrid>
          {[
            { v: '22Y', l: 'Operational Heritage' },
            { v: '8.4k', l: 'Verified Stakeholders' },
            { v: '99.9%', l: 'Purity Factor' },
            { v: 'Nexus', l: 'Logistics Standard' }
          ].map((m, i) => (
            <MetricItem key={i}>
              <h4>{m.v}</h4>
              <p>{m.l}</p>
            </MetricItem>
          ))}
        </MetricGrid>

        <FeatureGrid>
          {[
            { i: '🏛️', t: 'Elite Governance', d: 'Serving the agricultural core of Pakistan with two decades of unparalleled quality and field-tested institutional trust.' },
            { i: '🔬', t: 'Precision Blueprints', d: 'Our geneticists and soil experts provide exact fertilization maps to maximize seasonal deployment ROI.' },
            { i: '🛰️', t: 'Nexus Logistics', d: 'Zero-latency supply chains ensure your mobilization never stalls. Premium field-side logistics as standard.' }
          ].map((f, i) => (
            <FeatureCard key={i}>
              <span className="icon">{f.i}</span>
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </FeatureCard>
          ))}
        </FeatureGrid>

        <div style={{textAlign:'center', marginTop:'80px'}}>
          <Link to="/products" style={{fontSize:'0.9rem', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.3em', color:'var(--primary)', borderBottom:'3px solid var(--accent)', paddingBottom:'8px'}}>
            Initialize Inventory Discovery
          </Link>
        </div>
      </MetricsSection>
    </PageWrap>
  );
};

export default Home;