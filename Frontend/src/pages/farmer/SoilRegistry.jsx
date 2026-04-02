import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../api';

// ===== STYLED COMPONENTS =====
const PageContainer = styled.div`
  padding: var(--spacing-xl);
  animation: entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  background: var(--bg-app);
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--spacing-xxl);
  flex-wrap: wrap;
  gap: var(--spacing-lg);
`;

const PageTitle = styled.h2`
  font-size: 3.5rem;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  small { font-size: 1rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7; margin-top: 8px; }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xxl);
`;

const AnalysisCard = styled.div`
  background: var(--bg-surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
  transition: var(--transition-smooth);
  
  &:hover { transform: translateY(-5px); border-color: var(--accent); box-shadow: var(--shadow-premium); }
  
  h4 { font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 16px; letter-spacing: 0.1em; font-weight: 900; }
  .value { font-size: 2.2rem; font-weight: 900; color: var(--text-primary); letter-spacing: -0.02em; }
  .indicator { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: var(--radius-pill); font-size: 0.7rem; font-weight: 900; margin-top: 16px; text-transform: uppercase; border: 1px solid currentColor; }
  
  &.nitrogen .indicator { background: rgba(76, 175, 80, 0.1); color: #4CAF50; }
  &.ph .indicator { background: rgba(245, 182, 17, 0.1); color: #F5B611; }
  &.history .indicator { background: rgba(var(--primary-rgb), 0.1); color: var(--primary); }
`;

const HistoricalLog = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LogEntry = styled.div`
  background: var(--bg-surface);
  padding: 24px 32px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: var(--transition-smooth);
  
  &:hover { transform: translateX(10px); border-color: var(--primary); background: var(--bg-surface-alt); }
  
  .details {
    h3 { font-size: 1.25rem; color: var(--text-primary); margin-bottom: 4px; }
    span { color: var(--text-secondary); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
  }

  .metrics {
    display: flex;
    gap: 32px;
    div { text-align: center; }
    label { display: block; font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 900; margin-bottom: 4px; }
    strong { font-size: 1.2rem; color: var(--text-primary); font-weight: 900; }
  }
`;

const ActionBtn = styled.button`
  padding: 14px 28px;
  background: var(--primary);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-pill);
  font-weight: 900;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: var(--transition-smooth);
  
  &:hover { background: var(--accent); color: var(--text-inverse); transform: translateY(-3px); box-shadow: var(--shadow-premium); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(13, 15, 12, 0.8);
  backdrop-filter: blur(20px);
  z-index: 4000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalForm = styled.form`
  background: var(--bg-surface);
  padding: 48px;
  border-radius: var(--radius-card);
  width: 100%;
  max-width: 550px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-premium);
  animation: entrance 0.4s ease;
  
  h3 { font-size: 2rem; color: var(--text-primary); margin-bottom: 32px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
`;

const FormGroup = styled.div`
  label { display: block; font-size: 0.75rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.1em; }
  input {
    width: 100%;
    padding: 16px;
    background: var(--bg-surface-alt);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    color: var(--text-primary);
    font-weight: 700;
    transition: var(--transition-smooth);
    &:focus { outline: none; border-color: var(--accent); }
  }
`;

// ===== COMPONENT =====
const SoilRegistry = () => {
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nitrogen: '', phosphorus: '', potassium: '', ph: '', location: '', notes: '' });

  const fetchReports = async () => {
    try {
      const res = await api.get('/soil');
      setReports(res.data.reports || []);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/soil', formData);
      setShowModal(false);
      setFormData({ nitrogen: '', phosphorus: '', potassium: '', ph: '', location: '', notes: '' });
      fetchReports();
    } catch (err) { alert('Digital Synchrony failure: Protocol Refused.'); }
  };

  const latest = reports[0] || {};

  return (
    <PageContainer>
      <ContentWrapper>
        <TopHeader>
          <PageTitle>Soil Intelligence <small>TACTICAL RECONNAISSANCE & FIELD ANALYTICS</small></PageTitle>
          <ActionBtn onClick={() => setShowModal(true)}>+ Register New Analysis</ActionBtn>
        </TopHeader>

        {loading ? (
          <div style={{display:'flex',justifyContent:'center',padding:'120px'}}><div style={{width:'60px',height:'60px',border:'5px solid var(--border)',borderTopColor:'var(--primary)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} /></div>
        ) : (
          <>
            <StatsGrid>
              <AnalysisCard className="nitrogen">
                <h4>Nitrogen Saturation (N)</h4>
                <div className="value">{latest.nitrogen || '--'} <small style={{fontSize:'1rem', opacity:0.6}}>mg/kg</small></div>
                <div className="indicator">{latest.nitrogen > 20 ? '✅ Optimal Balance' : '⚠️ Deficit Identified'}</div>
              </AnalysisCard>
              <AnalysisCard className="ph">
                <h4>Equilibrium Index (pH)</h4>
                <div className="value">{latest.ph || '--'}</div>
                <div className="indicator">{latest.ph > 6 && latest.ph < 7.5 ? '✅ Balanced PH' : '⚠️ Correction Required'}</div>
              </AnalysisCard>
              <AnalysisCard className="history">
                <h4>Registry Magnitude</h4>
                <div className="value">{reports.length} <small style={{fontSize:'1rem', opacity:0.6}}>Logs</small></div>
                <div className="indicator">Institutional Verified</div>
              </AnalysisCard>
            </StatsGrid>

            <h3 style={{fontSize:'1.8rem', color:'var(--text-primary)', marginBottom:'24px'}}>Historical Surveillance Log</h3>
            <HistoricalLog>
              {reports.map(report => (
                <LogEntry key={report._id}>
                  <div className="details">
                    <h3>{report.location || 'Primary Sector'}</h3>
                    <span>Digital Timestamp: {new Date(report.testDate).toLocaleDateString()}</span>
                  </div>
                  <div className="metrics">
                    <div><label>Nitrogen</label><strong>{report.nitrogen}</strong></div>
                    <div><label>Phosphor</label><strong>{report.phosphorus}</strong></div>
                    <div><label>Potass</label><strong>{report.potassium}</strong></div>
                    <div><label>PH Index</label><strong>{report.ph}</strong></div>
                  </div>
                </LogEntry>
              ))}
            </HistoricalLog>
          </>
        )}
      </ContentWrapper>

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalForm onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
            <h3>Initialize Soil Protocol</h3>
            <div className="grid">
              <FormGroup><label>Nitrogen (N)</label><input type="number" step="0.1" required value={formData.nitrogen} onChange={e => setFormData({...formData, nitrogen: e.target.value})} /></FormGroup>
              <FormGroup><label>Phosphorus (P)</label><input type="number" step="0.1" required value={formData.phosphorus} onChange={e => setFormData({...formData, phosphorus: e.target.value})} /></FormGroup>
              <FormGroup><label>Potassium (K)</label><input type="number" step="0.1" required value={formData.potassium} onChange={e => setFormData({...formData, potassium: e.target.value})} /></FormGroup>
              <FormGroup><label>Acidity Magnitude (pH)</label><input type="number" step="0.1" value={formData.ph} onChange={e => setFormData({...formData, ph: e.target.value})} /></FormGroup>
            </div>
            <FormGroup style={{marginBottom:'32px'}}><label>Location Descriptor / Sector ID</label><input type="text" placeholder="e.g. South Quadrant" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></FormGroup>
            <ActionBtn type="submit" style={{width:'100%'}}>Authorize Documentation</ActionBtn>
            <button type="button" onClick={() => setShowModal(false)} style={{width:'100%', padding:'14px', background:'none', border:'none', color:'var(--text-secondary)', fontWeight:900, textTransform:'uppercase', cursor:'pointer', marginTop:'16px', fontSize:'0.75rem', letterSpacing:'0.1em'}}>Abort Protocol</button>
          </ModalForm>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default SoilRegistry;
