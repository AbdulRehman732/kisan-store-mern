import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Inter:wght@100..900&display=swap');

  :root {
    /* Transitions */
    --transition-fast: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    --transition-smooth: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    --transition-slow: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    
    /* Radii */
    --radius-pill: 100px;
    --radius-card: 32px;
    --radius-lg: 24px;
    --radius-md: 16px;
    --radius-sm: 8px;

    /* Spacing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-xxl: 64px;
  }

  body[data-theme='light'] {
    --bg-app: #FAF9F6;              /* Silk Cream */
    --bg-surface: #FFFFFF;
    --bg-surface-alt: #F0EEE9;
    --text-primary: #1A2A12;        /* Emerald Deep */
    --text-secondary: #5F6368;
    --text-inverse: #FFFFFF;
    --primary: #1A2A12;
    --primary-light: #2c4222;
    --accent: #F5B611;              /* Radiant Gold */
    --accent-glow: rgba(245, 182, 17, 0.4);
    --border: rgba(0, 0, 0, 0.06);
    --glass: rgba(255, 255, 255, 0.7);
    --glass-heavy: rgba(255, 255, 255, 0.85);
    --shadow-subtle: 0 4px 20px rgba(0, 0, 0, 0.03);
    --shadow-premium: 0 40px 100px rgba(26, 42, 18, 0.08);
    --shadow-inner: inset 0 2px 4px rgba(0,0,0,0.02);
  }

  body[data-theme='dark'] {
    --bg-app: #0D0F0C;              /* Nocturnal Deep */
    --bg-surface: #151813;
    --bg-surface-alt: #1E221B;
    --text-primary: #EAECE8;
    --text-secondary: #9AA0A6;
    --text-inverse: #0D0F0C;
    --primary: #4CAF50;             /* Vibrant Emerald for Dark */
    --primary-light: #81C784;
    --accent: #FFD54F;              /* Bright Gold for Dark */
    --accent-glow: rgba(255, 213, 79, 0.3);
    --border: rgba(255, 255, 255, 0.08);
    --glass: rgba(21, 24, 19, 0.7);
    --glass-heavy: rgba(21, 24, 19, 0.9);
    --shadow-subtle: 0 4px 20px rgba(0, 0, 0, 0.2);
    --shadow-premium: 0 40px 100px rgba(0, 0, 0, 0.5);
    --shadow-inner: inset 0 2px 40px rgba(255,255,255,0.01);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-app);
    color: var(--text-primary);
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    transition: background-color 0.4s ease, color 0.4s ease;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    line-height: 1.1;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  a, button {
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    transition: var(--transition-smooth);
  }

  button {
    font-family: inherit;
    border: none;
    outline: none;
    background: none;
  }

  input, select, textarea {
    font-family: inherit;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: var(--bg-app);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 10px;
    border: 2px solid var(--bg-app);
  }

  /* Shared Components */
  .glass-layer {
    background: var(--glass);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-premium);
  }

  .elite-card {
    background: var(--bg-surface);
    border-radius: var(--radius-card);
    border: 1px solid var(--border);
    transition: var(--transition-smooth);
    box-shadow: var(--shadow-subtle);
    overflow: hidden;
    
    &:hover {
      transform: translateY(-8px) scale(1.01);
      box-shadow: var(--shadow-premium);
      border-color: var(--accent);
    }
  }

  /* Global Animations */
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  @keyframes entrance {
    from { opacity: 0; transform: translateY(30px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .animate-entrance {
    animation: entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @media (max-width: 1024px) {
    :root { --radius-card: 24px; }
  }

  @media (max-width: 768px) {
    :root { --radius-card: 20px; }
    h1 { font-size: 2.5rem !important; }
  }
`;

export default GlobalStyles;