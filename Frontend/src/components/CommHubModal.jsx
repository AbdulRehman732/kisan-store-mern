import React, { useState } from "react";
import styled from "styled-components";
import api from "../api";
import { Button, GlassCard } from "../styles/StyledComponents";

// ===== STYLED COMPONENTS =====
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(13, 15, 12, 0.85);
  backdrop-filter: blur(40px);
  z-index: 5000;
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
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--border);
  padding: 60px;
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

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 40px;
`;

const TemplateCard = styled.button`
  padding: 24px;
  border: 1px solid ${p => p.$active ? 'var(--primary)' : 'var(--border)'};
  background: ${p => p.$active ? 'rgba(76, 175, 80, 0.05)' : 'var(--bg-surface-alt)'};
  border-radius: 20px;
  text-align: left;
  cursor: pointer;
  transition: var(--transition-smooth);
  &:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: var(--shadow-subtle); }

  .icon { font-size: 2rem; margin-bottom: 16px; display: block; }
  .name { font-weight: 900; color: var(--text-primary); font-size: 0.9rem; display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
  .desc { font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; line-height: 1.5; }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  label { display: block; font-size: 0.75rem; font-weight: 900; color: var(--text-secondary); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.1em; }
  input, textarea {
    width: 100%;
    padding: 18px;
    border: 1px solid var(--border);
    border-radius: 12px;
    font-size: 1rem;
    background: var(--bg-surface-alt);
    color: var(--text-primary);
    font-weight: 700;
    transition: var(--transition-smooth);
    &:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 15px var(--accent-glow); }
  }
`;

const ActionRow = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 48px;
`;

const WhatsAppBtn = styled(Button)`
  background: #25D366;
  color: white;
  &:hover { background: #128C7E; transform: translateY(-3px); box-shadow: 0 10px 30px rgba(37, 211, 102, 0.2); }
`;

const CommHubModal = ({ order, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const farmerName = `${order.farmer?.first_name || ''} ${order.farmer?.last_name || ''}`;
  const orderId = order._id.slice(-8).toUpperCase();
  const balance = (order.grandTotal || 0) - (order.amountPaid || 0);

  const templates = [
    {
      id: 'payment',
      icon: '🏛️',
      name: 'Balance Settlement',
      desc: 'Institutional payment reminder for outstanding fiscal dues.',
      subject: `Strategic Payment Verification Required: Order #${orderId}`,
      text: `Respected ${farmerName},\n\nThis is an institutional notification regarding your recent procurement #${orderId}. Our records indicate an outstanding balance of Rs. ${balance.toLocaleString()}.\n\nPlease ensure settlement at your earliest convenience to maintain your high-fidelity stakeholder rating.\n\nRegards,\nAgrotek Elite Operational Authority`
    },
    {
      id: 'ready',
      icon: '🛡️',
      name: 'Collection Alert',
      desc: 'Notify stakeholder that assets are ready for tactical collection.',
      subject: `Procurement Mobilization Authorized: #${orderId}`,
      text: `Respected ${farmerName},\n\nYour agricultural assets under Order #${orderId} have been staged for collection at our central logistics hub.\n\nPlease visit within operational hours for institutional dispatch and verification.\n\nRegards,\nAgrotek Elite Administrative Unit`
    }
  ];

  const applyTemplate = (t) => {
    setSelectedTemplate(t.id);
    setSubject(t.subject);
    setMessage(t.text);
  };

  const handleSendEmail = async () => {
    setLoading(true);
    try {
      await api.post('/auth/send-template-email', {
        email: order.farmer?.email,
        subject,
        text: message
      });
      alert('Institutional correspondence dispatched successfully.');
      onClose();
    } catch (err) {
      alert('Communication failure: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const encodedMsg = encodeURIComponent(message);
    const phone = order.farmer?.phone?.[0] || order.farmerPhone;
    window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');
  };

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalPanel onClick={e => e.stopPropagation()}>
        <CloseBtn onClick={onClose}>✕</CloseBtn>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '8px' }}>Communication Hub</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Institutional Stakeholder Outreach: ORDER #{orderId}</p>
        </div>

        <TemplateGrid>
          {templates.map(t => (
            <TemplateCard 
              key={t.id} 
              $active={selectedTemplate === t.id}
              onClick={() => applyTemplate(t)}
            >
              <span className="icon">{t.icon}</span>
              <span className="name">{t.name}</span>
              <span className="desc">{t.desc}</span>
            </TemplateCard>
          ))}
        </TemplateGrid>

        <FormGroup>
          <label>Institutional Subject</label>
          <input 
            value={subject} 
            onChange={e => setSubject(e.target.value)} 
            placeholder="Authorized transmission subject..."
          />
        </FormGroup>

        <FormGroup>
          <label>Message Content (Dynamic Asset Injection)</label>
          <textarea 
            rows={7}
            value={message} 
            onChange={e => setMessage(e.target.value)} 
            placeholder="Compose operational correspondence..."
          />
        </FormGroup>

        <ActionRow>
          <Button onClick={handleSendEmail} disabled={loading || !message} primary style={{ flex: 1.5 }}>
             📩 {loading ? 'TRANSMITTING...' : 'DISPATCH SECURE EMAIL'}
          </Button>
          <WhatsAppBtn onClick={handleWhatsApp} disabled={!message} style={{ flex: 1 }}>
             🟢 WHATSAPP LINK
          </WhatsAppBtn>
        </ActionRow>
      </ModalPanel>
    </Overlay>
  );
};

export default CommHubModal;
