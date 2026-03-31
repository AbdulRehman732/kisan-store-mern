import React, { useState } from "react";
import styled from "styled-components";
import api from "../../api";
import { useParams, useNavigate, Link } from "react-router-dom";

const PageWrap = styled.div`
  min-height: calc(100vh - 120px);
  background: var(--bg-cream);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
`;

const Card = styled.div`
  background: var(--white);
  padding: 60px;
  border-radius: var(--radius-card);
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-premium);
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: var(--primary);
  margin-bottom: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  text-align: left;
  label {
    display: block;
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--primary);
    margin-bottom: 8px;
    text-transform: uppercase;
  }
  input {
    width: 100%;
    padding: 16px 20px;
    border: 1px solid var(--border-soft);
    border-radius: var(--radius-sm);
    font-size: 1rem;
    background: var(--bg-cream);
    &:focus { outline: none; border-color: var(--primary); background: var(--white); }
  }
`;

const Btn = styled.button`
  width: 100%;
  padding: 18px;
  background: var(--text-charcoal);
  color: var(--white);
  border: none;
  border-radius: var(--radius-pill);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 10px;
  cursor: pointer;
  transition: var(--transition);
  &:hover { background: var(--primary); transform: translateY(-2px); }
  &:disabled { opacity: 0.5; }
`;

const Alert = styled.div`
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  font-weight: 700;
  font-size: 0.9rem;
  background: ${p => p.success ? 'var(--bg-cream)' : '#fdf2f0'};
  color: ${p => p.success ? 'var(--primary)' : '#d46a4f'};
`;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pass !== confirm) return setMsg({ text: "Passphrases do not match", type: "error" });
    if (pass.length < 6) return setMsg({ text: "Passphrase must be at least 6 characters", type: "error" });
    
    setLoading(true);
    setMsg({ text: "", type: "" });
    try {
      await api.post(`/auth/reset-password/${token}`, { password: pass });
      setMsg({ text: "Passphrase updated successfully! Redirecting to login...", type: "success" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg({ text: err.response?.data?.message || "Reset failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrap>
      <Card>
        <div style={{ fontSize:'3rem', marginBottom:'20px' }}>🔐</div>
        <Title>Reset Access</Title>
        <p style={{ color:'var(--text-muted)', marginBottom:'40px' }}>Operational security protocol: update your credentials.</p>

        {msg.text && <Alert success={msg.type === 'success'}>{msg.text}</Alert>}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>New Passphrase</label>
            <input type="password" required value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" />
          </FormGroup>
          <FormGroup>
            <label>Confirm Passphrase</label>
            <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" />
          </FormGroup>
          <Btn type="submit" disabled={loading}>{loading ? "UPDATING..." : "COMMIT CHANGES"}</Btn>
        </form>

        <div style={{ marginTop: '30px' }}>
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem' }}>← BACK TO LOGIN</Link>
        </div>
      </Card>
    </PageWrap>
  );
};

export default ResetPassword;
