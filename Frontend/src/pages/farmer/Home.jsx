import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import api from '../../api';

// ===== ANIMATIONS =====
const ticker = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`to { transform: rotate(360deg); }`;

// ===== STYLED COMPONENTS =====
const TickerBar = styled.div`
  background: var(--accent);
  color: var(--primary);
  padding: 14px 0;
  overflow: hidden;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(0,0,0,0.05);
`;

const TickerInner = styled.div`
  display: flex;
  gap: 80px;
  animation: ${ticker} 40s linear infinite;
  white-space: nowrap;
`;

const TickerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  span { color: var(--primary); }
`;

const Hero = styled.section`
  min-height: 90vh;
  position: relative;
  display: flex;
  align-items: center;
  padding: 100px 0;
  background-image: url('http://localhost:5000/uploads/hero_farm.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: var(--white);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(26,42,18,0.9) 0%, rgba(26,42,18,0.4) 100%);
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 30px;
  position: relative;
  z-index: 10;
`;

const HeroContent = styled.div`
  max-width: 800px;
  background: rgba(26, 42, 18, 0.4);
  backdrop-filter: blur(15px);
  padding: 60px;
  border-radius: var(--radius-card);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: var(--shadow-premium);
  animation: ${fadeIn} 1s cubic-bezier(0.165, 0.84, 0.44, 1);
`;

const HeroBadge = styled.div`
  display: inline-block;
  padding: 10px 24px;
  background: var(--gradient-gold);
  color: var(--primary);
  border-radius: var(--radius-pill);
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(245, 182, 17, 0.2);
`;

const HeroTitle = styled.h1`
  font-size: clamp(3rem, 7vw, 6rem);
  line-height: 0.95;
  margin-bottom: 30px;
  color: var(--white);
  span { color: var(--accent); font-weight: 400; font-style: italic; }
`;

const HeroText = styled.p`
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 50px;
  max-width: 650px;
  line-height: 1.6;
`;

const HeroActions = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const BtnPrimary = styled(Link)`
  padding: 20px 48px;
  background: var(--accent);
  color: var(--primary);
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  box-shadow: 0 15px 40px rgba(245, 182, 17, 0.3);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 50px rgba(245, 182, 17, 0.4);
    background: var(--white);
  }
`;

const BtnOutline = styled(Link)`
  padding: 20px 48px;
  border: 2px solid rgba(255,255,255,0.4);
  color: var(--white);
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  backdrop-filter: blur(10px);

  &:hover {
    background: var(--white);
    color: var(--primary);
    border-color: var(--white);
    transform: translateY(-5px);
  }
`;

const StatsBar = styled.section`
  background: var(--white);
  padding: 100px 0;
  border-bottom: 1px solid var(--border-soft);
  position: relative;
  z-index: 20;
  margin-top: -60px;
  border-radius: var(--radius-card) var(--radius-card) 0 0;
  box-shadow: 0 -40px 100px rgba(26, 42, 18, 0.1);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;

  @media (max-width: 992px) { grid-template-columns: repeat(2, 1fr); }
`;

const StatItem = styled.div`
  text-align: center;
  strong {
    display: block;
    font-family: 'Fraunces', serif;
    font-size: 4.5rem;
    color: var(--primary);
    margin-bottom: 8px;
    letter-spacing: -0.02em;
  }
  small {
    color: var(--text-muted);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-size: 0.8rem;
  }
`;

const PageContent = styled.section`
  padding: 140px 0;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 100px;
`;

const SectionTitle = styled.h2`
  font-size: 4.2rem;
  margin-top: 15px;
  margin-bottom: 25px;
  
  small {
    display: block;
    font-family: 'Inter', sans-serif;
    font-size: 1.2rem;
    color: var(--text-muted);
    font-weight: 500;
    margin-top: 20px;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 48px;
`;

const ProductCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-card);
  padding: 24px;
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-card);
  transition: var(--transition);
  position: relative;

  &:hover {
    transform: translateY(-20px);
    box-shadow: var(--shadow-premium);
    border-color: var(--accent);
  }
`;

const ProductImg = styled.div`
  height: 320px;
  background: #f8f9fa;
  border-radius: 30px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductBody = styled.div`
  padding: 8px 10px;
`;

const CategoryBadge = styled.div`
  display: inline-block;
  padding: 8px 18px;
  background: ${p => p.$category === 'Fertilizer' ? '#e8f5ed' : '#fff9e6'};
  color: ${p => p.$category === 'Fertilizer' ? '#1e5330' : '#b45309'};
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 15px;
  letter-spacing: 0.05em;
`;

const ProductName = styled.h3`
  font-size: 2rem;
  margin-bottom: 14px;
  letter-spacing: -0.01em;
`;

const ProductDesc = styled.p`
  color: var(--text-muted);
  font-size: 1rem;
  margin-bottom: 24px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  padding-top: 24px;
  border-top: 1px solid var(--border-soft);
`;

const ProductPrice = styled.div`
  font-weight: 900;
  font-size: 1.8rem;
  color: var(--primary);
  span { font-weight: 400; color: var(--text-muted); font-size: 1rem; }
`;

const BuyBtn = styled(Link)`
  padding: 16px 32px;
  background: var(--primary);
  color: var(--white);
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  box-shadow: 0 10px 25px rgba(26, 42, 18, 0.2);

  &:hover {
    background: var(--accent);
    color: var(--primary);
    transform: translateY(-3px);
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 40px;
  margin-top: 150px;
`;

const InfoCard = styled.div`
  background: var(--white);
  padding: 70px 50px;
  border-radius: var(--radius-card);
  border: 1px solid var(--border-soft);
  transition: var(--transition);
  text-align: center;

  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-premium);
  }

  .icon-wrap {
    width: 100px;
    height: 100px;
    background: var(--bg-cream);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    margin: 0 auto 35px;
  }
`;

const InfoTitle = styled.h3`
  margin-bottom: 20px;
  font-size: 2rem;
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

  const tickerItems = [
    'Urea: Rs. 3,500/bag', 'DAP: Rs. 9,800/bag', 'SOP: Rs. 6,200/bag',
    'CAN: Rs. 4,100/bag', 'Wheat Seeds: Rs. 1,800/40kg', 'Potash Elite: Rs. 5,500/bag',
  ];

  return (
    <div>
      <TickerBar>
        <TickerInner>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <TickerItem key={i}>💎 <span>{item}</span></TickerItem>
          ))}
        </TickerInner>
      </TickerBar>

      <Hero>
        <Container>
          <HeroContent>
            <HeroBadge>🏆 State-of-the-art Agrotech</HeroBadge>
            <HeroTitle>Pakistan's <span>Elite</span> Farming Hub</HeroTitle>
            <HeroText>
              Transforming traditional fields into high-yield assets. We provide institutional-grade fertilizers and certified seeds for the modern farmer.
            </HeroText>
            <HeroActions>
              <BtnPrimary to="/products">Enter Store 🚜</BtnPrimary>
              <BtnOutline to="/contact">Consult Officer 💬</BtnOutline>
            </HeroActions>
          </HeroContent>
        </Container>
      </Hero>

      <StatsBar>
        <Container>
          <StatsGrid>
            {[
              { val: '20Y+', label: 'Heritage' },
              { val: '5k+', label: 'Elite Farmers' },
              { val: '99%', label: 'Purity Rate' },
              { val: '15+', label: 'Districts' },
            ].map((s, i) => (
              <StatItem key={i}>
                <strong>{s.val}</strong>
                <small>{s.label}</small>
              </StatItem>
            ))}
          </StatsGrid>
        </Container>
      </StatsBar>

      <Container>
        <PageContent>
          <SectionHeader>
            <div className="pill-label">NATURE'S GOLD SELECTION</div>
            <SectionTitle>
              Institutional Reserve
              <small>Explore our high-yield botanical and chemical assets, curated for professional agriculture.</small>
            </SectionTitle>
          </SectionHeader>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>
          ) : (
            <ProductGrid>
              {featured.map(p => (
                <ProductCard key={p._id}>
                  <ProductImg>
                    {p.image?.[0] ? (
                      <img src={`http://localhost:5000${p.image[0]}`} alt={p.name} />
                    ) : '📦'}
                  </ProductImg>
                  <ProductBody>
                    <CategoryBadge $category={p.category}>{p.category}</CategoryBadge>
                    <ProductName>{p.name}</ProductName>
                    <ProductDesc>{p.description || 'Quality institutional-grade agricultural asset.'}</ProductDesc>
                    <ProductFooter>
                      <ProductPrice>
                        Rs. {p.price.toLocaleString()} <span>/ {p.unit}</span>
                      </ProductPrice>
                      <BuyBtn to="/products">Details</BuyBtn>
                    </ProductFooter>
                  </ProductBody>
                </ProductCard>
              ))}
            </ProductGrid>
          )}

          <InfoGrid>
            {[
              { icon: '🏛️', title: 'Institutional Trust', text: 'Serving the agricultural backbone of Pakistan with two decades of unparalleled quality and field-tested reliability.' },
              { icon: '🔬', title: 'Elite Soil Analysis', text: 'Our experts analyze your land to provide precise fertilization blueprints that maximize your seasonal ROI.' },
              { icon: '🛰️', title: 'Modern Logistics', text: 'Zero-delay supply chain ensures your crops never wait. Premium delivery and field-side logistics standards.' },
            ].map((item, i) => (
              <InfoCard key={i}>
                <div className="icon-wrap">{item.icon}</div>
                <InfoTitle>{item.title}</InfoTitle>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>{item.text}</p>
              </InfoCard>
            ))}
          </InfoGrid>
        </PageContent>
      </Container>
    </div>
  );
};

export default Home;