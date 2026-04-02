import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

// ===== STYLED COMPONENTS =====
const PageContainer = styled.div`
  padding: var(--spacing-xl);
  animation: entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  background: var(--bg-app);
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const PageTitle = styled.h2`
  font-size: 3.5rem;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-xxl);
  small { font-size: 1rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7; margin-top: 8px; }
`;

const ProfileHero = styled.div`
  background: var(--primary);
  border-radius: var(--radius-card);
  padding: 60px;
  color: var(--text-inverse);
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-premium);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -50%; right: -20%;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  @media (max-width: 768px) { flex-direction: column; text-align: center; padding: 40px 20px; }
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
`;

const AvatarCircle = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const UploadTrigger = styled.label`
  position: absolute;
  bottom: -10px;
  right: -10px;
  background: var(--accent);
  color: var(--text-inverse);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 4px solid var(--primary);
  font-size: 1.2rem;
  box-shadow: var(--shadow-premium);
  transition: var(--transition-smooth);
  &:hover { transform: scale(1.1) rotate(15deg); }
`;

const ProfileMeta = styled.div`
  h2 { font-size: 2.8rem; margin-bottom: 8px; letter-spacing: -0.02em; }
  p { font-size: 1.1rem; color: var(--accent); font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.9; }
`;

const EliteCard = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: var(--spacing-xl);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
  margin-bottom: var(--spacing-xl);
`;

const CardTitle = styled.h3`
  font-size: 1.8rem;
  color: var(--text-primary);
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 16px;
  &::after { content:''; flex:1; height:1px; background: var(--border); margin-left: 20px; }
`;

const FormGroup = styled.div`
  margin-bottom: 32px;
  label { display: block; font-size: 0.75rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.1em; }
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
    &:disabled { opacity: 0.6; cursor: not-allowed; background: var(--bg-app); border-color: transparent; }
  }
`;

const GovernanceAlert = styled.div`
  background: rgba(var(--primary-rgb), 0.05);
  border-radius: 12px;
  padding: 24px;
  border-left: 5px solid var(--primary);
  margin-bottom: 40px;
  h4 { font-size: 0.9rem; color: var(--primary); font-weight: 900; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em; }
  p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; font-weight: 700; }
`;

const ActionBtn = styled.button`
  padding: 20px 48px;
  background: var(--primary);
  color: var(--text-inverse);
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  transition: var(--transition-smooth);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  cursor: pointer;
  
  &:hover:not(:disabled) { background: var(--accent); color: var(--text-inverse); transform: translateY(-3px); box-shadow: var(--shadow-premium); }
  &:disabled { opacity: 0.4; }
`;

const DangerBtn = styled.button`
  padding: 20px 48px;
  background: transparent;
  color: #FF5252;
  border: 2px solid #FF5252;
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  transition: var(--transition-smooth);
  cursor: pointer;
  width: 100%;
  
  &:hover:not(:disabled) { background: #FF5252; color: white; transform: translateY(-3px); box-shadow: 0 10px 30px rgba(255, 82, 82, 0.2); }
`;

const Message = styled.div`
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 32px;
  font-weight: 900;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${p => p.$type === 'success' ? '#4CAF50' : '#FF5252'};
  color: white;
  animation: entrance 0.4s ease;
`;

// ===== COMPONENT =====
const Profile = () => {
  const { login, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", address: "", city: "", cnic: "", avatarUrl: "" });
  const [phones, setPhones] = useState([""]);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  useEffect(() => {
    api.get("/auth/me")
      .then((res) => {
        const u = res.data.user;
        setForm({ first_name: u.first_name, last_name: u.last_name, email: u.email, address: u.address || "", city: u.city || "", cnic: u.cnic || "", avatarUrl: u.avatarUrl || "" });
        setPhones(u.phone?.length ? u.phone : [""]);
      })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData(); fd.append("avatar", file);
    try {
      setSaving(true);
      const res = await api.post("/auth/avatar", fd);
      setForm({...form, avatarUrl: res.data.avatarUrl});
      setMsg({ text: "Identity Visualization Updated.", type: "success" });
    } catch (err) { setMsg({ text: "Update Protocol Failed.", type: "error" }); } 
    finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) return setMsg({ text: "Authorization Mismatch: Passwords differ.", type: "error" });
    setSaving(true);
    try {
      await api.put('/auth/password', { currentPassword: passwords.current, newPassword: passwords.newPass });
      setMsg({ text: "Security Credentials Synchronized.", type: "success" });
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) { setMsg({ text: "Protocol Failure: Incorrect credentials.", type: "error" }); } 
    finally { setSaving(false); }
  };

  if (loading) return <PageContainer><h2 style={{color:'var(--primary)', textAlign:'center', marginTop:'100px'}}>Analyzing Identity Profile...</h2></PageContainer>;

  return (
    <PageContainer>
      <ContentWrapper>
        <PageTitle>Stakeholder Identity <small>SECURE ADMINISTRATIVE PROFILE MANAGEMENT</small></PageTitle>

        <ProfileHero>
          <AvatarContainer>
            <AvatarCircle>
              {form.avatarUrl ? <img src={`http://localhost:5000${form.avatarUrl}`} alt="avatar" /> : "👨‍🌾"}
            </AvatarCircle>
            <UploadTrigger>📸 <input type="file" style={{display:'none'}} onChange={handleAvatarUpload} /></UploadTrigger>
          </AvatarContainer>
          <ProfileMeta>
            <h2>{form.first_name} {form.last_name}</h2>
            <p>{form.email}</p>
          </ProfileMeta>
        </ProfileHero>

        {msg.text && <Message $type={msg.type}>{msg.text}</Message>}

        <EliteCard>
          <CardTitle>Institutional Details</CardTitle>
          <GovernanceAlert>
            <h4>Profile Governance Protocol</h4>
            <p>This identity profile is subject to strict institutional overrides. Immutable fields are managed by central administration to ensure data integrity. Contact the Strategic Command Center for fundamental identity adjustments.</p>
          </GovernanceAlert>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px' }}>
            <FormGroup><label>Authorized First Name</label><input value={form.first_name} disabled /></FormGroup>
            <FormGroup><label>Authorized Last Name</label><input value={form.last_name} disabled /></FormGroup>
          </div>
          <FormGroup><label>Institutional Communication Endpoint (Email)</label><input value={form.email} disabled /></FormGroup>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px' }}>
            <FormGroup><label>Verified Contact Magnitude</label><input value={phones.join(', ')} disabled /></FormGroup>
            <FormGroup><label>National ID / CNIC Hash</label><input value={form.cnic} disabled /></FormGroup>
          </div>
          <FormGroup><label>Permanent Strategic Location (Address)</label><input value={form.address} disabled /></FormGroup>
          <div style={{textAlign:'center', fontSize:'0.7rem', color:'var(--text-secondary)', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em'}}>Registry State: [READ-ONLY AUTHORIZED]</div>
        </EliteCard>

        <EliteCard>
          <CardTitle>Security Credentials</CardTitle>
          <form onSubmit={handleChangePassword}>
            <FormGroup><label>Active Credentials (Current Passphrase)</label><input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} required /></FormGroup>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px' }}>
              <FormGroup><label>Strategic Passphrase Offset (New Password)</label><input type="password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} required /></FormGroup>
              <FormGroup><label>Confirmation Hash (Repeat New Password)</label><input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} required /></FormGroup>
            </div>
            <ActionBtn type="submit" disabled={saving}>{saving ? "Synchronizing..." : "Authorize Passphrase Reset"}</ActionBtn>
          </form>
        </EliteCard>

        <EliteCard style={{ borderColor: 'rgba(255, 82, 82, 0.2)', background: 'rgba(255, 82, 82, 0.02)' }}>
          <CardTitle style={{ color: '#FF5252' }}>Session Termination</CardTitle>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '24px' }}>Terminate the current encrypted link and lock out the device.</p>
          <DangerBtn onClick={() => { logout(); window.location.href = '#/login'; }}>Authorize Session Termination</DangerBtn>
        </EliteCard>

      </ContentWrapper>
    </PageContainer>
  );
};

export default Profile;
