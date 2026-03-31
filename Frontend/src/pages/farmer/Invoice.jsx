import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import api from "../../api";

const InvoiceContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 60px;
  background: white;
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
  font-family: 'Inter', sans-serif;
  color: #333;

  @media print {
    margin: 0;
    box-shadow: none;
    padding: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 60px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 40px;
`;

const Logo = styled.div`
  font-family: 'Fraunces', serif;
  font-size: 2rem;
  font-weight: 900;
  color: #2b3922;
  span { font-weight: 400; }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
`;

const InfoBox = styled.div`
  h4 {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #888;
    margin-bottom: 12px;
  }
  p {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 60px;

  th {
    text-align: left;
    padding: 15px;
    border-bottom: 2px solid #2b3922;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  td {
    padding: 20px 15px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 1rem;
  }
`;

const TotalSection = styled.div`
  margin-left: auto;
  width: 300px;
  .row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    font-weight: 600;
  }
  .grand-total {
    border-top: 2px solid #2b3922;
    margin-top: 10px;
    padding-top: 20px;
    font-size: 1.4rem;
    font-weight: 900;
    color: #2b3922;
  }
`;

const Footer = styled.div`
  margin-top: 100px;
  text-align: center;
  font-size: 0.85rem;
  color: #888;
  border-top: 1px solid #f0f0f0;
  padding-top: 40px;
`;

const PrintBtn = styled.button`
  position: fixed;
  bottom: 40px;
  right: 40px;
  background: #2b3922;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);

  @media print {
    display: none;
  }
`;

const Invoice = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data.order))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{padding:'100px', textAlign:'center'}}>Loading Document...</div>;
  if (!order) return <div style={{padding:'100px', textAlign:'center'}}>Order not found.</div>;

  return (
    <InvoiceContainer id="invoice">
      <Header>
        <Logo>🌾 Kisan<span>Store</span></Logo>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>INVOICE</h2>
          <p style={{ color: '#888' }}>INV-{order._id.substring(18).toUpperCase()}</p>
        </div>
      </Header>

      <InfoGrid>
        <InfoBox>
          <h4>ISSUED TO</h4>
          <p>{order.farmer?.first_name} {order.farmer?.last_name}</p>
          <p>{order.farmerPhone}</p>
          <p>{order.farmer?.address || "Registered Address on File"}</p>
          <p>{order.farmer?.city}</p>
        </InfoBox>
        <InfoBox style={{ textAlign: 'right' }}>
          <h4>DETAILS</h4>
          <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          <p>Pickup Date: {new Date(order.pickupDate).toLocaleDateString()}</p>
          <p>Status: {order.status}</p>
        </InfoBox>
      </InfoGrid>

      <Table>
        <thead>
          <tr>
            <th>Product Specification</th>
            <th style={{ textAlign: 'center' }}>Qty</th>
            <th style={{ textAlign: 'right' }}>Rate</th>
            <th style={{ textAlign: 'right' }}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i}>
              <td>
                <div style={{ fontWeight: 800 }}>{item.product?.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>{item.product?.category}</div>
              </td>
              <td style={{ textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right' }}>Rs. {item.price.toLocaleString()}</td>
              <td style={{ textAlign: 'right' }}>Rs. {(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <TotalSection>
        <div className="row">
          <span>Subtotal</span>
          <span>Rs. {order.totalAmount.toLocaleString()}</span>
        </div>
        <div className="row">
          <span>Tax (0%)</span>
          <span>Rs. 0</span>
        </div>
        <div className="row grand-total">
          <span>Total Paid</span>
          <span>Rs. {order.totalAmount.toLocaleString()}</span>
        </div>
      </TotalSection>

      <Footer>
        <p>This is a computer-generated institutional document and does not require a physical signature.</p>
        <p style={{ marginTop: '10px', fontWeight: 700 }}>© {new Date().getFullYear()} KisanStore Institutional Fertilizer & Seed Portal</p>
      </Footer>

      <PrintBtn onClick={() => window.print()}>🖨️ PRINT INVOICE</PrintBtn>
    </InvoiceContainer>
  );
};

export default Invoice;
