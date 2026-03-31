import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import api from "../../api";

const fadeIn = keyframes`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;

const PageContainer = styled.div`
  padding: 40px;
  animation: ${fadeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Title = styled.h2`
  font-size: 3rem;
  color: var(--primary);
  margin-bottom: 48px;
`;

const ReviewCard = styled.div`
  background: var(--white);
  padding: 32px;
  border-radius: var(--radius-card);
  margin-bottom: 24px;
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--border-soft);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
`;

const Content = styled.div`
  flex: 1;
  .product { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent); font-weight: 800; margin-bottom: 8px; }
  .name { font-size: 1.2rem; font-weight: 800; color: var(--primary); margin-bottom: 4px; }
  .rating { color: var(--accent); margin-bottom: 12px; font-size: 1.1rem; }
  .text { font-size: 1rem; line-height: 1.6; color: var(--text-charcoal); }
  .date { font-size: 0.75rem; color: var(--text-muted); margin-top: 16px; }
`;

const DeleteBtn = styled.button`
  padding: 12px 24px;
  border-radius: 40px;
  background: #fdf2f0;
  color: #d46a4f;
  font-weight: 800;
  font-size: 0.75rem;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  &:hover { background: #d46a4f; color: white; }
`;

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    setLoading(true);
    api.get("/admin/reviews")
      .then(res => setReviews(res.data.reviews || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (productId, reviewId) => {
    if (!window.confirm("Authorize permanent removal of this feedback?")) return;
    try {
      await api.delete(`/admin/products/${productId}/reviews/${reviewId}`);
      fetchReviews();
    } catch (err) {
      alert("Removal failed");
    }
  };

  return (
    <PageContainer>
      <Title>Community Feedback Moderation</Title>
      
      {loading ? (
        <div style={{ textAlign:'center', padding:'100px' }}>Analyzing Digital Sentiment...</div>
      ) : reviews.length === 0 ? (
        <p>No community feedback records found in the database.</p>
      ) : (
        reviews.map(r => (
          <ReviewCard key={r._id}>
            <Content>
              <div className="product">{r.productName}</div>
              <div className="name">{r.farmer?.first_name} {r.farmer?.last_name}</div>
              <div className="rating">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
              <p className="text">{r.comment}</p>
              <div className="date">{new Date(r.createdAt).toLocaleString()}</div>
            </Content>
            <DeleteBtn onClick={() => handleDelete(r.productId, r._id)}>Remove Review</DeleteBtn>
          </ReviewCard>
        ))
      )}
    </PageContainer>
  );
};

export default AdminReviews;
