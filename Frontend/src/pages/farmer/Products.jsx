import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import OrderModal from "../../components/OrderModal";
import ProductDetailModal from "../../components/ProductDetailModal";

// ===== STYLED COMPONENTS =====
const PageWrap = styled.div`
  min-height: calc(100vh - 120px);
  background: var(--bg-app);
  padding: 80px 24px;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  animation: entrance 1s cubic-bezier(0.16, 1, 0.3, 1);
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xxl);
`;

const PageTitle = styled.h1`
  font-size: clamp(3.5rem, 6vw, 5.5rem);
  color: var(--text-primary);
  margin-bottom: 16px;
`;

const PageDescription = styled.p`
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.8;
  font-weight: 500;
  opacity: 0.8;
`;

const SearchContainer = styled.div`
  max-width: 850px;
  margin: 0 auto 80px;
  position: relative;
`;

const SearchBar = styled.div`
  background: var(--glass-heavy);
  backdrop-filter: blur(25px);
  padding: 12px;
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-premium);
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  transition: var(--transition-smooth);

  &:focus-within {
    transform: translateY(-5px);
    border-color: var(--accent);
    box-shadow: 0 30px 60px var(--accent-glow);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  font-size: 1.2rem;
  font-family: inherit;
  color: var(--text-primary);
  background: transparent;
  padding: 12px 24px;
  
  &::placeholder { color: var(--text-secondary); opacity: 0.5; }
  &:focus { outline: none; }
`;

const SearchBtn = styled.button`
  background: var(--primary);
  color: var(--text-inverse);
  padding: 18px 40px;
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.9rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: var(--transition-smooth);

  &:hover {
    background: var(--accent);
    color: var(--text-inverse);
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--spacing-xxl);
  @media (max-width: 1100px) { grid-template-columns: 1fr; }
`;

const FilterPanel = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: 48px 32px;
  border: 1px solid var(--border);
  position: sticky;
  top: 120px;
  height: fit-content;
  box-shadow: var(--shadow-subtle);
`;

const FilterGroup = styled.div`
  margin-bottom: 48px;
  h4 {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 24px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    opacity: 0.6;
    border-bottom: 1px solid var(--border);
    padding-bottom: 12px;
  }
`;

const FilterOption = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  font-size: 1rem;
  font-weight: 700;
  color: ${p => p.$active ? 'var(--primary)' : 'var(--text-secondary)'};
  background: ${p => p.$active ? 'var(--bg-surface-alt)' : 'transparent'};
  border-radius: var(--radius-md);
  transition: var(--transition-smooth);
  margin-bottom: 4px;
  border: 1px solid ${p => p.$active ? 'var(--primary)' : 'transparent'};

  &:hover {
    background: var(--bg-surface-alt);
    color: var(--primary);
    transform: translateX(8px);
  }
`;

const CategoryIndicator = styled.div`
  width: 10px; height: 10px;
  border-radius: 50%;
  background: ${p => p.$active ? 'var(--accent)' : 'var(--border)'};
  transition: var(--transition-fast);
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--spacing-xl);
`;

const Card = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: 28px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
  transition: var(--transition-smooth);
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-15px);
    box-shadow: var(--shadow-premium);
    border-color: var(--accent);
  }
`;

const ImgArea = styled.div`
  aspect-ratio: 1;
  background: var(--bg-surface-alt);
  border-radius: var(--radius-lg);
  margin-bottom: 24px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  border: 1px solid var(--border);

  img { width: 100%; height: 100%; object-fit: cover; transition: var(--transition-slow); }
  ${Card}:hover & img { transform: scale(1.1) rotate(2deg); }
`;

const Name = styled.h3`
  font-size: 1.8rem;
  color: var(--text-primary);
  margin-bottom: 8px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
`;

const Price = styled.div`
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--text-primary);
  span { font-size: 0.9rem; color: var(--text-secondary); margin-left: 4px; font-weight: 600; }
`;

const BtnGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;
  margin-top: 24px;
`;

const PrimaryBtn = styled.button`
  background: var(--primary);
  color: var(--text-inverse);
  padding: 16px;
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: var(--transition-smooth);
  &:hover { background: var(--accent); transform: translateY(-2px); box-shadow: 0 10px 25px var(--accent-glow); }
  &:disabled { opacity: 0.4; pointer-events: none; }
`;

const SecondaryBtn = styled(PrimaryBtn)`
  background: var(--bg-surface-alt);
  color: var(--text-primary);
  border: 1px solid var(--border);
  &:hover { background: var(--bg-app); border-color: var(--primary); box-shadow: none; }
`;

// ===== COMPONENT =====
const emojis = { Fertilizer: "📦", Seeds: "🌾" };

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState("All");
  const [crop, setCrop] = useState("All");
  const [availability, setAvailability] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (category !== "All") params.category = category;
      if (crop !== "All") params.crop = crop;
      if (availability !== "all") params.availability = availability;
      const res = await api.get("/products", { params });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, crop, availability]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleOrderClick = (p) => {
    if (!user) return alert("Authorization required. Please login.");
    setSelectedProduct(p);
    setShowOrderModal(true);
  };

  return (
    <PageWrap>
      <Container>
        <PageHeader>
          <PageTitle>Agricultural Exchange</PageTitle>
          <PageDescription>
            Tactical procurement of elite-grade fertilizers and high-yield genetic seeds. 
            Calibrated for peak institutional production.
          </PageDescription>
        </PageHeader>

        <SearchContainer>
          <SearchBar>
            <span style={{padding:'0 24px', fontSize:'1.4rem'}}>🔍</span>
            <SearchInput
              type="text"
              placeholder="Search assets by name, class or specification..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <SearchBtn>Analyze Index</SearchBtn>
          </SearchBar>
        </SearchContainer>

        <Layout>
          <FilterPanel>
            <FilterGroup>
              <h4>Asset Classes</h4>
              {["All", "Fertilizer", "Seeds"].map((cat) => (
                <FilterOption key={cat} $active={category === cat} onClick={() => setCategory(cat)}>
                  <CategoryIndicator $active={category === cat} />
                  {cat}
                </FilterOption>
              ))}
            </FilterGroup>

            <FilterGroup>
              <h4>Mobilization Status</h4>
              {[
                { val: "all", label: "Global Inventory" },
                { val: "inStock", label: "Ready to Dispatch" },
                { val: "outOfStock", label: "Logistics Delay" },
              ].map((opt) => (
                <FilterOption key={opt.val} $active={availability === opt.val} onClick={() => setAvailability(opt.val)}>
                  <CategoryIndicator $active={availability === opt.val} />
                  {opt.label}
                </FilterOption>
              ))}
            </FilterGroup>

            <FilterGroup>
              <h4>Application Target</h4>
              {["All", "Wheat", "Cotton", "Rice", "Maize", "Citrus"].map((c) => (
                <FilterOption key={c} $active={crop === c} onClick={() => setCrop(c)}>
                  <CategoryIndicator $active={crop === c} />
                  {c}
                </FilterOption>
              ))}
            </FilterGroup>

            <SecondaryBtn style={{width:'100%', fontSize:'0.75rem'}} onClick={() => { setSearch(''); setCategory('All'); setCrop('All'); setAvailability('all'); }}>Reset System Filters</SecondaryBtn>
          </FilterPanel>

          <main>
            {loading ? (
              <div style={{display:'flex',justifyContent:'center',padding:'150px'}}><div style={{width:'60px',height:'60px',border:'5px solid var(--border)',borderTopColor:'var(--primary)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} /></div>
            ) : products.length === 0 ? (
              <div style={{textAlign:'center', padding:'120px 40px', background:'var(--bg-surface)', borderRadius:'var(--radius-card)', border:'1px dashed var(--border)'}}>
                <div style={{fontSize:'5rem', marginBottom:'24px'}}>📋</div>
                <h3>No Matching Assets</h3>
                <p>Adjust your operational parameters to relocate inventory.</p>
              </div>
            ) : (
              <ProductGrid>
                {products.map((p) => (
                  <Card key={p._id}>
                    <ImgArea onClick={() => { setSelectedProduct(p); setShowDetailModal(true); }}>
                      {p.image?.[0] ? (
                        <img src={`http://localhost:5000${p.image[0]}`} alt={p.name} />
                      ) : (emojis[p.category] || "📦")}
                    </ImgArea>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
                      <span style={{fontSize:'0.7rem', fontWeight:900, textTransform:'uppercase', color:'var(--primary)', background:'var(--bg-surface-alt)', padding:'4px 12px', borderRadius:'100px'}}>{p.category}</span>
                      <span style={{fontSize:'0.8rem', fontWeight:800, color: p.stock > 0 ? '#4CAF50' : '#FF5252'}}>{p.stock > 0 ? `${p.stock} units` : 'RESERVE DEPLETED'}</span>
                    </div>
                    <Name>{p.name}</Name>
                    <p style={{fontSize:'1rem', color:'var(--text-secondary)', opacity:0.8, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden'}}>{p.description || "Proprietary high-output formulation for professional use."}</p>
                    
                    <InfoRow>
                      <Price>{p.price.toLocaleString()}<span>/ {p.unit}</span></Price>
                    </InfoRow>

                    <BtnGroup>
                      <SecondaryBtn onClick={() => addToCart(p)} disabled={p.stock === 0}>🛒</SecondaryBtn>
                      <PrimaryBtn onClick={() => handleOrderClick(p)} disabled={p.stock === 0}>Authorize Purchase</PrimaryBtn>
                    </BtnGroup>
                  </Card>
                ))}
              </ProductGrid>
            )}
          </main>
        </Layout>
      </Container>

      {showOrderModal && selectedProduct && (
        <OrderModal
          product={selectedProduct}
          onClose={() => setShowOrderModal(false)}
          onSuccess={() => { setShowOrderModal(false); fetchProducts(); }}
        />
      )}

      {showDetailModal && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setShowDetailModal(false)}
          onBuy={() => { setShowDetailModal(false); handleOrderClick(selectedProduct); }}
        />
      )}
    </PageWrap>
  );
};

export default Products;
