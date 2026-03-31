import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// ===== STYLED COMPONENTS =====
const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 15px 0;
  background: rgba(250, 249, 246, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-soft);
`;

const NavContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  background: var(--white);
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 40px;
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  border: 1px solid var(--border-soft);
  transition: var(--transition);

  &:hover {
    box-shadow: var(--shadow-premium);
  }

  @media (max-width: 1200px) {
    margin: 0 20px;
  }
`;

const Brand = styled(NavLink)`
  background: var(--gradient-gold);
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 50px;
  color: var(--primary);
  font-family: 'Fraunces', serif;
  font-size: 2.2rem;
  font-weight: 900;
  text-decoration: none;
  transition: var(--transition);
  letter-spacing: -0.02em;

  &:hover {
    opacity: 0.9;
  }

  span {
    font-weight: 400;
    margin-left: 2px;
    opacity: 0.8;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavItem = styled(NavLink)`
  color: var(--text-charcoal);
  padding: 12px 24px;
  font-size: 0.9rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: var(--radius-pill);

  &:hover, &.active {
    color: var(--primary);
    background: var(--bg-cream);
  }
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavButton = styled(NavLink)`
  background: var(--primary);
  color: var(--white) !important;
  padding: 16px 36px;
  border-radius: var(--radius-pill);
  font-size: 0.95rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  box-shadow: 0 10px 30px rgba(26, 42, 18, 0.2);

  &:hover {
    background: var(--accent);
    color: var(--primary) !important;
    transform: translateY(-3px);
  }
`;

const CustomLogoutBtn = styled.button`
  background: rgba(0,0,0,0.05);
  color: var(--text-charcoal);
  padding: 14px 28px;
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  &:hover {
    background: var(--text-charcoal);
    color: var(--white);
  }
`;

const CartLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-charcoal);
  font-weight: 900;
  font-size: 1.2rem;
  position: relative;
  transition: var(--transition);

  &:hover { transform: scale(1.1); color: var(--primary); }
`;

const Badge = styled.span`
  background: var(--accent);
  color: var(--primary);
  width: 22px;
  height: 22px;
  position: absolute;
  top: -10px;
  right: -12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 900;
  border: 2px solid var(--white);
`;

const Hamburger = styled.button`
  display: none;
  background: var(--bg-cream);
  padding: 14px;
  border-radius: 50%;

  @media (max-width: 1024px) {
    display: block;
  }
`;

const DrawerOverlay = styled.div`
  display: ${(p) => (p.open ? "block" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(26, 42, 18, 0.9);
  backdrop-filter: blur(10px);
  z-index: 1100;
`;

const Drawer = styled.div`
  position: fixed;
  top: 0;
  right: ${(p) => (p.open ? "0" : "-400px")};
  width: 400px;
  height: 100vh;
  background: var(--white);
  z-index: 1200;
  transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: -30px 0 80px rgba(0, 0, 0, 0.3);
  padding: 50px 30px;
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60px;
`;

const DrawerBrand = styled.div`
  font-family: "Fraunces", serif;
  font-size: 2.2rem;
  font-weight: 900;
  color: var(--primary);
  span { font-weight: 400; opacity: 0.6; }
`;

const DrawerNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DrawerLink = styled(NavLink)`
  padding: 20px 30px;
  color: var(--text-charcoal);
  font-weight: 900;
  font-size: 1.3rem;
  border-radius: var(--radius-sm);
  transition: var(--transition);

  &.active, &:hover {
    background: var(--primary);
    color: var(--white);
    transform: translateX(10px);
  }
`;

// ===== COMPONENT =====
const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setDrawerOpen(false);
  };

  return (
    <>
      <Nav>
        <NavContainer>
          <Brand to="/">
            🌾 Kisan<span>Store</span>
          </Brand>

          <NavLinks>
            <li><NavItem to="/">Home</NavItem></li>
            <li><NavItem to="/products">Store</NavItem></li>
            <li><NavItem to="/soil-registry">Soil Intel</NavItem></li>
            <li><NavItem to="/crop-doctor">Crop Doc</NavItem></li>
            <li><NavItem to="/price-list">Market</NavItem></li>
            <li><NavItem to="/contact">Support</NavItem></li>
          </NavLinks>

          <ActionGroup>
            <CartLink to="/cart">
              🛒 {itemCount > 0 && <Badge>{itemCount}</Badge>}
            </CartLink>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              {user ? (
                <>
                  <NavItem to="/profile" style={{ padding:'0' }}>
                    {user.avatarUrl ? (
                      <img 
                        src={`http://localhost:5000${user.avatarUrl}`} 
                        alt="pfp" 
                        style={{ width:'50px', height:'50px', borderRadius:'50%', objectFit:'cover', border:'3px solid var(--accent)' }} 
                      />
                    ) : (
                      <div style={{ width:'50px', height:'50px', borderRadius:'50%', background:'var(--bg-cream)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem' }}>👨‍🌾</div>
                    )}
                  </NavItem>
                  <CustomLogoutBtn onClick={handleLogout}>Exit</CustomLogoutBtn>
                </>
              ) : (
                <NavButton to="/login">Join Platform</NavButton>
              )}
            </div>

            <Hamburger onClick={() => setDrawerOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3"><path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/></svg>
            </Hamburger>
          </ActionGroup>
        </NavContainer>
      </Nav>

      <DrawerOverlay open={drawerOpen} onClick={() => setDrawerOpen(false)} />
      <Drawer open={drawerOpen}>
        <DrawerHeader>
          <DrawerBrand>🌾 Kisan<span>Store</span></DrawerBrand>
          <button onClick={() => setDrawerOpen(false)} style={{ fontSize:'2rem', color:'var(--primary)' }}>✕</button>
        </DrawerHeader>
        <DrawerNav>
          <DrawerLink to="/" onClick={() => setDrawerOpen(false)}>Home</DrawerLink>
          <DrawerLink to="/products" onClick={() => setDrawerOpen(false)}>Store Catalog</DrawerLink>
          <DrawerLink to="/soil-registry" onClick={() => setDrawerOpen(false)}>Soil Intelligence</DrawerLink>
          <DrawerLink to="/crop-doctor" onClick={() => setDrawerOpen(false)}>Crop Doctor</DrawerLink>
          <DrawerLink to="/cart" onClick={() => setDrawerOpen(false)}>Shopping Cart</DrawerLink>
          {user && <DrawerLink to="/profile" onClick={() => setDrawerOpen(false)}>Member Profile</DrawerLink>}
          {user?.role === "admin" && <DrawerLink to="/admin/dashboard" onClick={() => setDrawerOpen(false)}>Admin Command</DrawerLink>}
          <div style={{ margin: '40px 0', borderTop: '2px solid var(--border-soft)' }} />
          {user ? (
            <DrawerLink as="button" onClick={handleLogout} style={{ color: '#d46a4f' }}>🚪 Logout Platform</DrawerLink>
          ) : (
            <DrawerLink to="/login" onClick={() => setDrawerOpen(false)}>Log In</DrawerLink>
          )}
        </DrawerNav>
      </Drawer>
    </>
  );
};

export default Navbar;
