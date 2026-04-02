import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import styled from 'styled-components';

// ===== STYLED COMPONENTS =====
const ChartContainer = styled.div`
  width: 100%;
  height: 320px;
  margin-top: 32px;
  background: var(--bg-surface);
  padding: 32px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
`;

const Title = styled.h4`
  font-size: 0.85rem;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  span { font-size: 1.2rem; }
`;

const TooltipWrapper = styled.div`
  background: var(--primary);
  color: var(--text-inverse);
  padding: 12px 18px;
  border-radius: 12px;
  box-shadow: var(--shadow-premium);
  font-size: 0.85rem;
  font-weight: 900;
  border: 1px solid rgba(255,255,255,0.1);
  
  p { margin: 0; }
  .label { opacity: 0.6; font-size: 0.7rem; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
`;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <TooltipWrapper>
        <p>Rs. {payload[0].value.toLocaleString()}</p>
        <p className="label">{new Date(payload[0].payload.date).toLocaleDateString()}</p>
      </TooltipWrapper>
    );
  }
  return null;
};

const PriceTrendChart = ({ history = [] }) => {
  // Format and sort data for Recharts analytical visualization
  const data = history.map(item => ({
    date: item.date,
    price: item.price,
    label: new Date(item.date).toLocaleDateString('en-PK', { month: 'short' }).toUpperCase()
  })).sort((a,b) => new Date(a.date) - new Date(b.date));

  return (
    <ChartContainer>
      <Title><span>📊</span> Analytical Market Trajectory (Last 6 Months)</Title>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 900, letterSpacing: '0.1em' }}
          />
          <YAxis 
            hide 
            domain={['dataMin - 200', 'dataMax + 200']}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--accent)', strokeWidth: 1 }} />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="var(--accent)" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            animationDuration={2000}
            strokeLinecap="round"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PriceTrendChart;
