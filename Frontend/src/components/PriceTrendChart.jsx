import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 24px;
  background: var(--white);
  padding: 20px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-soft);
`;

const ChartTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  span { font-size: 1.2rem; }
`;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        background: 'var(--primary)', 
        color: 'white', 
        padding: '10px 15px', 
        borderRadius: '8px',
        boxShadow: 'var(--shadow-premium)',
        fontSize: '0.85rem',
        fontWeight: 700
      }}>
        <p style={{ margin: 0 }}>Price: Rs. {payload[0].value.toLocaleString()}</p>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '0.7rem' }}>
          {new Date(payload[0].payload.date).toLocaleDateString()}
        </p>
      </div>
    );
  }
  return null;
};

const PriceTrendChart = ({ history = [] }) => {
  // Format data for Recharts
  const data = history.map(item => ({
    date: item.date,
    price: item.price,
    label: new Date(item.date).toLocaleDateString('en-PK', { month: 'short' })
  })).sort((a,b) => new Date(a.date) - new Date(b.date));

  return (
    <ChartContainer>
      <ChartTitle><span>📉</span> Seasonal Market Trend (Last 6 Months)</ChartTitle>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-soft)" />
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }}
          />
          <YAxis 
            hide 
            domain={['dataMin - 100', 'dataMax + 100']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="var(--accent)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PriceTrendChart;
