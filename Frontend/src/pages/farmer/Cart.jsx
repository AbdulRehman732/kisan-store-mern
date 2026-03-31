import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

// ===== STYLED COMPONENTS =====
const PageWrap = styled.div`
  min-height: calc(100vh - 120px);
  background: var(--bg-cream);
  padding: 80px 24px;
`;

const Container = styled.div`
  max-width: 1200px;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 48px;
  @media (max-width: 1000px) { grid-template-columns: 1fr; }
`;

const CartPanel = styled.div`
  background: var(--white);
  border-radius: var(--radius-card);
  padding: 60px 48px;
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--border-soft);
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 140px;
  gap: 32px;
  align-items: center;
  padding: 32px 0;
  border-bottom: 2px solid var(--bg-cream);
  &:last-child { border-bottom: none; }
  @media (max-width: 600px) { grid-template-columns: 1fr; text-align: center; }
`;

const ItemImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: var(--radius-sm);
  background: var(--bg-cream);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-size: 2.5rem;
  border: 1px solid var(--border-soft);
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ItemName = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--primary);
`;

const ItemMeta = styled.div`
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 600;
`;

const QtyControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
  @media (max-width: 600px) { justify-content: center; }
`;

const QtyBtn = styled.button`
  width: 42px;
  height: 42px;
  border: 1px solid var(--border-soft);
  background: var(--white);
  color: var(--primary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  &:hover { background: var(--bg-cream); }
  &:disabled { opacity: 0.3; }
`;

const QtyValue = styled.div`
  min-width: 32px;
  text-align: center;
  font-weight: 900;
  font-size: 1.1rem;
  color: var(--text-charcoal);
`;

const RemoveBtn = styled.button`
  border: none;
  background: none;
  color: #d46a4f;
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  margin-top: 12px;
  padding: 0;
  text-align: left;
  &:hover { text-decoration: underline; }
`;

const SummaryBox = styled.div`
  background: var(--primary);
  border-radius: var(--radius-card);
  padding: 60px 48px;
  color: var(--white);
  box-shadow: var(--shadow-premium);
  align-self: flex-start;
  position: sticky;
  top: 120px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.9;
`;

const TotalRow = styled(SummaryRow)`
  font-size: 1.8rem;
  font-weight: 800;
  opacity: 1;
  padding-top: 24px;
  border-top: 2px solid rgba(255,255,255,0.1);
  margin-top: 24px;
  color: var(--accent);
`;

const Field = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--accent);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.05);
  color: var(--white);
  font-family: inherit;
  font-size: 1rem;
  transition: var(--transition);
  &:focus { outline: none; background: rgba(255,255,255,0.1); border-color: var(--accent); }
  &::placeholder { color: rgba(255,255,255,0.4); }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 16px 20px;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.05);
  color: var(--white);
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  &::placeholder { color: rgba(255,255,255,0.4); }
`;

const CheckoutBtn = styled.button`
  width: 100%;
  padding: 24px;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--accent);
  color: var(--primary);
  font-weight: 900;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 32px;
  &:hover { background: var(--white); transform: translateY(-3px); }
  &:disabled { opacity: 0.5; }
`;

const EmptyState = styled.div`
  background: var(--white);
  border-radius: var(--radius-card);
  padding: 100px 48px;
  text-align: center;
  box-shadow: var(--shadow-premium);
  span { font-size: 4rem; display: block; margin-bottom: 24px; }
  h3 { font-size: 1.8rem; color: var(--primary); margin-bottom: 12px; }
  p { color: var(--text-muted); font-size: 1.1rem; margin-bottom: 32px; }
`;

const EmptyButton = styled(Link)`
  display: inline-flex;
  padding: 20px 40px;
  background: var(--primary);
  color: var(--white);
  border-radius: var(--radius-pill);
  font-weight: 800;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();
  const [pickupDate, setPickupDate] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { if (user?.phone?.length) setPhone(user.phone[0]); }, [user]);

  const handleCheckout = async () => {
    if (!cart.length) return;
    if (!user) return navigate("/login");
    if (!pickupDate) return setMessage("Select a valid pickup date.");
    if (!phone.trim()) return setMessage("Contact phone is required.");

    setLoading(true); setMessage("");
    try {
      await api.post("/orders", {
        items: cart.map((i) => ({ product: i._id, quantity: i.quantity, price: i.price })),
        pickupDate, farmerPhone: phone, notes
      });
      clearCart(); navigate("/my-orders");
    } catch (err) { setMessage(err.response?.data?.message || "Internal server error."); } finally { setLoading(false); }
  };

  if (!cart.length) {
    return (
      <PageWrap>
        <Container>
          <PageTitle>Cart Overview</PageTitle>
          <EmptyState>
            <span>🛒</span>
            <h3>Inventory is empty</h3>
            <p>Your procurement list is currently vacant. Browse our catalog to add items.</p>
            <EmptyButton to="/products">Explore Products</EmptyButton>
          </EmptyState>
        </Container>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <Container>
        <PageTitle>Procurement List</PageTitle>
        <Subtitle>Review your selected assets before final authorization.</Subtitle>

        <Grid>
          <CartPanel>
            {cart.map((item) => (
              <CartItem key={item._id}>
                <ItemImage>
                  {item.image?.[0] ? (
                    <img src={`http://localhost:5000${item.image[0]}`} alt={item.name} />
                  ) : "📦"}
                </ItemImage>
                <ItemInfo>
                  <ItemName>{item.name}</ItemName>
                  <ItemMeta>Rs. {item.price.toLocaleString()} / {item.unit}</ItemMeta>
                  <ItemMeta style={{ color: item.stock < 10 ? '#d46a4f' : 'var(--primary)' }}>
                    {item.stock > 0 ? `${item.stock} in reserve` : "DEPLETED"}
                  </ItemMeta>
                  <RemoveBtn type="button" onClick={() => removeFromCart(item._id)}>REMOVE FROM LIST</RemoveBtn>
                </ItemInfo>
                <QtyControls>
                  <QtyBtn type="button" onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>−</QtyBtn>
                  <QtyValue>{item.quantity}</QtyValue>
                  <QtyBtn type="button" onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={item.quantity >= item.stock}>+</QtyBtn>
                </QtyControls>
              </CartItem>
            ))}
          </CartPanel>

          <SummaryBox>
            <h3 style={{ fontSize: "1.8rem", color: "var(--accent)", marginBottom: "40px" }}>Order Specification</h3>
            <SummaryRow><div>Line Items</div><div>{cart.length} units</div></SummaryRow>
            <SummaryRow><div>Logistics Subtotal</div><div>Rs. {totalAmount.toLocaleString()}</div></SummaryRow>
            <Field>
              <Label>Designated Pickup Date</Label>
              <Input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
            </Field>
            <Field>
              <Label>Operational Contact</Label>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0300-1234567" />
            </Field>
            <Field>
              <Label>Procurement Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Special handling or location details..." />
            </Field>
            <TotalRow><div>Authorized Total</div><div>Rs. {totalAmount.toLocaleString()}</div></TotalRow>
            {message && <p style={{ color: "var(--accent)", fontWeight: 800, marginTop: "24px", fontSize: "0.9rem" }}>⚠ {message}</p>}
            <CheckoutBtn type="button" disabled={loading} onClick={handleCheckout}>
              {loading ? "AUTHORIZING..." : "CONFIRM PROCUREMENT"}
            </CheckoutBtn>
          </SummaryBox>
        </Grid>
      </Container>
    </PageWrap>
  );
};

export default Cart;

