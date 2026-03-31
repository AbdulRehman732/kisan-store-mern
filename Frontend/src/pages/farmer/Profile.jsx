import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

const spin = keyframes`to { transform: rotate(360deg); }`;

// ===== STYLED COMPONENTS =====
const PageWrap = styled.div`
  min-height: calc(100vh - 120px);
  background: var(--bg-cream);
  padding: 80px 24px;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 3.5rem;
  color: var(--primary);
  margin-bottom: 48px;
  text-align: center;
  small {
    display: block;
    font-family: inherit;
    font-size: 1.1rem;
    color: var(--text-muted);
    font-weight: 500;
    margin-top: 8px;
  }
`;

const ProfileHeader = styled.div`
  background: var(--primary);
  border-radius: var(--radius-card);
  padding: 60px 48px;
  color: var(--white);
  display: flex;
  align-items: center;
  gap: 32px;
  margin-bottom: 48px;
  box-shadow: var(--shadow-premium);
  @media (max-width: 600px) { flex-direction: column; text-align: center; }
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  border: 1px solid rgba(255,255,255,0.2);
`;

const ProfileName = styled.div`
  h2 { font-size: 2.2rem; margin-bottom: 8px; }
  p { font-size: 1.1rem; color: var(--accent); font-weight: 700; opacity: 1; }
`;

const Card = styled.div`
  background: var(--white);
  border-radius: var(--radius-card);
  padding: 60px 48px;
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--border-soft);
  margin-bottom: 48px;
`;

const CardTitle = styled.h3`
  font-size: 1.8rem;
  color: var(--primary);
  margin-bottom: 40px;
  border-bottom: 2px solid var(--bg-cream);
  padding-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 32px;
  label {
    display: block;
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--primary);
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  input {
    width: 100%;
    padding: 18px 24px;
    border: 1px solid var(--border-soft);
    border-radius: var(--radius-sm);
    font-family: inherit;
    font-size: 1rem;
    color: var(--text-charcoal);
    background: var(--bg-cream);
    transition: var(--transition);
    &:focus {
      outline: none;
      border-color: var(--primary);
      background: var(--white);
    }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
`;

const PhoneRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  input { flex: 1; }
`;

const IconBtn = styled.button`
  width: 58px;
  height: 58px;
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

const SaveBtn = styled.button`
  padding: 20px 40px;
  background: var(--text-charcoal);
  color: var(--white);
  border-radius: var(--radius-pill);
  font-weight: 800;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: var(--transition);
  &:hover { background: var(--primary); transform: translateY(-2px); }
  &:disabled { opacity: 0.5; }
`;

const SpinnerWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid var(--bg-cream);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Profile = () => {
  const { user, login } = useAuth();
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
        setForm({ 
          first_name: u.first_name, 
          last_name: u.last_name, 
          email: u.email,
          address: u.address || "",
          city: u.city || "",
          cnic: u.cnic || "",
          avatarUrl: u.avatarUrl || ""
        });
        setPhones(u.phone?.length ? u.phone : [""]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhoneChange = (i, val) => {
    const p = [...phones]; p[i] = val; setPhones(p);
  };
  const addPhone = () => { if (phones.length < 3) setPhones([...phones, ""]); };
  const removePhone = (i) => { if (phones.length > 1) setPhones(phones.filter((_, idx) => idx !== i)); };
 
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);
    try {
      setSaving(true);
      const res = await api.post("/auth/avatar", fd);
      setForm({...form, avatarUrl: res.data.avatarUrl});
      setMsg({ text: "Avatar updated!", type: "success" });
      // Update global auth state if needed, or just let refresh handle it
    } catch (err) {
      setMsg({ text: "Avatar upload failed", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", { ...form, phone: phones.filter((p) => p.trim()) });
      setMsg({ text: 'Profile updated successfully!', type: 'success' });
      login(res.data.user);
    } catch (err) { setMsg({ text: "Update failed", type: "error" }); } finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) return setMsg({ text: "Passwords do not match", type: "error" });
    setSaving(true);
    try {
      await api.put('/auth/password', { currentPassword: passwords.current, newPassword: passwords.newPass });
      setMsg({ text: "Password changed successfully!", type: "success" });
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) { setMsg({ text: "Password change failed", type: "error" }); } finally { setSaving(false); }
  };

  if (loading) return <SpinnerWrap><Spinner /></SpinnerWrap>;

  return (
    <PageWrap>
      <Container>
        <PageTitle>
          Farmer Identity
          <small>Securely manage your administrative profile</small>
        </PageTitle>

        <ProfileHeader>
          <div style={{ position:'relative' }}>
            <Avatar>
              {form.avatarUrl ? (
                <img src={`http://localhost:5000${form.avatarUrl}`} alt="avatar" style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'24px'}} />
              ) : "👨‍🌾"}
            </Avatar>
            <label style={{ position:'absolute', bottom:'-10px', right:'-10px', background:'var(--accent)', color:'var(--primary)', width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', border:'3px solid var(--primary)', fontSize:'1.2rem', boxShadow:'var(--shadow-premium)' }}>
              📸 <input type="file" style={{display:'none'}} onChange={handleAvatarUpload} />
            </label>
          </div>
          <ProfileName>
            <h2>{form.first_name} {form.last_name}</h2>
            <p>{form.email}</p>
          </ProfileName>
        </ProfileHeader>

        {msg.text && (
          <div style={{ padding:'20px', borderRadius:'15px', marginBottom:'48px', fontWeight:800, background:msg.type==='success'?'var(--primary)':'#fdf2f0', color:msg.type==='success'?'var(--white)':'#d46a4f' }}>
            {msg.type === "success" ? "✓" : "⚠"} {msg.text}
          </div>
        )}

        <Card>
          <CardTitle>✏️ Core Authentication Details</CardTitle>
          <form onSubmit={handleSaveProfile}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px' }}>
              <FormGroup>
                <label>First Name</label><input name="first_name" value={form.first_name} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <label>Last Name</label><input name="last_name" value={form.last_name} onChange={handleChange} required />
              </FormGroup>
            </div>
            <FormGroup>
              <label>Institutional Email</label><input value={form.email} disabled />
            </FormGroup>
            <FormGroup>
              <label>Verified Contacts <small style={{ fontWeight:400, opacity:0.6 }}>(up to 3)</small></label>
              {phones.map((p, i) => (
                <PhoneRow key={i}>
                  <input type="tel" value={p} onChange={(e) => handlePhoneChange(i, e.target.value)} placeholder="0300-1234567" />
                  {phones.length > 1 && <IconBtn type="button" remove onClick={() => removePhone(i)}>✕</IconBtn>}
                </PhoneRow>
              ))}
              {phones.length < 3 && (
                <button type="button" onClick={addPhone} style={{ width:'100%', padding:'15px', border:'2px dashed var(--border-soft)', borderRadius:'12px', fontWeight:800, color:'var(--primary)', marginBottom:'24px' }}>+ ADD AUTHORIZED CONTACT</button>
              )}
            </FormGroup>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px' }}>
              <FormGroup>
                <label>City</label><input name="city" value={form.city} onChange={handleChange} placeholder="e.g. Bahawalnagar" />
              </FormGroup>
              <FormGroup>
                <label>CNIC Number</label><input name="cnic" value={form.cnic} onChange={handleChange} placeholder="35201-1234567-1" />
              </FormGroup>
            </div>
            <FormGroup>
              <label>Permanent Address</label><input name="address" value={form.address} onChange={handleChange} placeholder="Street, Village, Tehsil..." />
            </FormGroup>
            <SaveBtn type="submit" disabled={saving}>{saving ? "Processing..." : "Commit Profile Changes"}</SaveBtn>
          </form>
        </Card>

        <Card>
          <CardTitle>🔐 Security Credentials</CardTitle>
          <form onSubmit={handleChangePassword}>
            <FormGroup>
              <label>Current Credentials</label><input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} required />
            </FormGroup>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px' }}>
              <FormGroup>
                <label>New Passphrase</label><input type="password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} required />
              </FormGroup>
              <FormGroup>
                <label>Confirm Passphrase</label><input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} required />
              </FormGroup>
            </div>
            <SaveBtn type="submit" disabled={saving}>{saving ? "Updating..." : "Authorize Passphrase Reset"}</SaveBtn>
          </form>
        </Card>
      </Container>
    </PageWrap>
  );
};

export default Profile;

