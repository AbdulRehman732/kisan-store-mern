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
  padding: 60px 24px;
`;

const Card = styled.div`
  background: var(--white);
  border-radius: var(--radius-card);
  padding: 60px 48px;
  width: 100%;
  max-width: 500px;
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
  margin-bottom: 40px;
  font-weight: 500;
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
  margin-top: 20px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);

  &:hover {
    background: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(43, 57, 34, 0.2);
  }
  &:disabled { opacity: 0.5; transform: none; }
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
const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrap>
      <Card>
        <div style={{ textAlign:'center', fontSize:'3.5rem', marginBottom:'20px' }}>🌾</div>
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to your farmer portal</Subtitle>

        {error && <div style={{ background:'#fdf2f0', color:'#d46a4f', padding:'15px', borderRadius:'12px', marginBottom:'24px', fontWeight:600 }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Email Address</label>
            <InputWrapper>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="farmer@kisan.com"
                required
              />
            </InputWrapper>
          </FormGroup>
          <FormGroup>
            <label>Password</label>
            <InputWrapper>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position:'absolute', right:'20px', cursor:'pointer' }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </InputWrapper>
          </FormGroup>
          <div style={{ textAlign: "right", marginTop: "-12px", marginBottom: "20px" }}>
            <Link
              to="/forgot-password"
              style={{
                fontSize: "0.85rem",
                color: "var(--primary)",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Forgot Password?
            </Link>
          </div>
          <SubmitBtn type="submit" disabled={loading}>
            {loading ? "Verifying..." : "SECURE LOGIN"}
          </SubmitBtn>
        </form>

        <Footer>
          New to KisanStore? <Link to="/register">Create Account</Link>
        </Footer>
      </Card>
    </PageWrap>
  );
};

export default Login;

