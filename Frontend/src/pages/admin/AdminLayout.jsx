import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

// ===== STYLED COMPONENTS =====
const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--bg-app);
  transition: var(--transition-smooth);
`;

const Sidebar = styled.aside`
  width: 280px;
  background: var(--primary);
  color: var(--text-inverse);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: ${p => p.$open ? '0' : '-280px'};
  height: 100vh;
  z-index: 1000;
  transition: var(--transition-smooth);
  box-shadow: 10px 0 50px rgba(0,0,0,0.2);

  @media (min-width: 900px) {
    left: 0;
  }
`;

const SidebarHeader = styled.div`
  padding: 48px 32px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
`;

const Brand = styled.div`
  font-family: 'Fraunces', serif;
  font-size: 2.2rem;
  color: var(--text-inverse);
  font-weight: 900;
  margin-bottom: 8px;
  span { color: var(--accent); opacity: 0.8; }
`;

const AdminBadge = styled.div`
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Nav = styled.nav`
  flex: 1;
  padding: 32px 16px;
  overflow-y: auto;
  
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 700;
  font-size: 0.92rem;
  border-radius: var(--radius-md);
  transition: var(--transition-smooth);
  margin-bottom: 4px;

  &:hover {
    color: var(--text-inverse);
    background: rgba(255,255,255,0.05);
    transform: translateX(5px);
  }

  &.active {
    color: var(--primary);
    background: var(--accent);
    box-shadow: 0 8px 25px rgba(245, 182, 17, 0.3);
  }
`;

const SidebarFooter = styled.div`
  padding: 32px;
  background: rgba(0,0,0,0.1);
  border-top: 1px solid rgba(255,255,255,0.05);
`;

const AdminInfo = styled.div`
  margin-bottom: 24px;
  color: rgba(255,255,255,0.5);
  font-size: 0.8rem;
  
  strong {
    display: block;
    color: var(--text-inverse);
    font-size: 1.1rem;
    font-weight: 900;
    margin-bottom: 4px;
  }
`;

const LogoutBtn = styled.button`
  width: 100%;
  padding: 16px;
  background: rgba(255,255,255,0.05);
  color: var(--text-inverse);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: var(--transition-smooth);

  &:hover {
    background: #FF5252;
    border-color: #FF5252;
  }
`;

const Main = styled.main`
  flex: 1;
  margin-left: 0;
  min-height: 100vh;
  transition: var(--transition-smooth);

  @media (min-width: 900px) {
    margin-left: 280px;
  }
`;

const TopHeader = styled.header`
  background: var(--glass);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 0 48px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const SearchTrigger = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
  font-weight: 600;
  background: var(--bg-surface-alt);
  padding: 12px 24px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border);
  cursor: pointer;
  width: 320px;
  font-size: 0.9rem;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  .user-circle {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--primary);
    color: var(--text-inverse);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    border: 3px solid var(--bg-surface-alt);
    box-shadow: var(--shadow-subtle);
    overflow: hidden;
    img { width: 100%; height: 100%; object-fit: cover; }
  }
`;

const MenuBtn = styled.button`
  display: none;
  background: var(--bg-surface-alt);
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  
  @media (max-width: 900px) { display: block; }
`;

// ===== COMPONENT =====
const navLinks = [
  { to: '/admin/dashboard', icon: '📊', label: 'Command Hub' },
  { to: '/admin/pos', icon: '🏪', label: 'Direct POS' },
  { to: '/admin/products', icon: '📦', label: 'Inventory Logic' },
  { to: '/admin/orders', icon: '📜', label: 'Procurement Logs' },
  { to: '/admin/farmers', icon: '👥', label: 'Stakeholders' },
  { to: '/admin/credit', icon: '📉', label: 'Credit Registry' },
  { to: '/admin/accounts', icon: '🏛️', label: 'Treasury' },
  { to: '/admin/expenses', icon: '💸', label: 'Internal Burn' },
  { to: '/admin/finances', icon: '🏦', label: 'Global Ledger' },
  { to: '/admin/staff', icon: '🛡️', label: 'Executive Team' },
  { to: '/admin/reviews', icon: '💬', label: 'Feedback Loop' },
  { to: '/admin/settings', icon: '⚙️', label: 'Nexus Config' },
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
      <div 
        style={{ 
          display: sidebarOpen ? 'block' : 'none',
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', 
          zIndex: 999, backdropFilter: 'blur(10px)' 
        }} 
        onClick={() => setSidebarOpen(false)} 
      />

      <Sidebar $open={sidebarOpen}>
        <SidebarHeader>
          <Brand>🌾 Kisan<span>Nexus</span></Brand>
          <AdminBadge>Institutional Control</AdminBadge>
        </SidebarHeader>

        <Nav>
          {navLinks.map(link => (
            <NavItem key={link.to} to={link.to} onClick={() => setSidebarOpen(false)}>
              <span style={{ fontSize:'1.4rem' }}>{link.icon}</span>
              {link.label}
            </NavItem>
          ))}
        </Nav>

        <SidebarFooter>
          <AdminInfo>
            <strong>Agent {user?.first_name}</strong>
            {user?.email}
          </AdminInfo>
          <LogoutBtn onClick={handleLogout}>Terminate Session</LogoutBtn>
        </SidebarFooter>
      </Sidebar>

      <Main>
        <TopHeader>
          <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
            <MenuBtn onClick={() => setSidebarOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/></svg>
            </MenuBtn>
            <SearchTrigger>
              🔍 Search institutional data...
            </SearchTrigger>
          </div>
          
          <HeaderActions>
            <ThemeToggle />
            <div style={{textAlign:'right'}}>
              <div style={{fontWeight:900, fontSize:'1rem', color:'var(--text-primary)'}}>{user?.first_name} {user?.last_name?.[0]}.</div>
              <div style={{fontSize:'0.7rem', fontWeight:800, color:'#4CAF50', textTransform:'uppercase', letterSpacing:'0.1em'}}>Level: Administrator</div>
            </div>
            <div className="user-circle">
              {user?.avatarUrl ? (
                <img src={`http://localhost:5000${user.avatarUrl}`} alt="pfp" />
              ) : '👨‍💼'}
            </div>
          </HeaderActions>
        </TopHeader>

        <div style={{ padding: '0' }}>
          <Outlet />
        </div>
      </Main>
    </Layout>
  );
};

export default AdminLayout;