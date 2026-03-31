import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import api from "../../api";

const spin = keyframes`to { transform: rotate(360deg); }`;
const fadeIn = keyframes`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;

const PageContainer = styled.div`
  padding: 40px;
  animation: ${fadeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 54px;
`;

const Title = styled.h2`
  font-size: 3rem;
  color: var(--primary);
`;

const CreateBtn = styled.button`
  padding: 16px 32px;
  background: var(--text-charcoal);
  color: var(--white);
  border-radius: var(--radius-pill);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  &:hover { background: var(--primary); transform: translateY(-2px); }
`;

const TableCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--border-soft);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th { background: var(--primary); color: white; padding: 24px; text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
  td { padding: 24px; border-bottom: 1px solid var(--bg-cream); font-weight: 600; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(12px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: var(--white);
  padding: 60px;
  border-radius: var(--radius-card);
  width: 100%;
  max-width: 600px;
  box-shadow: var(--shadow-premium);
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  label { display: block; font-size: 0.8rem; font-weight: 800; color: var(--primary); margin-bottom: 8px; text-transform: uppercase; }
  input { width: 100%; padding: 18px; border: 1px solid var(--border-soft); border-radius: var(--radius-sm); font-size: 1rem; background: var(--bg-cream); }
`;

const AdminStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ first_name:'', last_name:'', email:'', password:'', phone:'' });
  const [saving, setSaving] = useState(false);

  const fetchStaff = () => {
    setLoading(true);
    api.get("/admin/staff")
      .then(res => setStaff(res.data.staff || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/admin/staff", form);
      setShowModal(false);
      setForm({ first_name:'', last_name:'', email:'', password:'', phone:'' });
      fetchStaff();
    } catch (err) {
      alert(err.response?.data?.message || "Creation failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer>
      <Topbar>
        <Title>Administrative Corps</Title>
        <CreateBtn onClick={() => setShowModal(true)}>Enlist New Staff</CreateBtn>
      </Topbar>

      {loading ? (
        <div style={{ textAlign:'center', padding:'100px' }}>Loading Personnel...</div>
      ) : (
        <TableCard>
          <Table>
            <thead>
              <tr>
                <th>Identity</th>
                <th>Digital Email</th>
                <th>Contact</th>
                <th>Access Level</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(s => (
                <tr key={s._id}>
                  <td>{s.first_name} {s.last_name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone || 'N/A'}</td>
                  <td><span style={{ background:'var(--accent)', color:'var(--primary)', padding:'4px 12px', borderRadius:'20px', fontSize:'0.7rem', fontWeight:800 }}>ADMINISTRATOR</span></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableCard>
      )}

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <Modal onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize:'2rem', color:'var(--primary)', marginBottom:'30px' }}>Provision New Admin</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
                <FormGroup>
                  <label>First Name</label>
                  <input required value={form.first_name} onChange={e => setForm({...form, first_name:e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <label>Last Name</label>
                  <input required value={form.last_name} onChange={e => setForm({...form, last_name:e.target.value})} />
                </FormGroup>
              </div>
              <FormGroup>
                <label>Institutional Email</label>
                <input type="email" required value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
              </FormGroup>
              <FormGroup>
                <label>Security Passphrase</label>
                <input type="password" required value={form.password} onChange={e => setForm({...form, password:e.target.value})} />
              </FormGroup>
              <FormGroup>
                <label>Direct Line</label>
                <input value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} />
              </FormGroup>
              <div style={{ display:'flex', gap:'16px', marginTop:'40px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex:1, padding:'18px', borderRadius:'40px', border:'1px solid var(--border-soft)', fontWeight:800 }}>Cancel</button>
                <CreateBtn type="submit" disabled={saving} style={{ flex:1 }}>{saving ? 'PROVISIONING...' : 'AUTHORIZE ENLISTMENT'}</CreateBtn>
              </div>
            </form>
          </Modal>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default AdminStaff;
