import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";

// ===== STYLED COMPONENTS =====
const PageWrap = styled.div`
  min-height: calc(100vh - 120px);
  background: var(--bg-cream);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
`;

const Card = styled.div`
  background: var(--white);
  border-radius: var(--radius-card);
  padding: 60px 48px;
  width: 100%;
  max-width: 600px;
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--border-soft);
`;

const Title = styled.h1`
  font-size: 3rem;
  color: var(--primary);
  text-align: center;
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  color: var(--text-muted);
  font-size: 1rem;
  text-align: center;
  margin-bottom: 48px;
  font-weight: 500;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;

  label {
    display: block;
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--primary);
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    width: 100%;
    padding: 16px 20px;
    border: 1px solid var(--border-soft);
    border-radius: var(--radius-sm);
    font-family: inherit;
    font-size: 1rem;
    color: var(--text-charcoal);
    background: var(--bg-cream);
    opacity: 0.8;
    transition: var(--transition);

    &:focus {
      outline: none;
      border-color: var(--primary);
      background: var(--white);
      opacity: 1;
      box-shadow: 0 0 0 4px rgba(43, 57, 34, 0.05);
    }
  }
`;

const PhoneRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  input {
    flex: 1;
    padding: 16px 20px;
    border: 1px solid var(--border-soft);
    border-radius: var(--radius-sm);
    background: var(--bg-cream);
    font-family: inherit;
    font-size: 1rem;
    &:focus {
      outline: none;
      border-color: var(--primary);
      background: var(--white);
    }
  }
`;

const IconBtn = styled.button`
  width: 52px;
  height: 52px;
  border-radius: var(--radius-sm);
  background: ${(p) => (p.remove ? "#fdf2f0" : "var(--bg-cream)")};
  color: ${(p) => (p.remove ? "#d46a4f" : "var(--primary)")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: var(--transition);
  &:hover { transform: scale(1.05); }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 18px;
  background: var(--text-charcoal);
  color: var(--white);
  border-radius: var(--radius-pill);
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 32px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);

  &:hover {
    background: var(--primary);
    transform: translateY(-2px);
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Footer = styled.p`
  text-align: center;
  margin-top: 32px;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-muted);

  a {
    color: var(--primary);
    font-weight: 800;
    margin-left: 5px;
    border-bottom: 2px solid var(--accent);
  }
`;

// ===== COMPONENT =====
const Register = () => {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", confirmPassword: "" });
  const [phones, setPhones] = useState([""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhoneChange = (i, val) => {
    const updated = [...phones];
    updated[i] = val;
    setPhones(updated);
  };

  const addPhone = () => { if (phones.length < 3) setPhones([...phones, ""]); };
  const removePhone = (i) => { if (phones.length > 1) setPhones(phones.filter((_, idx) => idx !== i)); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { ...form, phone: phones.filter((p) => p.trim()) });
      login(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrap>
      <Card>
        <div style={{ textAlign:'center', fontSize:'3.5rem', marginBottom:'20px' }}>🚜</div>
        <Title>Join KisanStore</Title>
        <Subtitle>Start your journey to better yields today</Subtitle>

        {error && <div style={{ background:'#fdf2f0', color:'#d46a4f', padding:'15px', borderRadius:'12px', marginBottom:'24px', fontWeight:600 }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <label>First Name</label>
              <InputWrapper><input name="first_name" value={form.first_name} onChange={handleChange} placeholder="Ali" required /></InputWrapper>
            </FormGroup>
            <FormGroup>
              <label>Last Name</label>
              <InputWrapper><input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Ahmed" required /></InputWrapper>
            </FormGroup>
          </FormRow>

          <FormGroup>
            <label>Email Address</label>
            <InputWrapper><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="farmer@example.com" required /></InputWrapper>
          </FormGroup>

          <FormGroup>
            <label>Phone Numbers <small style={{ fontWeight:400, opacity:0.6 }}>(up to 3)</small></label>
            {phones.map((p, i) => (
              <PhoneRow key={i}>
                <input type="tel" value={p} onChange={(e) => handlePhoneChange(i, e.target.value)} placeholder="0300-1234567" required={i===0} />
                {phones.length > 1 && <IconBtn type="button" remove onClick={() => removePhone(i)}>✕</IconBtn>}
              </PhoneRow>
            ))}
            {phones.length < 3 && (
              <button 
                type="button" 
                onClick={addPhone}
                style={{ width:'100%', padding:'12px', border:'2px dashed var(--border-soft)', borderRadius:'12px', fontWeight:700, color:'var(--primary)' }}
              >
                + ADD ANOTHER NUMBER
              </button>
            )}
          </FormGroup>

          <FormRow>
            <FormGroup>
              <label>Password</label>
              <InputWrapper>
                <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
              </InputWrapper>
            </FormGroup>
            <FormGroup>
              <label>Confirm</label>
              <InputWrapper>
                <input type={showPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
              </InputWrapper>
            </FormGroup>
          </FormRow>

          <SubmitBtn type="submit" disabled={loading}>{loading ? "Joining..." : "CREATE ACCOUNT"}</SubmitBtn>
        </form>

        <Footer>Already a member? <Link to="/login">Sign In</Link></Footer>
      </Card>
    </PageWrap>
  );
};

export default Register;

