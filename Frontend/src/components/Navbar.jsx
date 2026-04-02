import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ThemeToggle from "./ThemeToggle";

// ===== STYLED COMPONENTS =====
const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 2000;
  padding: 12px 24px;
  background: transparent;
  pointer-events: none;
`;

const NavContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  background: var(--glass-heavy);
  backdrop-filter: blur(40px);
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--border);
  pointer-events: auto;
  transition: var(--transition-smooth);
  
  &:hover { border-color: var(--accent); box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
`;

const Brand = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  font-family: 'Fraunces', serif;
  font-size: 2rem;
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  transition: var(--transition-smooth);

  span { font-weight: 400; opacity: 0.6; }
  .logo-icon { font-size: 2.2rem; filter: drop-shadow(0 4px 10px rgba(76, 175, 80, 0.3)); }
  
  &:hover { transform: scale(1.02); }
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
  @media (max-width: 1100px) { display: none; }
`;

const NavItem = styled(NavLink)`
  position: relative;
  padding: 10px 20px;
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  text-decoration: none;
  border-radius: var(--radius-pill);
  transition: var(--transition-smooth);

  &:hover, &.active {
    color: var(--primary);
    background: var(--bg-surface-alt);
  }
  
  &.active::after {
    content:'';
    position: absolute;
    bottom: 8px; left: 50%;
    width: 4px; height: 4px;
    background: var(--accent);
    border-radius: 50%;
    transform: translateX(-50%);
  }
`;

const ActionChain = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const IconButton = styled(NavLink)`
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg-surface-alt);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-size: 1.2rem;
  transition: var(--transition-smooth);
  
  &:hover { background: var(--primary); color: white; transform: translateY(-3px); }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -6px; right: -6px;
  background: var(--accent);
  color: var(--primary);
  width: 20px; height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 900;
  border: 2px solid var(--bg-surface);
`;

const ProfileTrigger = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 16px 6px 8px;
  background: var(--bg-surface-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  text-decoration: none;
  transition: var(--transition-smooth);

  .avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent); }
  .name { font-size: 0.8rem; font-weight: 900; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em; }
  
  &:hover { border-color: var(--accent); background: var(--bg-surface); transform: translateY(-2px); }
  @media (max-width: 600px) { .name { display: none; } padding: 6px; }
`;

const AuthBtn = styled(NavLink)`
  padding: 14px 28px;
  background: var(--primary);
  color: white;
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  box-shadow: 0 10px 25px rgba(76, 175, 80, 0.2);
  transition: var(--transition-smooth);
  
  &:hover { background: var(--accent); transform: translateY(-3px); box-shadow: var(--shadow-premium); }
`;

const LogoutOutlinedButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: transparent;
  color: #FF5252;
  border: 1px solid rgba(255, 82, 82, 0.3);
  font-size: 1.2rem;
  cursor: pointer;
  transition: var(--transition-smooth);
  
  &:hover {
    background: #FF5252;
    color: white;
    transform: translateY(-3px);
  }
`;

const Hamburger = styled.button`
  display: none;
  width: 48px; height: 48px;
  border-radius: 50%;
  background: var(--bg-surface-alt);
  border: 1px solid var(--border);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  @media (max-width: 1100px) { display: flex; }
`;

const DrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(13, 15, 12, 0.8);
  backdrop-filter: blur(20px);
  z-index: 3000;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: 0.5s ease;
`;

const DrawerMenu = styled.div`
  position: fixed;
  top: 12px; right: ${p => p.$open ? '12px' : '-450px'};
  width: 420px;
  height: calc(100vh - 24px);
  background: var(--bg-surface);
  border-radius: 32px;
  z-index: 3100;
  padding: 40px;
  box-shadow: -20px 0 60px rgba(0,0,0,0.3);
  transition: 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  
  @media (max-width: 500px) { width: calc(100vw - 24px); }
`;

const DrawerLink = styled(NavLink)`
  padding: 20px 30px;
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: 20px;
  margin-bottom: 8px;
  transition: var(--transition-smooth);
  
  &.active, &:hover { background: var(--bg-surface-alt); color: var(--primary); transform: translateX(10px); }
`;

// ===== COMPONENT =====
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setDrawerOpen(false); }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <Nav>
        <NavContainer style={{ height: isScrolled ? '70px' : '80px', marginTop: isScrolled ? '0' : '8px' }}>
          <Brand to="/">
            <span className="logo-icon">🌾</span>
            Agrotek<span>Elite</span>
          </Brand>

          <NavList>
            {['Home', 'Products', 'Soil Intel', 'Price List', 'Contact'].map(link => (
              <li key={link}>
                <NavItem to={link === 'Home' ? '/' : link === 'Soil Intel' ? '/soil-registry' : `/${link.toLowerCase().replace(' ', '-')}`}>
                  {link}
                </NavItem>
              </li>
            ))}
            {user?.role === 'admin' && <li><NavItem to="/admin/dashboard" style={{color:'var(--accent)'}}>Command Center</NavItem></li>}
          </NavList>

          <ActionChain>
            <ThemeToggle />
            
            <IconButton to="/cart">
              🛒 {itemCount > 0 && <CartBadge>{itemCount}</CartBadge>}
            </IconButton>

            {user ? (
              <>
                <ProfileTrigger to="/profile">
                  <img className="avatar" src={user.avatarUrl ? `http://localhost:5000${user.avatarUrl}` : "https://ui-avatars.com/api/?name=User&background=2B3922&color=F5B611"} alt="profile" />
                  <span className="name">{user.first_name}</span>
                </ProfileTrigger>
                <LogoutOutlinedButton onClick={handleLogout} title="Terminate Session">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </LogoutOutlinedButton>
              </>
            ) : (
              <AuthBtn to="/login">Join Platform</AuthBtn>
            )}

            <Hamburger onClick={() => setDrawerOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2.5"><path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/></svg>
            </Hamburger>
          </ActionChain>
        </NavContainer>
      </Nav>

      <DrawerOverlay $open={drawerOpen} onClick={() => setDrawerOpen(false)} />
      <DrawerMenu $open={drawerOpen}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'48px'}}>
          <h3 style={{fontFamily:'Fraunces', fontSize:'2rem'}}>🌾 Menu</h3>
          <button onClick={() => setDrawerOpen(false)} style={{width:'48px', height:'48px', borderRadius:'50%', background:'var(--bg-surface-alt)', border:'none', fontSize:'1.2rem', cursor:'pointer'}}>✕</button>
        </div>
        
        <div style={{display:'flex', flexDirection:'column', flex:1}}>
          <DrawerLink to="/">Home Intelligence</DrawerLink>
          <DrawerLink to="/products">Asset Catalog</DrawerLink>
          <DrawerLink to="/soil-registry">Soil Analysis</DrawerLink>
          <DrawerLink to="/price-list">Market Dynamics</DrawerLink>
          <DrawerLink to="/cart">Procurement Dossier</DrawerLink>
          {user && <DrawerLink to="/profile">Member Identity</DrawerLink>}
          {user?.role === 'admin' && <DrawerLink to="/admin/dashboard" style={{color:'var(--accent)'}}>Admin Command</DrawerLink>}
        </div>

        <div style={{marginTop:'auto', borderTop:'1px solid var(--border)', paddingTop:'32px'}}>
          {user ? (
            <button onClick={handleLogout} style={{width:'100%', padding:'18px', background:'var(--bg-surface-alt)', color:'#FF5252', borderRadius:'var(--radius-pill)', border:'none', fontWeight:900, fontSize:'1rem', textTransform:'uppercase', cursor:'pointer'}}>Terminate Session</button>
          ) : (
            <AuthBtn to="/login" style={{display:'block', textAlign:'center'}}>Sign In</AuthBtn>
          )}
        </div>
      </DrawerMenu>
    </>
  );
};

export default Navbar;
