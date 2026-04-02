import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../../api';

// ===== STYLED COMPONENTS =====
const PageContainer = styled.div`
  padding: var(--spacing-xl);
  animation: entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TopHeader = styled.div`
  margin-bottom: var(--spacing-xxl);
`;

const PageTitle = styled.h2`
  font-size: 3.5rem;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  small { font-size: 1rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7; margin-top: 8px; }
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--spacing-xxl);
  @media (max-width: 1000px) { grid-template-columns: 1fr; }
`;

const ConfigCard = styled.div`
  background: var(--bg-surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
  transition: var(--transition-smooth);
  
  &:hover { border-color: var(--accent); box-shadow: var(--shadow-premium); }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  &::before { content:''; width:4px; height:24px; background:var(--primary); border-radius:2px; }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  label { display: block; font-size: 0.75rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.1em; }
  input, textarea {
    width: 100%;
    padding: 18px;
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

const LogoPlate = styled.div`
  background: var(--bg-surface-alt);
  border-radius: var(--radius-card);
  padding: 40px;
  text-align: center;
  border: 2px dashed var(--border);
  cursor: pointer;
  transition: var(--transition-smooth);
  &:hover { border-color: var(--primary); background: var(--bg-surface); }
  
  img { max-height: 140px; margin-bottom: 24px; filter: drop-shadow(var(--shadow-subtle)); border-radius: 8px; }
  .hint { font-size: 0.85rem; color: var(--text-secondary); font-weight: 700; }
  input { display: none; }
`;

const ActionBtn = styled.button`
  width: 100%;
  padding: 20px;
  background: var(--primary);
  color: var(--text-inverse);
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-top: 24px;
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.2);
  cursor: pointer;
  
  &:hover:not(:disabled) { background: var(--accent); color: var(--text-inverse); transform: translateY(-3px); box-shadow: var(--shadow-premium); }
  &:disabled { opacity: 0.4; }
`;

const Feedback = styled.div`
  margin-top: 24px;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  font-weight: 900;
  font-size: 0.8rem;
  text-transform: uppercase;
  background: ${p => p.$error ? 'rgba(212, 106, 79, 0.1)' : 'rgba(76, 175, 80, 0.1)'};
  color: ${p => p.$error ? '#FF5252' : '#4CAF50'};
  border: 1px solid currentColor;
`;

// ===== COMPONENT =====
const AdminSettings = () => {
  const [settings, setSettings] = useState({ storeName: '', storeAddress: '', storePhone: '', footerText: '', logoUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      if (res.data.settings) setSettings(res.data.settings);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true); setStatus(null);
    try {
      await api.put('/admin/settings', settings);
      setStatus({ msg: 'Branding identity synchronized.', error: false });
    } catch (err) { setStatus({ msg: 'Update failure: Digital Refinement Refused.', error: true }); } 
    finally { setSaving(false); }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('logo', file);
    setSaving(true);
    try {
      const res = await api.post('/admin/settings/logo', formData);
      setSettings({ ...settings, logoUrl: res.data.logoUrl });
      setStatus({ msg: 'Official Logo Authorization Verified.', error: false });
    } catch (err) { setStatus({ msg: 'Visual asset calibration failed.', error: true }); } 
    finally { setSaving(false); }
  };

  if (loading) return <div style={{padding:'100px', textAlign:'center', fontWeight:900, color:'var(--text-secondary)'}}>LOADING CONFIGURATION...</div>;

  return (
    <PageContainer>
      <ContentWrapper>
        <TopHeader>
          <PageTitle>System Branding <small>INSTITUTIONAL IDENTITY & GLOBAL CONFIGURATION</small></PageTitle>
        </TopHeader>

        <SettingsGrid>
          <ConfigCard>
            <CardTitle>Institutional Details</CardTitle>
            <form onSubmit={handleUpdate}>
              <FormGroup><label>Consortium Name</label><input value={settings.storeName} onChange={e => setSettings({...settings, storeName: e.target.value})} placeholder="e.g. Agrotek Elite Intelligence" /></FormGroup>
              <FormGroup><label>Global Logistics Hub (Address)</label><textarea rows="3" value={settings.storeAddress} onChange={e => setSettings({...settings, storeAddress: e.target.value})} placeholder="Primary Operations Center..." /></FormGroup>
              <FormGroup><label>Strategic Support Hotline</label><input value={settings.storePhone} onChange={e => setSettings({...settings, storePhone: e.target.value})} placeholder="+92 300 0000000" /></FormGroup>
              <FormGroup><label>Fiscal Document Footer</label><input value={settings.footerText} onChange={e => setSettings({...settings, footerText: e.target.value})} placeholder="Standard closing remark..." /></FormGroup>
              <ActionBtn type="submit" disabled={saving}>{saving ? 'SYNCHRONIZING...' : 'AUTHORIZE IDENTITY UPDATE'}</ActionBtn>
            </form>
            {status && <Feedback $error={status.error}>{status.msg}</Feedback>}
          </ConfigCard>

          <ConfigCard>
            <CardTitle>Official Visual Identity</CardTitle>
            <p style={{fontSize:'1rem', color:'var(--text-secondary)', marginBottom:'32px', fontWeight:600, lineHeight:1.6}}>
              This identifier will appear in the header of all official statements and tactical reports. 
              <strong> High-resolution transparent PNG recommended.</strong>
            </p>
            
            <label htmlFor="logo-upload">
              <LogoPlate>
                <img src={settings.logoUrl ? `http://localhost:5000${settings.logoUrl}` : 'https://ui-avatars.com/api/?name=Agrotek&background=2B3922&color=F5B611'} alt="Seal" />
                <div className="hint">{saving ? 'Transmitting Asset...' : 'Click to Upload Official Seal (JPG, PNG, WEBP)'}</div>
                <input id="logo-upload" type="file" onChange={handleLogoUpload} disabled={saving} accept="image/*" />
              </LogoPlate>
            </label>
            
            <div style={{marginTop:'40px', background:'var(--bg-surface-alt)', padding:'24px', borderRadius:'16px', border:'1px solid var(--border)'}}>
              <h4 style={{fontSize:'0.75rem', fontWeight:900, color:'var(--primary)', marginBottom:'12px', textTransform:'uppercase', letterSpacing:'0.1em'}}>Digital Integrity Info</h4>
              <div style={{fontSize:'0.85rem', color:'var(--text-secondary)', fontWeight:700, display:'flex', flexDirection:'column', gap: '8px'}}>
                <span>✔ Seal: {settings.logoUrl ? 'Authorized' : 'System Default Active'}</span>
                <span>✔ Resolution: Auto-Optimized to WEBP High-Fidelity</span>
                <span>✔ Global Deployment: Active for Invoices & Reports</span>
              </div>
            </div>
          </ConfigCard>
        </SettingsGrid>
      </ContentWrapper>
    </PageContainer>
  );
};

export default AdminSettings;
