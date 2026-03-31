import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../../api';

// ===== ANIMATIONS =====
const spin = keyframes`to { transform: rotate(360deg); }`;

// ===== STYLED COMPONENTS =====
// ===== STYLED COMPONENTS =====
const PageWrap = styled.div`
  min-height: calc(100vh - 120px);
  background: var(--bg-cream);
  padding: 80px 24px;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 3.5rem;
  color: var(--primary);
  margin-bottom: 12px;
  text-align: left;
`;

const Subtitle = styled.p`
  color: var(--text-muted);
  font-size: 1.1rem;
  margin-bottom: 54px;
  font-weight: 500;
`;

const CategoryBlock = styled.div`
  margin-bottom: 48px;
  border-radius: var(--radius-card);
  overflow: hidden;
  background: var(--white);
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--border-soft);
`;

const CategoryHeader = styled.div`
  background: var(--primary);
  color: var(--white);
  padding: 32px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-size: 1.8rem;
    letter-spacing: -0.02em;
  }
`;

const ItemCount = styled.span`
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--radius-pill);
  padding: 6px 18px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  padding: 20px;

  table {
    width: 100%;
    border-collapse: collapse;
    background: var(--white);
  }

  thead th {
    padding: 24px 20px;
    text-align: left;
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text-charcoal);
    border-bottom: 2px solid var(--bg-cream);
  }

  tbody td {
    padding: 24px 20px;
    border-bottom: 1px solid var(--bg-cream);
    color: var(--text-muted);
    font-weight: 500;
  }

  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: var(--bg-cream); }
`;

const StockBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 800;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  background: ${p => p.inStock ? 'var(--primary)' : '#fdf2f0'};
  color: ${p => p.inStock ? 'var(--white)' : '#d46a4f'};
  text-transform: uppercase;
`;

const Disclaimer = styled.div`
  background: var(--white);
  border: 1px solid var(--border-soft);
  border-radius: 20px;
  padding: 28px 36px;
  font-size: 1rem;
  color: var(--text-muted);
  margin-top: 54px;
  line-height: 1.6;
  strong { color: var(--primary); font-weight: 800; }
`;

const SpinnerWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid var(--bg-cream);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

// ===== COMPONENT =====
const emojis = { Fertilizer: '🌱', Seeds: '🌾' };

const PriceList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const grouped = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <PageWrap>
      <Container>
        <PageTitle>Commodity Index</PageTitle>
        <Subtitle>
          📅 Market baseline as of {new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
          &nbsp;| Standard institutional pricing.
        </Subtitle>

        {loading ? (
          <SpinnerWrap><Spinner /></SpinnerWrap>
        ) : Object.keys(grouped).length === 0 ? (
          <div style={{ textAlign:'center', padding:'100px 20px', color:'var(--text-muted)' }}>
            <span style={{ fontSize:'4rem', display:'block', marginBottom:'24px' }}>📋</span>
            <h3 style={{ fontSize:'1.5rem' }}>No inventory registered</h3>
          </div>
        ) : (
          <>
            {Object.entries(grouped).map(([category, items]) => (
              <CategoryBlock key={category}>
                <CategoryHeader>
                  <h3>{emojis[category] || '📦'} {category}</h3>
                  <ItemCount>{items.length} units available</ItemCount>
                </CategoryHeader>
                <TableWrapper>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Product Specification</th>
                        <th>Brand Alpha</th>
                        <th>Market Price</th>
                        <th>Standard Unit</th>
                        <th>Availability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((p, idx) => (
                        <tr key={p._id}>
                          <td style={{ color: 'var(--text-muted)', fontSize:'0.75rem' }}>{idx + 1}</td>
                          <td style={{ fontWeight: 800, color: 'var(--primary)', fontSize:'1.1rem' }}>{p.name}</td>
                          <td>{p.brand || '—'}</td>
                          <td style={{ fontWeight: 800, color: 'var(--text-charcoal)' }}>Rs. {p.price.toLocaleString()}</td>
                          <td>{p.unit}</td>
                          <td>
                            <StockBadge inStock={p.stock > 0}>
                              {p.stock > 0 ? 'Verified' : 'Exhausted'}
                            </StockBadge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableWrapper>
              </CategoryBlock>
            ))}
            <Disclaimer>
              ⚠️ <strong>Institutional Disclaimer:</strong> Figures represent retail baselines and are subject to change without prior notice. Seasonal variance may apply. For wholesale procurement exceeding 500 units, please contact our logistics division.
            </Disclaimer>
          </>
        )}
      </Container>
    </PageWrap>
  );
};

export default PriceList;