import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const Wrapper = styled.div`
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid var(--border-soft);
`;

const Title = styled.h3`
  font-size: 1.5rem;
  color: var(--primary);
  margin-bottom: 24px;
`;

const ReviewCard = styled.div`
  background: var(--bg-cream);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 16px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  span.name { font-weight: 800; color: var(--primary); }
  span.date { font-size: 0.8rem; color: var(--text-muted); }
`;

const Rating = styled.div`
  color: var(--accent);
  font-size: 1.1rem;
  margin-bottom: 12px;
`;

const Comment = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
`;

const Form = styled.form`
  margin-top: 32px;
  padding: 30px;
  background: var(--white);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
`;

const StarInput = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  button { 
    background: none; border: none; font-size: 2rem; cursor: pointer; 
    filter: ${p => p.active ? 'grayscale(0)' : 'grayscale(1)'};
    opacity: ${p => p.active ? 1 : 0.3};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 16px;
  border: 1px solid var(--border-soft);
  border-radius: 8px;
  min-height: 100px;
  margin-bottom: 16px;
  &:focus { outline: none; border-color: var(--primary); }
`;

const SubmitBtn = styled.button`
  padding: 14px 28px;
  background: var(--text-charcoal);
  color: var(--white);
  border-radius: var(--radius-pill);
  font-weight: 800;
  &:hover { background: var(--primary); }
  &:disabled { opacity: 0.5; }
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

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Authorize login to post reviews.");
    setLoading(true);
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment });
      setComment("");
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Review failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Community Ratings & Feedback</Title>
      
      {reviews.length === 0 ? (
        <p style={{ color:'var(--text-muted)' }}>No feedback available yet for this asset.</p>
      ) : (
        reviews.map(r => (
          <ReviewCard key={r._id}>
            <ReviewHeader>
              <span className="name">{r.farmer?.first_name} {r.farmer?.last_name}</span>
              <span className="date">{new Date(r.createdAt).toLocaleDateString()}</span>
            </ReviewHeader>
            <Rating>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</Rating>
            <Comment>{r.comment}</Comment>
          </ReviewCard>
        ))
      )}

      {user && (
        <Form onSubmit={handleSubmit}>
          <h4 style={{ marginBottom:'16px' }}>Provide Operational Feedback</h4>
          <StarInput>
            {[1,2,3,4,5].map(s => (
              <button key={s} type="button" active={rating >= s} onClick={() => setRating(s)}>⭐</button>
            ))}
          </StarInput>
          <Textarea 
            placeholder="Technical comments, crop results, quality notes..." 
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <SubmitBtn type="submit" disabled={loading}>Submit Review</SubmitBtn>
        </Form>
      )}
    </Wrapper>
  );
};

export default ReviewSection;
