import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../../api';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  grid-template-columns: 1fr 1fr;
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

const MapWrapper = styled.div`
  height: 350px;
  width: 100%;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 2px solid var(--border);
  margin-bottom: 16px;
`;

// Helper component to handle map clicks
const MapEvents = ({ onLocationSelected }) => {
  useMapEvents({
    click(e) {
      onLocationSelected({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

// ===== COMPONENT =====
const AdminSettings = () => {
  const [settings, setSettings] = useState({ 
    storeName: '', storeAddress: '', storePhone: '', footerText: '', logoUrl: '', whatsappNumber: '', supportEmail: '' 
  });
  const [position, setPosition] = useState({ lat: 31.5204, lng: 74.3587 }); // Default: Lahore
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      if (res.data.settings) {
        setSettings({
          storeName: res.data.settings.storeName || '',
          storeAddress: res.data.settings.storeAddress || '',
          storePhone: res.data.settings.storePhone || '',
          footerText: res.data.settings.footerText || '',
          logoUrl: res.data.settings.logoUrl || '',
          whatsappNumber: res.data.settings.whatsappNumber || '',
          supportEmail: res.data.settings.supportEmail || ''
        });
        if (res.data.settings.mapCoordinates && typeof res.data.settings.mapCoordinates.lat === 'number') {
          setPosition({ 
            lat: Number(res.data.settings.mapCoordinates.lat) || 31.5204, 
            lng: Number(res.data.settings.mapCoordinates.lng) || 74.3587 
          });
        }
      }
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true); setStatus(null);
    try {
      await api.put('/admin/settings', { ...settings, mapCoordinates: position });
      setStatus({ msg: 'Settings updated successfully.', error: false });
    } catch (err) { setStatus({ msg: 'Update failed.', error: true }); } 
    finally { setSaving(false); }
  };

  const handleLocationSelected = async (latlng) => {
    setPosition(latlng);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        setSettings(prev => ({ ...prev, storeAddress: data.display_name }));
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
    }
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
      setStatus({ msg: 'Logo Uploaded.', error: false });
    } catch (err) { setStatus({ msg: 'Logo upload failed.', error: true }); } 
    finally { setSaving(false); }
  };

  if (loading) return <div style={{padding:'100px', textAlign:'center', fontWeight:900, color:'var(--text-secondary)'}}>LOADING CONFIGURATION...</div>;

  return (
    <PageContainer>
      <ContentWrapper>
        <TopHeader>
          <PageTitle>Store & Support Settings <small>Contact Info & Map Configuration</small></PageTitle>
        </TopHeader>

        <form onSubmit={handleUpdate}>
          <SettingsGrid>
            {/* Left Column */}
            <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xxl)'}}>
              <ConfigCard>
                <CardTitle>Company Details</CardTitle>
                <FormGroup><label>Store Name</label><input value={settings.storeName} onChange={e => setSettings({...settings, storeName: e.target.value})} placeholder="e.g. KisanStore" /></FormGroup>
                <FormGroup><label>Support Email</label><input type="email" value={settings.supportEmail} onChange={e => setSettings({...settings, supportEmail: e.target.value})} placeholder="support@kisanstore.pk" /></FormGroup>
                <FormGroup><label>Phone Number (Calling)</label><input value={settings.storePhone} onChange={e => setSettings({...settings, storePhone: e.target.value})} placeholder="+92 300 0000000" /></FormGroup>
                <FormGroup><label>WhatsApp Support Number</label><input value={settings.whatsappNumber} onChange={e => setSettings({...settings, whatsappNumber: e.target.value})} placeholder="+92 300 0000000" /></FormGroup>
              </ConfigCard>

              <ConfigCard>
                <CardTitle>Visual Logo Identity</CardTitle>
                <label htmlFor="logo-upload">
                  <LogoPlate>
                    <img src={settings.logoUrl ? `http://localhost:5000${settings.logoUrl}` : 'https://ui-avatars.com/api/?name=Store&background=2B3922&color=F5B611'} alt="Logo" />
                    <div className="hint">{saving ? 'Uploading...' : 'Click to Upload Store Logo (JPG, PNG)'}</div>
                    <input id="logo-upload" type="file" onChange={handleLogoUpload} disabled={saving} accept="image/*" />
                  </LogoPlate>
                </label>
              </ConfigCard>
            </div>

            {/* Right Column */}
            <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xxl)'}}>
              <ConfigCard>
                <CardTitle>Physical Location Map</CardTitle>
                <div style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5}}>
                  Click anywhere on the map to pin your store location. This will automatically update your GPS coordinates and written address below.
                </div>
                
                <MapWrapper>
                  <MapContainer 
                    key={`${position.lat}-${position.lng}`}
                    center={[position.lat, position.lng]} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%', zIndex: 1 }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker position={[position.lat, position.lng]} />
                    <MapEvents onLocationSelected={handleLocationSelected} />
                  </MapContainer>
                </MapWrapper>

                <FormGroup><label>Written Address (Auto-generated)</label><textarea rows="3" value={settings.storeAddress} onChange={e => setSettings({...settings, storeAddress: e.target.value})} placeholder="Street Box, Sector..." /></FormGroup>
                <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '24px'}}>
                  Pinned GPS: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
                </div>

                <FormGroup><label>Invoice Footer / Welcome Message</label><input value={settings.footerText} onChange={e => setSettings({...settings, footerText: e.target.value})} placeholder="Thank you for shopping with us!" /></FormGroup>

                <ActionBtn type="submit" disabled={saving}>{saving ? 'SAVING...' : 'SAVE CONFIGURATIONS'}</ActionBtn>
                {status && <Feedback $error={status.error}>{status.msg}</Feedback>}
              </ConfigCard>
            </div>

          </SettingsGrid>
        </form>
      </ContentWrapper>
    </PageContainer>
  );
};

export default AdminSettings;
