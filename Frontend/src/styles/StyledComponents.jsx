import styled, { keyframes } from 'styled-components';

// ===== ANIMATIONS =====
const entrance = keyframes`
  from { opacity: 0; transform: translateY(15px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// ===== LAYOUT =====
export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
`;

export const PageContent = styled.div`
  padding: var(--spacing-xl) 0 var(--spacing-xxl);
  min-height: calc(100vh - 80px);
  animation: ${entrance} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

// ===== ELITE BUTTONS =====
export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: ${p => p.sm ? '10px 18px' : '16px 32px'};
  border-radius: var(--radius-pill);
  font-family: 'Inter', sans-serif;
  font-size: ${p => p.sm ? '0.75rem' : '0.85rem'};
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  cursor: pointer;
  border: 1px solid transparent;
  transition: var(--transition-smooth);
  width: ${p => p.block ? '100%' : 'auto'};
  
  background: ${p =>
    p.danger ? 'rgba(212, 106, 79, 0.1)' :
    p.amber ? 'var(--accent)' :
    p.outline ? 'transparent' :
    'var(--primary)'
  };
  
  color: ${p =>
    p.danger ? '#FF5252' :
    p.amber ? 'var(--text-inverse)' :
    p.outline ? 'var(--primary)' :
    'var(--text-inverse)'
  };
  
  border-color: ${p => 
    p.outline ? 'var(--primary)' : 
    p.danger ? '#FF5252' : 
    'transparent'
  };
  
  opacity: ${p => p.disabled ? 0.4 : 1};
  pointer-events: ${p => p.disabled ? 'none' : 'auto'};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${p => p.danger ? '0 10px 30px rgba(212, 106, 79, 0.2)' : 'var(--shadow-premium)'};
    background: ${p => p.outline ? 'var(--primary)' : ''};
    color: ${p => p.outline ? 'var(--text-inverse)' : ''};
    border-color: ${p => p.outline ? 'var(--primary)' : ''};
  }
`;

// ===== GLASS CARDS =====
export const Card = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
  overflow: hidden;
  transition: var(--transition-smooth);

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-premium);
    border-color: var(--accent);
  }
`;

export const GlassCard = styled(Card)`
  background: var(--glass);
  backdrop-filter: blur(40px);
  border-color: var(--border);
`;

// ===== INSTITUTIONAL BADGE =====
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid currentColor;
  
  background: ${p =>
    p.pending ? 'rgba(245, 182, 17, 0.1)' :
    p.completed ? 'rgba(76, 175, 80, 0.1)' :
    p.cancelled ? 'rgba(212, 106, 79, 0.1)' :
    'rgba(var(--primary-rgb), 0.1)'
  };
  
  color: ${p =>
    p.pending ? 'var(--accent)' :
    p.completed ? 'var(--primary)' :
    p.cancelled ? '#FF5252' :
    'var(--primary)'
  };
`;

// ===== PREMIUM ALERTS =====
export const Alert = styled.div`
  padding: 18px 24px;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 800;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid currentColor;
  
  background: ${p => p.success ? 'rgba(76, 175, 80, 0.1)' : 'rgba(212, 106, 79, 0.1)'};
  color: ${p => p.success ? '#4CAF50' : '#FF5252'};
`;

// ===== DATA-DENSE FORMS =====
export const FormGroup = styled.div`
  margin-bottom: 24px;

  label {
    display: block;
    font-size: 0.75rem;
    font-weight: 900;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 10px;
  }

  input, select, textarea {
    width: 100%;
    padding: 16px 20px;
    background: var(--bg-surface-alt);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    color: var(--text-primary);
    font-weight: 700;
    transition: var(--transition-smooth);

    &:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 15px var(--accent-glow);
    }
    
    &::placeholder { color: var(--text-secondary); opacity: 0.4; }
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

// ===== INSTITUTIONAL TABLE =====
export const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: var(--radius-card);
  border: 1px solid var(--border);
  background: var(--bg-surface);
  box-shadow: var(--shadow-subtle);

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  thead th {
    background: var(--bg-surface-alt);
    padding: 24px;
    text-align: left;
    font-size: 0.7rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--text-secondary);
    border-bottom: 1px solid var(--border);
  }

  tbody td {
    padding: 24px;
    border-bottom: 1px solid var(--border);
    color: var(--text-primary);
    font-weight: 700;
  }

  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover td { background: var(--bg-surface-alt); }
`;

// ===== ELITE MODAL =====
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(13, 15, 12, 0.85);
  backdrop-filter: blur(20px);
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  animation: ${entrance} 0.4s ease;
`;

export const Modal = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: 48px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-premium);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;

  h3 {
    font-size: 2rem;
    color: var(--text-primary);
  }
`;

// ===== TYPOGRAPHY =====
export const SectionTitle = styled.h2`
  font-family: 'Fraunces', serif;
  font-size: 3rem;
  color: var(--text-primary);
  letter-spacing: -0.02em;

  small {
    display: block;
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    color: var(--text-secondary);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 8px;
    opacity: 0.7;
  }
`;