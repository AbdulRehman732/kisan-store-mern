import styled, { keyframes } from 'styled-components';

// ===== LAYOUT =====
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const PageContent = styled.div`
  padding: 30px 0 60px;
  min-height: calc(100vh - 70px);
`;

// ===== BUTTONS =====
export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: ${p => p.sm ? '6px 14px' : '10px 22px'};
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
  font-size: ${p => p.sm ? '0.82rem' : '0.9rem'};
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.25s ease;
  width: ${p => p.block ? '100%' : 'auto'};
  justify-content: ${p => p.block ? 'center' : 'flex-start'};
  background: ${p =>
    p.danger ? '#e53935' :
    p.amber ? '#f5a623' :
    p.outline ? 'transparent' :
    '#2d7a47'
  };
  color: ${p =>
    p.amber ? '#212121' :
    p.outline ? '#2d7a47' :
    'white'
  };
  border: ${p => p.outline ? '2px solid #2d7a47' : 'none'};
  opacity: ${p => p.disabled ? 0.6 : 1};
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};

  &:hover {
    background: ${p =>
      p.disabled ? '' :
      p.danger ? '#c62828' :
      p.amber ? '#d4891b' :
      p.outline ? '#2d7a47' :
      '#1a5c2e'
    };
    color: ${p => p.outline && !p.disabled ? 'white' : ''};
    transform: ${p => p.disabled ? 'none' : 'translateY(-1px)'};
    box-shadow: ${p => p.disabled ? 'none' : '0 4px 12px rgba(45,122,71,0.35)'};
  }
`;

// ===== CARDS =====
export const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.25s ease;
  border: 1px solid #eeeeee;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    transform: translateY(-2px);
  }
`;

// ===== BADGE =====
export const Badge = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${p =>
    p.pending ? '#fff3e0' :
    p.completed ? '#e8f5e9' :
    p.cancelled ? '#ffebee' :
    '#e8f5e9'
  };
  color: ${p =>
    p.pending ? '#e65100' :
    p.completed ? '#2e7d32' :
    p.cancelled ? '#c62828' :
    '#2e7d32'
  };
`;

// ===== ALERT =====
export const Alert = styled.div`
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${p => p.success ? '#e8f5e9' : '#ffebee'};
  color: ${p => p.success ? '#2e7d32' : '#c62828'};
  border: 1px solid ${p => p.success ? '#a5d6a7' : '#ef9a9a'};
`;

// ===== FORM =====
export const FormGroup = styled.div`
  margin-bottom: 18px;

  label {
    display: block;
    font-size: 0.87rem;
    font-weight: 700;
    color: #616161;
    margin-bottom: 7px;
  }

  input, select, textarea {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e0e0e0;
    border-radius: 10px;
    font-family: 'Nunito', sans-serif;
    font-size: 0.92rem;
    color: #212121;
    background: white;
    transition: all 0.25s ease;

    &:focus {
      outline: none;
      border-color: #2d7a47;
      box-shadow: 0 0 0 3px rgba(45,122,71,0.1);
    }
  }

  textarea {
    resize: vertical;
    min-height: 90px;
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

// ===== SPINNER =====
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const SpinnerWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

export const Spinner = styled.div`
  width: 42px;
  height: 42px;
  border: 4px solid #eeeeee;
  border-top-color: #2d7a47;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

// ===== EMPTY STATE =====
export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #9e9e9e;

  span { font-size: 3.5rem; display: block; margin-bottom: 12px; }
  h3 { font-size: 1.1rem; color: #616161; margin-bottom: 6px; }
  p { font-size: 0.88rem; }
`;

// ===== TABLE =====
export const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 16px;
  border: 1px solid #eeeeee;

  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    font-size: 0.88rem;
  }

  thead th {
    background: #fafafa;
    padding: 12px 16px;
    text-align: left;
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #9e9e9e;
    border-bottom: 2px solid #eeeeee;
  }

  tbody td {
    padding: 13px 16px;
    border-bottom: 1px solid #f5f5f5;
    vertical-align: middle;
  }

  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: #fafafa; }
`;

// ===== MODAL =====
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const Modal = styled.div`
  background: white;
  border-radius: 16px;
  padding: 28px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;

  h3 {
    font-size: 1.15rem;
    font-weight: 800;
    color: #212121;
  }
`;

export const ModalClose = styled.button`
  background: #f5f5f5;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;

  &:hover { background: #eeeeee; }
`;

// ===== SECTION TITLE =====
export const SectionTitle = styled.h1`
  font-family: 'Amiri', serif;
  font-size: 1.6rem;
  color: #1a5c2e;
  font-weight: 700;

  small {
    display: block;
    font-family: 'Nunito', sans-serif;
    font-size: 0.82rem;
    color: #9e9e9e;
    font-weight: 500;
    margin-top: 2px;
  }
`;