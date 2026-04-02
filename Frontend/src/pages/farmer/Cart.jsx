import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

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
`;

const PageTitle = styled.h2`
  font-size: 4rem;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  small { font-size: 1.1rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7; margin-top: 8px; }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: var(--spacing-xxl);
  @media (max-width: 1100px) { grid-template-columns: 1fr; }
`;

const DossierPanel = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: var(--spacing-xl);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
`;

const AssetRow = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr 180px;
  gap: var(--spacing-xl);
  align-items: center;
  padding: var(--spacing-xl) 0;
  border-bottom: 1px solid var(--border);
  transition: var(--transition-smooth);
  
  &:hover { background: var(--bg-surface-alt); }
  &:last-child { border-bottom: none; }
  @media (max-width: 768px) { grid-template-columns: 100px 1fr; }
`;

const AssetImage = styled.div`
  width: 140px;
  height: 140px;
  border-radius: var(--radius-md);
  background: var(--bg-surface-alt);
  border: 1px solid var(--border);
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const AssetDetails = styled.div`
  h3 { font-size: 1.8rem; color: var(--text-primary); margin-bottom: 8px; }
  .meta { font-size: 1rem; color: var(--text-secondary); font-weight: 700; margin-bottom: 12px; }
  .control-btn { background: none; border: none; color: #FF5252; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; padding: 0; }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  
  button {
    width: 44px; height: 44px;
    background: var(--bg-surface-alt);
    border: 1px solid var(--border);
    border-radius: 12px;
    font-size: 1.2rem;
    font-weight: 900;
    color: var(--text-primary);
    cursor: pointer;
    transition: var(--transition-smooth);
    &:hover:not(:disabled) { background: var(--primary); color: white; border-color: var(--primary); }
    &:disabled { opacity: 0.3; }
  }
  
  span { font-size: 1.4rem; font-weight: 900; min-width: 40px; text-align: center; color: var(--text-primary); }
`;

const SummaryPanel = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: var(--spacing-xl);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-premium);
  position: sticky;
  top: 100px;
  height: fit-content;

  &::before { content:''; position:absolute; top:0; left:0; right:0; height:6px; background: var(--primary); border-radius: 4px 4px 0 0; }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-secondary);
  
  &.total {
    font-size: 2.2rem;
    color: var(--text-primary);
    border-top: 1px solid var(--border);
    padding-top: 32px;
    margin-top: 32px;
    span:last-child { color: var(--accent); }
  }
`;

const FormGroup = styled.div`
  margin-top: 32px;
  label { display: block; font-size: 0.75rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.1em; }
  input, textarea {
    width: 100%;
    padding: 18px;
    background: var(--bg-surface-alt);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    color: var(--text-primary);
    font-weight: 700;
    transition: var(--transition-smooth);
    &:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 15px var(--accent-glow); }
  }
`;

const CheckoutBtn = styled.button`
  width: 100%;
  padding: 22px;
  background: var(--primary);
  color: var(--text-inverse);
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 1rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-top: 32px;
  box-shadow: 0 15px 40px rgba(76, 175, 80, 0.2);
  cursor: pointer;
  
  &:hover:not(:disabled) { background: var(--accent); color: var(--text-inverse); transform: translateY(-3px); box-shadow: var(--shadow-premium); }
  &:disabled { opacity: 0.4; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 120px 40px;
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  border: 1px dashed var(--border);
  
  .icon { font-size: 6rem; margin-bottom: 32px; display: block; }
  h3 { font-size: 2.5rem; color: var(--text-primary); margin-bottom: 12px; }
  p { color: var(--text-secondary); font-weight: 700; margin-bottom: 40px; }
`;

// ===== COMPONENT =====
const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, totalAmount, taxTotal, grandTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [pickupDate, setPickupDate] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { if (user?.phone?.length) setPhone(user.phone[0]); }, [user]);

  const handleCheckout = async () => {
    if (!cart.length) return;
    if (!user) return navigate("/login");
    if (!pickupDate) return setMessage("Authorized deployment date required.");
    if (!phone.trim()) return setMessage("Tactical contact reference required.");

    setLoading(true); setMessage("");
    try {
      await api.post("/orders", {
        items: cart.map(i => ({ product: i._id, quantity: i.quantity, price: i.price, taxAmount: i.taxAmount || 0 })),
        pickupDate, farmerPhone: phone, notes
      });
      clearCart(); navigate("/my-orders");
    } catch (err) { setMessage(err.response?.data?.message || "Operational Protocol Failure."); } 
    finally { setLoading(false); }
  };

  if (!cart.length) {
    return (
      <PageContainer>
        <ContentWrapper>
          <EmptyState>
            <span className="icon">📦</span>
            <h3>Inventory Dossier Vacant</h3>
            <p>Your current procurement list is neutral. Access the strategic catalog to enlist agricultural assets.</p>
            <CheckoutBtn as={Link} to="/products" style={{textDecoration:'none', display:'inline-block', width:'auto'}}>ENTER CATALOG</CheckoutBtn>
          </EmptyState>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <TopHeader>
          <PageTitle>Procurement Dossier <small>STRATEGIC ASSET ALLOCATION LOG</small></PageTitle>
        </TopHeader>

        <MainGrid>
          <DossierPanel>
            {cart.map(item => (
              <AssetRow key={item._id}>
                <AssetImage>{item.image?.[0] ? <img src={`http://localhost:5000${item.image[0]}`} alt={item.name} /> : "📦"}</AssetImage>
                <AssetDetails>
                  <h3>{item.name}</h3>
                  <div className="meta">Valuation: Rs. {item.price.toLocaleString()} / {item.unit}</div>
                  <div style={{color: item.stock < 10 ? '#FF5252' : 'var(--primary)', fontStyle:'italic', fontWeight:900, fontSize:'0.8rem'}}>Strategic Reserve: {item.stock} Units</div>
                  <button className="control-btn" onClick={() => removeFromCart(item._id)}>Discard from Log</button>
                </AssetDetails>
                <QuantityControl>
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={item.quantity >= item.stock}>+</button>
                </QuantityControl>
              </AssetRow>
            ))}
          </DossierPanel>

          <SummaryPanel>
            <h3 style={{fontSize:'1.8rem', color:'var(--text-primary)', marginBottom:'32px'}}>Institutional Audit</h3>
            <SummaryRow><span>Primary Assets</span><span>{cart.length} Classification(s)</span></SummaryRow>
            <SummaryRow><span>Gross Valuation</span><span>Rs. {totalAmount.toLocaleString()}</span></SummaryRow>
            {taxTotal > 0 && <SummaryRow><span>Institutional Levy</span><span>Rs. {taxTotal.toLocaleString()}</span></SummaryRow>}
            
            <FormGroup><label>Designated Deployment Date</label><input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} /></FormGroup>
            <FormGroup><label>Operational Reference (Contact)</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} /></FormGroup>
            <FormGroup><label>Logistics Remark</label><textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} /></FormGroup>

            <SummaryRow className="total"><span>Final Authorized magnitude</span><span>Rs. {grandTotal.toLocaleString()}</span></SummaryRow>
            {message && <div style={{background:'rgba(212, 106, 79, 0.1)', color:'#FF5252', padding:'16px', borderRadius:'12px', fontWeight:900, fontSize:'0.8rem', marginTop:'24px'}}>⚠ {message}</div>}
            
            <CheckoutBtn onClick={handleCheckout} disabled={loading}>
              {loading ? "AUTHORIZING..." : "Confirm Strategic Mobilization"}
            </CheckoutBtn>
          </SummaryPanel>
        </MainGrid>
      </ContentWrapper>
    </PageContainer>
  );
};

export default Cart;
