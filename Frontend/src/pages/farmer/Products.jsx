import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import OrderModal from "../../components/OrderModal";
import ProductDetailModal from "../../components/ProductDetailModal";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ===== STYLED COMPONENTS =====
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 30px;
`;

const PageContent = styled.div`
  padding: 60px 0 100px;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const PageTitle = styled.h1`
  font-size: clamp(3rem, 5vw, 4.5rem);
  margin-bottom: 16px;
  letter-spacing: -0.02em;
  color: var(--primary);
`;

const PageDescription = styled.p`
  font-size: 1.2rem;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const SearchContainer = styled.div`
  max-width: 800px;
  margin: 0 auto 60px;
  position: relative;
  z-index: 10;
`;

const SearchBar = styled.div`
  background: var(--white);
  padding: 10px;
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-premium);
  display: flex;
  align-items: center;
  border: 1px solid var(--border-soft);
  transition: var(--transition);

  &:focus-within {
    box-shadow: 0 30px 60px rgba(245, 182, 17, 0.15);
    border-color: var(--accent);
  }
`;

const SearchIcon = styled.div`
  padding: 0 20px;
  font-size: 1.2rem;
  color: var(--text-muted);
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  font-size: 1.1rem;
  font-family: "Inter", sans-serif;
  color: var(--text-charcoal);
  background: transparent;
  padding: 10px 0;
  
  &::placeholder {
    color: var(--text-muted);
    opacity: 0.6;
  }
  
  &:focus { outline: none; }
`;

const SearchBtn = styled.button`
  background: var(--accent);
  color: var(--primary);
  padding: 16px 36px;
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.95rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  box-shadow: 0 8px 20px rgba(245, 182, 17, 0.2);

  &:hover {
    background: var(--primary);
    color: var(--white);
    transform: translateY(-2px);
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 60px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FilterPanel = styled.div`
  background: var(--white);
  border-radius: var(--radius-card);
  padding: 40px 30px;
  border: 1px solid var(--border-soft);
  position: sticky;
  top: 120px;
  box-shadow: var(--shadow-card);
`;

const FilterGroup = styled.div`
  margin-bottom: 40px;
  
  h4 {
    font-size: 1.2rem;
    color: var(--primary);
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--bg-cream);
    letter-spacing: -0.01em;
  }
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  padding: 12px 16px;
  font-size: 1rem;
  font-weight: 700;
  color: ${p => p.active ? 'var(--primary)' : 'var(--text-muted)'};
  background: ${p => p.active ? 'var(--bg-cream)' : 'transparent'};
  border-radius: var(--radius-sm);
  transition: var(--transition);
  margin-bottom: 4px;

  &:hover {
    background: var(--bg-cream);
    color: var(--primary);
    transform: translateX(4px);
  }

  input { display: none; }
`;

const ActiveMark = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid ${p => p.active ? 'var(--accent)' : 'var(--border-soft)'};
  background: ${p => p.active ? 'var(--accent)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  
  &::after {
    content: '';
    width: 6px;
    height: 10px;
    border: solid var(--primary);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    display: ${p => p.active ? 'block' : 'none'};
    margin-top: -2px;
  }
`;

const ResetFiltersBtn = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: var(--radius-pill);
  border: 2px solid var(--border-soft);
  background: transparent;
  color: var(--text-muted);
  font-weight: 800;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  
  &:hover {
    border-color: var(--primary);
    color: var(--primary);
    background: var(--bg-cream);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 40px;
`;

const ProductCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-card);
  padding: 24px;
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-card);
  transition: var(--transition);
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-20px);
    box-shadow: var(--shadow-premium);
    border-color: var(--accent);
  }
`;

const ProductImg = styled.div`
  height: 280px;
  background: var(--bg-cream);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  overflow: hidden;
  position: relative;
  
  img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    transition: transform 0.8s ease; 
  }
  
  ${ProductCard}:hover & img {
    transform: scale(1.05);
  }
`;

const CategoryBadge = styled.div`
  display: inline-block;
  padding: 8px 16px;
  background: ${p => p.$category === 'Fertilizer' ? '#e8f5ed' : '#fff9e6'};
  color: ${p => p.$category === 'Fertilizer' ? '#1e5330' : '#b45309'};
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 16px;
  letter-spacing: 0.05em;
`;

const ProductName = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
  flex-shrink: 0;
`;

const ProductDesc = styled.p`
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 24px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
`;

const ProductFooterWrapper = styled.div`
  margin-top: auto;
`;

const PricingArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-soft);
`;

const PriceTag = styled.div`
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--primary);
  
  small {
    font-weight: 500;
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-left: 4px;
  }
`;

const StockTag = styled.div`
  font-size: 0.8rem;
  font-weight: 800;
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  background: ${p => p.$inStock ? 'rgba(30, 83, 48, 0.1)' : 'rgba(212, 106, 79, 0.1)'};
  color: ${p => p.$inStock ? '#1e5330' : '#d46a4f'};
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionBtn = styled.button`
  flex: 1;
  padding: 16px 12px;
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &.primary {
    background: var(--primary);
    color: var(--white);
    &:hover:not(:disabled) {
      background: var(--accent);
      color: var(--primary);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(245, 182, 17, 0.3);
    }
  }
  
  &.secondary {
    background: var(--bg-cream);
    color: var(--primary);
    &:hover:not(:disabled) {
      background: #e6e0d4;
      transform: translateY(-2px);
    }
  }
  
  &:disabled { 
    opacity: 0.5; 
    cursor: not-allowed; 
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 120px 0;
  font-size: 1.2rem;
  color: var(--text-muted);
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 120px 40px;
  background: var(--white);
  border-radius: var(--radius-card);
  border: 1px dashed var(--border-soft);
  
  .icon { font-size: 4rem; opacity: 0.4; margin-bottom: 24px; }
  h3 { font-size: 1.8rem; color: var(--primary); margin-bottom: 12px; }
  p { color: var(--text-muted); font-size: 1.1rem; }
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
    const timerId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timerId);
  }, [search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (category !== "All") params.category = category;
      if (crop !== "All") params.crop = crop;
      if (availability !== "all") params.availability = availability;
      // Removed unused min/max price for cleaner UI right now
      
      const res = await api.get("/products", { params });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, crop, availability]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOrderClick = (product) => {
    if (!user) {
      alert("Please login to place an order");
      return;
    }
    setSelectedProduct(product);
    setShowOrderModal(true);
  };

  const handleDetailClick = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <Container>
      <PageContent>
        <PageHeader>
          <div className="pill-label">INSTITUTIONAL CATALOG</div>
          <PageTitle>Agricultural Marketplace</PageTitle>
          <PageDescription>
            Explore our curated selection of premium fertilizers and high-yield seeds. Formulated for maximum output and soil health.
          </PageDescription>
        </PageHeader>

        <SearchContainer>
          <SearchBar>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search by product name, category or nutrient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <SearchBtn>Search Catalog</SearchBtn>
          </SearchBar>
        </SearchContainer>

        <Layout>
          <FilterPanel>
            <FilterGroup>
              <h4>Collections</h4>
              {["All", "Fertilizer", "Seeds"].map((cat) => (
                <FilterOption key={cat} active={category === cat}>
                  <input type="radio" checked={category === cat} onChange={() => setCategory(cat)} />
                  <ActiveMark active={category === cat} />
                  {cat}
                </FilterOption>
              ))}
            </FilterGroup>

            <FilterGroup>
              <h4>Operational Status</h4>
              {[
                { val: "all", label: "All Assets" },
                { val: "inStock", label: "Ready to Dispatch" },
                { val: "outOfStock", label: "Awaiting Restock" },
              ].map((opt) => (
                <FilterOption key={opt.val} active={availability === opt.val}>
                  <input type="radio" checked={availability === opt.val} onChange={() => setAvailability(opt.val)} />
                  <ActiveMark active={availability === opt.val} />
                  {opt.label}
                </FilterOption>
              ))}
            </FilterGroup>

            <FilterGroup>
              <h4>Target application</h4>
              {["All", "Wheat", "Cotton", "Rice", "Maize", "Sugarcane", "Citrus"].map((c) => (
                <FilterOption key={c} active={crop === c}>
                  <input type="radio" checked={crop === c} onChange={() => setCrop(c)} />
                  <ActiveMark active={crop === c} />
                  {c}
                </FilterOption>
              ))}
            </FilterGroup>

            <ResetFiltersBtn 
              onClick={() => { setSearch(''); setCategory('All'); setCrop('All'); setAvailability('all'); }} 
            >
              Clear Preferences
            </ResetFiltersBtn>
          </FilterPanel>

          <main>
            {loading ? (
              <LoadingState>Retrieving institutional assets...</LoadingState>
            ) : products.length === 0 ? (
              <EmptyState>
                <div className="icon">🌾</div>
                <h3>No Items Found</h3>
                <p>Try adjusting your search filters to find what you're looking for.</p>
              </EmptyState>
            ) : (
              <ProductGrid>
                {products.map((p) => (
                  <ProductCard key={p._id}>
                    <ProductImg onClick={() => handleDetailClick(p)} style={{cursor: 'pointer'}}>
                      {p.image?.[0] ? (
                        <img src={`http://localhost:5000${p.image[0]}`} alt={p.name} />
                      ) : (
                        <div style={{fontSize: '4rem'}}>{emojis[p.category] || "📦"}</div>
                      )}
                    </ProductImg>
                    
                    <CategoryBadge $category={p.category}>{p.category}</CategoryBadge>
                    <ProductName>{p.name}</ProductName>
                    <ProductDesc>{p.description || "Premium agricultural asset designed for maximum yield."}</ProductDesc>
                    
                    <ProductFooterWrapper>
                      <PricingArea>
                        <PriceTag>
                          Rs. {p.price.toLocaleString()}
                          <small>/{p.unit}</small>
                        </PriceTag>
                        <StockTag $inStock={p.stock > 0}>
                          {p.stock > 0 ? `${p.stock} units` : 'SOLD OUT'}
                        </StockTag>
                      </PricingArea>

                      <ActionButtonGroup>
                        <ActionBtn className="secondary" onClick={() => handleDetailClick(p)}>
                          View
                        </ActionBtn>
                        <ActionBtn className="secondary" onClick={() => handleAddToCart(p)} disabled={p.stock === 0}>
                          🛒 Cart
                        </ActionBtn>
                        <ActionBtn className="primary" onClick={() => handleOrderClick(p)} disabled={p.stock === 0}>
                          Buy Now
                        </ActionBtn>
                      </ActionButtonGroup>
                    </ProductFooterWrapper>
                  </ProductCard>
                ))}
              </ProductGrid>
            )}
          </main>
        </Layout>
      </PageContent>

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
    </Container>
  );
};

export default Products;
