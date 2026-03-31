import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
`;

const Header = styled.div`
  margin-bottom: 40px;
  h2 { font-size: 2.2rem; color: var(--primary); margin-bottom: 8px; }
  p { color: var(--text-muted); font-size: 1.1rem; }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: var(--white);
  padding: 30px;
  border-radius: var(--radius-card);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-subtle);
  h4 { font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px; letter-spacing: 0.05em; }
  .value { font-size: 1.8rem; font-weight: 900; color: var(--primary); }
  .status { display: inline-block; padding: 4px 10px; border-radius: var(--radius-pill); font-size: 0.7rem; font-weight: 800; margin-top: 10px; }
  &.nitrogen .status { background: #e8f5e9; color: #2e7d32; }
  &.ph .status { background: #fff3e0; color: #ef6c00; }
`;

const ReportCard = styled.div`
  background: var(--white);
  padding: 24px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-soft);
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  &:hover { transform: translateX(5px); border-color: var(--primary); }
  
  .details {
    h3 { font-size: 1.1rem; color: var(--primary); margin-bottom: 4px; }
    span { color: var(--text-muted); font-size: 0.85rem; }
  }

  .metrics {
    display: flex;
    gap: 20px;
    div { text-align: center; }
    label { display: block; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; }
    strong { font-size: 1rem; color: var(--primary); }
  }
`;

const AddBtn = styled.button`
  background: var(--primary);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-pill);
  font-weight: 700;
  margin-bottom: 30px;
  &:hover { background: var(--text-charcoal); }
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4000;
`;

const Form = styled.form`
  background: white;
  padding: 40px;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  h2 { margin-bottom: 24px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-top: 6px; }
  label { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
  button { width: 100%; padding: 14px; background: var(--primary); color: white; border-radius: 8px; font-weight: 700; margin-top: 10px; }
  .cancel { background: none; color: var(--text-muted); font-size: 0.9rem; text-decoration: underline; margin-top: 15px; cursor: pointer; border: none; }
`;

const SoilRegistry = () => {
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nitrogen: '', phosphorus: '', potassium: '', ph: '', location: '', notes: ''
  });

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/soil', { withCredentials: true });
      setReports(res.data.reports);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/soil', formData, { withCredentials: true });
      setShowModal(false);
      setFormData({ nitrogen: '', phosphorus: '', potassium: '', ph: '', location: '', notes: '' });
      fetchReports();
    } catch (err) {
      alert('Error adding report');
    }
  };

  const latest = reports[0] || {};

  return (
    <Container>
      <Header>
        <h2>🔬 Soil Health Registry</h2>
        <p>Monitor your soil's nutrient profile and get institutional-grade field insights.</p>
      </Header>

      <StatsGrid>
        <StatCard className="nitrogen">
          <h4>Nitrogen Level (N)</h4>
          <div className="value">{latest.nitrogen || '--'} mg/kg</div>
          <div className="status">{latest.nitrogen > 20 ? '✅ Optimal' : '⚠️ Low - Recommended: Urea'}</div>
        </StatCard>
        <StatCard className="ph">
          <h4>Acidity (pH)</h4>
          <div className="value">{latest.ph || '--'}</div>
          <div className="status">{latest.ph > 6 && latest.ph < 7.5 ? '✅ Balanced' : '⚠️ Correction Needed'}</div>
        </StatCard>
        <StatCard>
          <h4>Intelligence Insights</h4>
          <div className="value">{reports.length} Reports</div>
          <div className="status">Institutional History Verified</div>
        </StatCard>
      </StatsGrid>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>Historical Records</h3>
        <AddBtn onClick={() => setShowModal(true)}>+ New Soil Analysis</AddBtn>
      </div>

      {reports.map(report => (
        <ReportCard key={report._id}>
          <div className="details">
            <h3>{report.location || 'Primary Field'}</h3>
            <span>Analyzed on {new Date(report.testDate).toLocaleDateString()}</span>
          </div>
          <div className="metrics">
            <div><label>N</label><strong>{report.nitrogen}</strong></div>
            <div><label>P</label><strong>{report.phosphorus}</strong></div>
            <div><label>K</label><strong>{report.potassium}</strong></div>
            <div><label>pH</label><strong>{report.ph}</strong></div>
          </div>
        </ReportCard>
      ))}

      {showModal && (
        <Modal>
          <Form onSubmit={handleSubmit}>
            <h2>Register Soil Data</h2>
            <div className="grid">
              <div>
                <label>Nitrogen (N)</label>
                <input type="number" step="0.1" required value={formData.nitrogen} onChange={e => setFormData({...formData, nitrogen: e.target.value})} />
              </div>
              <div>
                <label>Phosphorus (P)</label>
                <input type="number" step="0.1" required value={formData.phosphorus} onChange={e => setFormData({...formData, phosphorus: e.target.value})} />
              </div>
              <div>
                <label>Potassium (K)</label>
                <input type="number" step="0.1" required value={formData.potassium} onChange={e => setFormData({...formData, potassium: e.target.value})} />
              </div>
              <div>
                <label>pH Level</label>
                <input type="number" step="0.1" value={formData.ph} onChange={e => setFormData({...formData, ph: e.target.value})} />
              </div>
            </div>
            <div>
              <label>Location / Field Name</label>
              <input type="text" placeholder="e.g. South Field" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <button type="submit">Submit for Analysis</button>
            <button type="button" className="cancel" onClick={() => setShowModal(false)}>Cancel Entry</button>
          </Form>
        </Modal>
      )}
    </Container>
  );
};

export default SoilRegistry;
