import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { Button, GlassCard } from "../styles/StyledComponents";

// ===== STYLED COMPONENTS =====
const Wrapper = styled.div`
  margin-top: 60px;
  padding-top: 60px;
  border-top: 1px solid var(--border);
`;

const Title = styled.h3`
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 32px;
  letter-spacing: -0.02em;
`;

const ReviewCard = styled.div`
  background: var(--bg-surface-alt);
  padding: 32px;
  border-radius: var(--radius-md);
  margin-bottom: 24px;
  border: 1px solid var(--border);
  transition: var(--transition-smooth);
  
  &:hover { border-color: var(--accent); transform: translateX(8px); }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  .author {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 900;
    color: var(--text-primary);
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
  }
  
  .date { font-size: 0.75rem; color: var(--text-secondary); font-weight: 700; opacity: 0.6; }
`;

const StarRating = styled.div`
  color: var(--accent);
  font-size: 1.1rem;
  margin-bottom: 16px;
  letter-spacing: 2px;
`;

const Comment = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-secondary);
  font-weight: 600;
`;

const FeedbackForm = styled.form`
  margin-top: 48px;
  padding: 48px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-subtle);
`;

const StarInput = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 32px;
  
  button { 
    background: none; border: none; font-size: 2.5rem; cursor: pointer; 
    transition: var(--transition-smooth);
    opacity: ${p => p.$active ? 1 : 0.2};
    filter: ${p => p.$active ? 'none' : 'grayscale(1)'};
    &:hover { transform: scale(1.2); opacity: 1; }
  }
`;

const ResponseField = styled.textarea`
  width: 100%;
  padding: 24px;
  background: var(--bg-surface-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 700;
  min-height: 140px;
  margin-bottom: 32px;
  transition: var(--transition-smooth);
  
  &:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 15px var(--accent-glow); }
  &::placeholder { color: var(--text-secondary); opacity: 0.4; }
`;

const ReviewSection = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReviews = () => {
    api.get(`/products/${productId}/reviews`)
      .then(res => setReviews(res.data.reviews || []))
      .catch(console.error);
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Strategic Authorization required for feedback submission.");
    setLoading(true);
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment });
      setComment("");
      fetchReviews();
    } catch (err) { alert(err.response?.data?.message || "Operational communication failure."); } 
    finally { setLoading(false); }
  };

  return (
    <Wrapper>
      <Title>Stakeholder Feedback Ledger</Title>
      
      {reviews.length === 0 ? (
        <p style={{ color:'var(--text-secondary)', fontWeight: 700, fontStyle: 'italic' }}>No operational feedback currently registered for this asset.</p>
      ) : (
        reviews.map(r => (
          <ReviewCard key={r._id}>
            <ReviewHeader>
              <div className="author">
                <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem' }}>
                  {r.farmer?.first_name?.[0]}{r.farmer?.last_name?.[0]}
                </div>
                <span>{r.farmer?.first_name} {r.farmer?.last_name}</span>
              </div>
              <span className="date">Authenticated on {new Date(r.createdAt).toLocaleDateString()}</span>
            </ReviewHeader>
            <StarRating>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</StarRating>
            <Comment>{r.comment}</Comment>
          </ReviewCard>
        ))
      )}

      {user && (
        <FeedbackForm onSubmit={handleSubmit}>
          <h4 style={{ marginBottom: '24px', fontSize: '1.2rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 900 }}>Authorize Operational Review</h4>
          <StarInput>
            {[1,2,3,4,5].map(s => (
              <button key={s} type="button" $active={rating >= s} onClick={() => setRating(s)}>🌟</button>
            ))}
          </StarInput>
          <ResponseField 
            placeholder="Document your technical results, yield observations, or asset performance notes..." 
            value={comment}
            onChange={e => setComment(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} block primary>
            {loading ? "TRANSMITTING..." : "COMMIT FEEDBACK TO LOG"}
          </Button>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ⚠️ Feedback will be visible to institutional personnel.
          </p>
        </FeedbackForm>
      )}
    </Wrapper>
  );
};

export default ReviewSection;
