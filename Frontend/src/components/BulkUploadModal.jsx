import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Button, GlassCard } from "../styles/StyledComponents";

// ===== STYLED COMPONENTS =====
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(13, 15, 12, 0.85);
  backdrop-filter: blur(40px);
  z-index: 6000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  animation: entrance 0.4s ease forwards;
`;

const ModalPanel = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  width: 100%;
  max-width: 650px;
  padding: 50px;
  position: relative;
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--border);
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--bg-surface-alt);
  color: var(--text-primary);
  font-size: 1.2rem;
  border: 1px solid var(--border);
  transition: var(--transition-smooth);
  &:hover { transform: rotate(90deg); background: var(--accent); color: var(--text-inverse); }
`;

const Title = styled.h2`
  color: var(--text-primary);
  margin-bottom: 12px;
  font-size: 2.2rem;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  margin-bottom: 40px;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.6;
`;

const DropZone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  border: 2px dashed var(--border);
  border-radius: 24px;
  background: var(--bg-surface-alt);
  cursor: pointer;
  transition: var(--transition-smooth);
  &:hover { border-color: var(--primary); background: var(--bg-surface); transform: translateY(-5px); box-shadow: var(--shadow-subtle); }
  input { display: none; }
`;

const UploadIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 20px;
  opacity: 0.8;
`;

const FileName = styled.div`
  margin-top: 16px;
  font-weight: 900;
  color: var(--primary);
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  padding: 8px 16px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: var(--radius-pill);
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 40px;
`;

const ActionBtn = styled(Button)`
  flex: 1;
`;

const StatusReport = styled.div`
  margin-top: 24px;
  padding: 18px 24px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 800;
  border: 1px solid currentColor;
  background: ${p => p.$error ? 'rgba(212, 106, 79, 0.1)' : 'rgba(76, 175, 80, 0.1)'};
  color: ${p => p.$error ? '#FF5252' : '#4CAF50'};
`;

const BulkUploadModal = ({ onClose, onRefresh }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setStatus(null);
    } else {
      setStatus({ type: 'error', message: 'ERROR: INVALID ASSET SPECIFICATION (CSV REQUIRED)' });
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await axios.post('/api/products/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      setStatus({ type: 'success', message: `INGESTION COMPLETE: ${data.message}` });
      setTimeout(() => {
        onRefresh();
        onClose();
      }, 2000);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'INGESTION FAILURE: PROTOCOL REJECTED DATA FORMAT' 
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = 'name,category,price,taxAmount,stock,unit,brand,description,featured,crops,tags,image\n';
    const example = 'Premium Nitrogen,Fertilizer,2500,100,50,per bag,AgroPack,High quality nitrogen fertilizer,true,"Wheat, Rice","Top Seller, Organic",/uploads/example.webp';
    const blob = new Blob([headers + example], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agrotek_products_manifest.csv';
    a.click();
  };

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalPanel>
        <CloseBtn onClick={onClose}>✕</CloseBtn>
        <Title>Institutional Ingestion</Title>
        <Subtitle>Deploy high-fidelity asset data via CSV manifest to synchronize global inventory ledgers.</Subtitle>
        
        <DropZone>
          <UploadIcon>📁</UploadIcon>
          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {file ? 'MANIFEST AUTHENTICATED' : 'CLICK TO LOAD ASSET MANIFEST'}
          </span>
          {file && <FileName>{file.name}</FileName>}
          <input type="file" accept=".csv" onChange={handleFileChange} />
        </DropZone>

        {status && <StatusReport $error={status.type === 'error'}>{status.message}</StatusReport>}

        <ModalFooter>
          <Button onClick={downloadTemplate} outline style={{ flex: 1 }}>EXPORT MANIFEST TEMPLATE</Button>
          <ActionBtn 
            onClick={handleUpload} 
            disabled={!file || loading}
            primary
          >
            {loading ? 'INGESTING...' : 'AUTHORIZE BULK IMPORT'}
          </ActionBtn>
        </ModalFooter>
      </ModalPanel>
    </Overlay>
  );
};

export default BulkUploadModal;
