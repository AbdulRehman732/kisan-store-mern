import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../../api';

// ===== STYLED COMPONENTS =====
const PageContainer = styled.div`
  padding: var(--spacing-xl);
  animation: entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  background: var(--bg-app);
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--spacing-xxl);
  flex-wrap: wrap;
  gap: var(--spacing-lg);
`;

const PageTitle = styled.h2`
  font-size: 3.5rem;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  small { font-size: 1rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7; margin-top: 8px; }
`;

const IndexDate = styled.div`
  background: var(--bg-surface-alt);
  padding: 10px 20px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border);
  font-weight: 900;
  font-size: 0.75rem;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MarketGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const CategorySection = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
  transition: var(--transition-smooth);
  
  &:hover { transform: translateY(-5px); border-color: var(--accent); box-shadow: var(--shadow-premium); }
`;

const CategoryBanner = styled.div`
  background: var(--primary);
  padding: 40px;
  color: var(--text-inverse);
  position: relative;
  overflow: hidden;

  h3 { font-size: 2.2rem; margin: 0; letter-spacing: -0.01em; position: relative; z-index: 2; }
  .badge { position: relative; z-index: 2; display: inline-block; margin-top: 8px; background: rgba(255,255,255,0.15); padding: 4px 12px; border-radius: var(--radius-pill); font-size: 0.7rem; font-weight: 900; text-transform: uppercase; }
  
  &::after { content: ''; position: absolute; inset: 0; background: linear-gradient(45deg, rgba(245, 182, 17, 0.1) 0%, transparent 100%); z-index: 1; }
`;

const ElitePriceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  thead th { padding: 24px; text-align: left; font-size: 0.7rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; border-bottom: 1px solid var(--border); }
  tbody td { padding: 24px; border-bottom: 1px solid var(--border); color: var(--text-primary); font-weight: 700; }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover td { background: var(--bg-surface-alt); }
`;

const PriceDisplay = styled.div`
  font-size: 1.2rem;
  font-weight: 900;
  span { font-size: 0.8rem; opacity: 0.6; margin-right: 4px; }
`;

const StockHighlight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  background: ${p => p.$inStock ? 'rgba(76, 175, 80, 0.1)' : 'rgba(212, 106, 79, 0.1)'};
  color: ${p => p.$inStock ? '#4CAF50' : '#FF5252'};
  border: 1px solid currentColor;
`;

const TacticalFooter = styled.div`
  margin-top: 60px;
  background: var(--bg-surface-alt);
  border-radius: var(--radius-md);
  padding: 40px;
  border: 1px solid var(--border);
  
  h4 { font-size: 1rem; color: var(--text-primary); font-weight: 900; text-transform: uppercase; margin-bottom: 12px; }
  p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; font-weight: 600; }
`;

// ===== COMPONENT =====
const emojis = { Fertilizer: '🌱', Seeds: '🌾', Chemicals: '🧪', Tools: '🛠️' };

const PriceList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data.products || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const grouped = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <PageContainer>
      <ContentWrapper>
        <TopHeader>
          <PageTitle>Market Intel <small>INSTITUTIONAL PRICING INDEX</small></PageTitle>
          <IndexDate>SYST_INDEX: {new Date().toLocaleDateString()}</IndexDate>
        </TopHeader>

        {loading ? (
          <div style={{display:'flex',justifyContent:'center',padding:'120px'}}><div style={{width:'60px',height:'60px',border:'5px solid var(--border)',borderTopColor:'var(--primary)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} /></div>
        ) : (
          <MarketGrid>
            {Object.entries(grouped).map(([category, items]) => (
              <CategorySection key={category}>
                <CategoryBanner>
                  <h3>{category}</h3>
                  <div className="badge">{items.length} VERIFIED ASSETS</div>
                </CategoryBanner>
                <div style={{overflowX: 'auto'}}>
                  <ElitePriceTable>
                    <thead>
                      <tr><th>Specification</th><th>Origin</th><th>Valuation</th><th>Inventory Status</th></tr>
                    </thead>
                    <tbody>
                      {items.map(p => (
                        <tr key={p._id}>
                          <td>
                            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                              <span style={{fontSize:'1.5rem'}}>{emojis[category] || '📦'}</span>
                              <div style={{fontWeight:900, fontSize:'1.1rem'}}>{p.name}</div>
                            </div>
                          </td>
                          <td style={{opacity:0.7}}>{p.brand || 'Institutional Standard'}</td>
                          <td><PriceDisplay><span>Rs.</span>{p.price.toLocaleString()} <small style={{fontSize:'0.7rem', opacity:0.5}}>/ {p.unit}</small></PriceDisplay></td>
                          <td>
                            <StockHighlight $inStock={p.stock > 0}>
                              <div style={{width:'8px', height:'8px', borderRadius:'50%', background:'currentColor'}} />
                              {p.stock > 0 ? 'Reserve Verified' : 'Supply Depleted'}
                            </StockHighlight>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </ElitePriceTable>
                </div>
              </CategorySection>
            ))}
          </MarketGrid>
        )}

        <TacticalFooter>
          <h4>Institutional Disclosure & Baseline Disclaimer</h4>
          <p>The figures presented in this index represent standard retail baselines and are subject to dynamic market adjustments without mandatory prior notification. Operational variance in seasonal supply may impact finalized authorization totals. For high-volume procurement contracts exceeding 500 units, please initialize a direct consultation with our logistics and procurement division.</p>
        </TacticalFooter>
      </ContentWrapper>
    </PageContainer>
  );
};

export default PriceList;