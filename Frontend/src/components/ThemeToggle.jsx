import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const ToggleBase = styled.button`
  width: 64px;
  height: 32px;
  border-radius: var(--radius-pill);
  background: var(--bg-surface-alt);
  border: 1px solid var(--border);
  position: relative;
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  padding: 0 4px;
  overflow: hidden;
  box-shadow: var(--shadow-inner);

  &:hover {
    border-color: var(--accent);
    box-shadow: 0 0 15px var(--accent-glow);
  }
`;

const Knob = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.$active ? 'var(--accent)' : 'var(--primary)'};
  transition: var(--transition-smooth);
  transform: translateX(${props => props.$active ? '30px' : '0'});
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
`;

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <ToggleBase onClick={toggleTheme} title={isDarkMode ? 'Switch to Daylight' : 'Switch to Nocturnal'}>
      <Knob $active={isDarkMode}>
        {isDarkMode ? '🌙' : '☀️'}
      </Knob>
    </ToggleBase>
  );
};

export default ThemeToggle;
