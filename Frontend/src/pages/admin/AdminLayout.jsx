import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

// ===== STYLED COMPONENTS =====
const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--bg-cream);
`;

const Sidebar = styled.aside`
  width: 280px;
  background: var(--primary);
  color: var(--bg-cream);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: ${p => p.$open ? '0' : '-280px'};
  height: 100vh;
  z-index: 1000;
  transition: var(--transition);
  box-shadow: 10px 0 30px rgba(0,0,0,0.1);

  @media (min-width: 900px) {
    left: 0;
  }
`;

const SidebarHeader = styled.div`
  padding: 40px 30px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
`;

const Brand = styled.div`
  font-size: 1.8rem;
  color: var(--white);
  margin-bottom: 8px;
  span { color: var(--accent); font-style: italic; }
`;

const AdminBadge = styled.div`
  display: inline-block;
  background: rgba(245, 182, 17, 0.1);
  border: 1px solid rgba(245, 182, 17, 0.2);
  color: var(--accent);
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const Nav = styled.nav`
  flex: 1;
  padding: 30px 15px;
  overflow-y: auto;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 16px 20px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: var(--transition);
  margin-bottom: 5px;

  &:hover {
    color: var(--white);
    background: rgba(255,255,255,0.05);
  }

  &.active {
    color: var(--primary);
    background: var(--accent);
    box-shadow: 0 4px 15px rgba(245, 182, 17, 0.2);
  }
`;

const SidebarFooter = styled.div`
  padding: 30px;
  border-top: 1px solid rgba(255,255,255,0.05);
  background: rgba(0,0,0,0.15);
`;

const AdminInfo = styled.div`
  margin-bottom: 20px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);

  strong {
    display: block;
    color: var(--white);
    font-size: 1rem;
    margin-bottom: 4px;
    font-weight: 800;
  }
`;

const LogoutBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: transparent;
  color: var(--white);
  border: 1.5px solid rgba(255,255,255,0.2);
  border-radius: var(--radius-pill);
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover { 
    background: var(--white);
    color: var(--primary);
  }
`;

const Main = styled.main`
  flex: 1;
  margin-left: 0;
  min-height: 100vh;
  transition: var(--transition);

  @media (min-width: 900px) {
    margin-left: 280px;
  }
`;

const Topbar = styled.div`
  background: var(--white);
  border-bottom: 1px solid var(--border-soft);
  padding: 0 40px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const TopbarTitle = styled.h1`
  font-size: 1.6rem;
  color: var(--primary);
`;

const TopbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  .avatar {
    width: 44px;
    height: 44px;
    background: var(--bg-cream);
    color: var(--primary);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    border: 1px solid var(--border-soft);
  }
`;

const Overlay = styled.div`
  display: ${p => p.$open ? 'block' : 'none'};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  z-index: 999;
  @media (min-width: 900px) { display: none; }
`;

const PageWrap = styled.div`
  padding: 50px 40px;
`;

// ===== COMPONENT =====
const navLinks = [
  { to: '/admin/dashboard', icon: '📊', label: 'Monitor Dashboard' },
  { to: '/admin/products', icon: '🌱', label: 'Inventory Manager' },
  { to: '/admin/orders', icon: '📦', label: 'Order Fulfillment' },
  { to: '/admin/farmers', icon: '👨‍🌾', label: 'Farmer Network' },
  { to: '/admin/staff', icon: '🛡️', label: 'Staff Management' },
  { to: '/admin/reviews', icon: '💬', label: 'Review Moderation' },
  { to: '/admin/reports', icon: '📈', label: 'Sales Reports' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout>
      <Overlay $open={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      <Sidebar $open={sidebarOpen}>
        <SidebarHeader>
          <Brand>🌾 Kisan<span>Store</span></Brand>
          <AdminBadge>Nexus Control Panel</AdminBadge>
        </SidebarHeader>

        <Nav>
          {navLinks.map(link => (
            <NavItem key={link.to} to={link.to} onClick={() => setSidebarOpen(false)}>
              <span style={{ fontSize:'1.2rem' }}>{link.icon}</span>
              {link.label}
            </NavItem>
          ))}
        </Nav>

        <SidebarFooter>
          <AdminInfo>
            <strong>{user?.first_name} {user?.last_name}</strong>
            {user?.email}
          </AdminInfo>
          <LogoutBtn onClick={handleLogout}>System Logout</LogoutBtn>
        </SidebarFooter>
      </Sidebar>

      <Main>
        <Topbar>
          <button onClick={() => setSidebarOpen(true)} style={{ background:'none', border:'none', cursor:'pointer' }}>
            <div style={{ width:'24px', height:'2px', background:'var(--primary)', marginBottom:'6px' }} />
            <div style={{ width:'24px', height:'2px', background:'var(--primary)', marginBottom:'6px' }} />
            <div style={{ width:'24px', height:'2px', background:'var(--primary)' }} />
          </button>
          <TopbarTitle>Command Center</TopbarTitle>
          <TopbarRight>
            <div style={{ textAlign:'right', display:'none', sm:'block' }}>
              <div style={{ fontWeight:800, color:'var(--primary)' }}>Agent {user?.first_name}</div>
              <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Status: Active</div>
            </div>
            <div className="avatar">👤</div>
          </TopbarRight>
        </Topbar>
        <PageWrap>
          <Outlet />
        </PageWrap>
      </Main>
    </Layout>
  );
};

export default AdminLayout;
