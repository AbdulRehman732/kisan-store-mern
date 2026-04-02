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
    bottom: -200px; left: -200px;
    opacity: 0.4;
    pointer-events: none;
  }
`;

const RegisterCard = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: 60px;
  width: 100%;
  max-width: 650px;
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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  @media (max-width: 650px) { grid-template-columns: 1fr; }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
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

const PhoneRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  input { flex: 1; }
`;

const TagBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: var(--bg-surface-alt);
  color: var(--primary);
  border: 2px dashed var(--border);
  border-radius: 12px;
  font-weight: 900;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: var(--transition-smooth);
  &:hover { background: var(--bg-surface); border-color: var(--primary); color: var(--primary); }
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
  margin-top: 32px;
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
const Register = () => {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", confirmPassword: "" });
  const [phones, setPhones] = useState([""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhoneChange = (i, val) => { const updated = [...phones]; updated[i] = val; setPhones(updated); };
  const addPhone = () => { if (phones.length < 3) setPhones([...phones, ""]); };
  const removePhone = (i) => { if (phones.length > 1) setPhones(phones.filter((_, idx) => idx !== i)); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) return setError("Protocol Mismatch: Passphrase confirmation failed.");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { ...form, phone: phones.filter((p) => p.trim()) });
      login(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "Registration Protocol Failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <RegisterCard>
        <BrandHeader>
          <span className="icon">🚜</span>
          <h1>Stakeholder Registration</h1>
          <p>Initialize your Agrotek Institutional Account</p>
        </BrandHeader>

        {error && <ErrorAlert>⚠️ {error}</ErrorAlert>}

        <form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup><label>First Identity</label><input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" required /></FormGroup>
            <FormGroup><label>Last Identity</label><input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" required /></FormGroup>
          </FormRow>

          <FormGroup><label>Strategic Communication (Email)</label><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="stakeholder@agrotek.com" required /></FormGroup>

          <FormGroup>
            <label>Certified Contacts <small style={{opacity:0.6}}>(UP TO 3)</small></label>
            {phones.map((p, i) => (
              <PhoneRow key={i}>
                <input type="tel" value={p} onChange={(e) => handlePhoneChange(i, e.target.value)} placeholder="0300-0000000" required={i===0} />
                {phones.length > 1 && <button type="button" onClick={() => removePhone(i)} style={{background:'rgba(212, 106, 79, 0.1)', color:'#FF5252', border:'1px solid #FF5252', borderRadius:'12px', width:'52px', cursor:'pointer', fontWeight:900}}>✕</button>}
              </PhoneRow>
            ))}
            {phones.length < 3 && <TagBtn type="button" onClick={addPhone}>+ AUTHORIZE SECONDARY CONTACT</TagBtn>}
          </FormGroup>

          <FormRow>
            <FormGroup><label>Create Passphrase</label><input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required /></FormGroup>
            <FormGroup><label>Authorize Passphrase</label><input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" required /></FormGroup>
          </FormRow>

          <ActionBtn type="submit" disabled={loading}>{loading ? "Synchronizing..." : "INITIALIZE ACCOUNT"}</ActionBtn>
        </form>

        <FooterLink>Already a Member? <Link to="/login">Sign In</Link></FooterLink>
      </RegisterCard>
    </PageContainer>
  );
};

export default Register;
