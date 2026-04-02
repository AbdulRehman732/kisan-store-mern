import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";

// ===== STYLED COMPONENTS =====
const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-app);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  animation: entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
    top: -200px; right: -200px;
    opacity: 0.4;
    pointer-events: none;
  }
`;

const LoginCard = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: 60px;
  width: 100%;
  max-width: 520px;
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--border);
  position: relative;
  z-index: 10;
  
  &:hover { border-color: var(--accent); transform: translateY(-5px); transition: var(--transition-smooth); }
`;

const BrandHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;
  .icon { font-size: 4.5rem; margin-bottom: 16px; display: block; }
  h1 { font-size: 3.2rem; color: var(--text-primary); margin-bottom: 8px; letter-spacing: -0.02em; }
  p { font-size: 1rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7; }
`;

const FormGroup = styled.div`
  margin-bottom: 28px;
  label { display: block; font-size: 0.75rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.1em; }
  input {
    width: 100%;
    padding: 18px 24px;
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

const PasswordBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  input { padding-right: 60px; }
  .toggle { position: absolute; right: 20px; cursor: pointer; opacity: 0.5; transition: 0.3s; &:hover { opacity: 1; } }
`;

const ActionBtn = styled.button`
  width: 100%;
  padding: 22px;
  background: var(--primary);
  color: var(--text-inverse);
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 1rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-top: 24px;
  box-shadow: 0 15px 40px rgba(76, 175, 80, 0.2);
  transition: var(--transition-smooth);
  
  &:hover:not(:disabled) { background: var(--accent); color: var(--text-inverse); transform: translateY(-3px); box-shadow: var(--shadow-premium); }
  &:disabled { opacity: 0.4; pointer-events: none; }
`;

const ErrorAlert = styled.div`
  background: rgba(212, 106, 79, 0.1);
  color: #FF5252;
  padding: 18px;
  border-radius: 12px;
  margin-bottom: 24px;
  font-weight: 900;
  font-size: 0.85rem;
  border: 1px solid currentColor;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FooterLink = styled.div`
  text-align: center;
  margin-top: 40px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-secondary);
  a { color: var(--primary); text-decoration: none; border-bottom: 2px solid var(--accent); margin-left: 6px; &:hover { color: var(--accent); } }
`;

// ===== COMPONENT =====
const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user);
      if (res.data.user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "Protocol Failure: Authentication Refused.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <LoginCard>
        <BrandHeader>
          <span className="icon">🌾</span>
          <h1>Agrotek Elite</h1>
          <p>Institutional Stakeholder Portal</p>
        </BrandHeader>

        {error && <ErrorAlert>⚠️ {error}</ErrorAlert>}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Communication Endpoint (Email)</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="stakeholder@agrotek.com" required />
          </FormGroup>

          <FormGroup>
            <label>Security Credential (Passphrase)</label>
            <PasswordBox>
              <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
              <span className="toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"}</span>
            </PasswordBox>
            <div style={{ textAlign: "right", marginTop: "12px" }}>
              <Link to="/forgot-password" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "900", textDecoration: "none" }}>Forgot Protocol?</Link>
            </div>
          </FormGroup>

          <ActionBtn type="submit" disabled={loading}>
            {loading ? "Authorizing..." : "Initialize Session"}
          </ActionBtn>
        </form>

        <FooterLink>
          New Stakeholder? <Link to="/register">Request Enlistment</Link>
        </FooterLink>
      </LoginCard>
    </PageContainer>
  );
};

export default Login;
