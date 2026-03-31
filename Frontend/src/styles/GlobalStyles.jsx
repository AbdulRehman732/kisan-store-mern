import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Inter:wght@100..900&display=swap');

  :root {
    --primary: #1A2A12;       /* Deeper Forest Green */
    --primary-light: #2c4222;
    --accent: #F5B611;        /* Harvest Gold */
    --accent-hover: #D9A10F;
    --bg-cream: #FAF9F6;      /* Silk Cream - Brighter and cleaner */
    --text-charcoal: #121212; 
    --text-muted: #5F6368;
    --white: #ffffff;
    --border-soft: rgba(0,0,0,0.06);
    --glass: rgba(255, 255, 255, 0.7);
    --shadow-premium: 0 40px 100px rgba(26, 42, 18, 0.08); /* Massive soft shadow */
    --shadow-card: 0 20px 60px rgba(0, 0, 0, 0.04);
    --radius-pill: 100px;
    --radius-card: 40px;
    --radius-sm: 16px;
    --transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
    --gradient-gold: linear-gradient(135deg, #F5B611 0%, #FFD700 100%);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-cream);
    color: var(--text-charcoal);
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Fraunces', serif;
    font-weight: 900;
    line-height: 1.1;
    color: var(--primary);
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: var(--transition);
  }

  button {
    cursor: pointer;
    font-family: inherit;
    border: none;
    outline: none;
    background: none;
    transition: var(--transition);
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: var(--bg-cream);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 10px;
  }

  /* Utility Classes */
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 30px;
  }

  .pill-label {
    display: inline-block;
    padding: 6px 16px;
    background: rgba(245, 182, 17, 0.15);
    color: var(--accent-hover);
    border-radius: var(--radius-pill);
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  /* Animation Keyframes */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default GlobalStyles;