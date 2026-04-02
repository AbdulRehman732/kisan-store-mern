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
  position: relative;
  label { display: block; font-size: 0.8rem; font-weight: 800; color: var(--primary); margin-bottom: 8px; text-transform: uppercase; }
  input, select { width: 100%; padding: 18px; border: 1px solid var(--border-soft); border-radius: var(--radius-sm); font-size: 1rem; background: var(--bg-cream); appearance: auto; }
`;

const EyeBtn = styled.button`
  position: absolute;
  right: 18px;
  bottom: 18px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--text-muted);
  &:hover { color: var(--primary); }
`;

const AdminStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ 
    first_name:'', last_name:'', email:'', password:'', phone:'', role: 'admin', 
    confirmAdminPassword:'' 
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchStaff = () => {
    setLoading(true);
    api.get("/admin/staff")
      .then(res => setStaff(res.data.staff || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStaff(); }, []);

  const getAvatarUrl = (s) => {
    if (!s.avatarUrl) return `https://ui-avatars.com/api/?name=${s.first_name}+${s.last_name}&background=1A2A12&color=fff`;
    if (s.avatarUrl.startsWith('http')) return s.avatarUrl;
    return `http://localhost:5000${s.avatarUrl}`;
  };

  const handleEdit = (s) => {
    setEditingId(s._id);
    setForm({ 
      first_name: s.first_name, 
      last_name: s.last_name, 
      email: s.email, 
      password: '', 
      phone: s.phone || '',
      role: s.role || 'admin',
      confirmAdminPassword: ''
    });
    setAvatarFile(null);
    setShowModal(true);
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setForm({ first_name:'', last_name:'', email:'', password:'', phone:'', role: 'admin', confirmAdminPassword:'' });
    setAvatarFile(null);
    setShowModal(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.confirmAdminPassword) {
      alert("Please enter YOUR admin password to authorize this action");
      return;
    }
    setSaving(true);

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (form[key]) formData.append(key, form[key]);
    });
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      if (editingId) {
        await api.put(`/admin/staff/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post("/admin/staff", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setShowModal(false);
      fetchStaff();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/staff/${confirmDelete._id}`);
      setConfirmDelete(null);
      fetchStaff();
    } catch (err) {
      alert(err.response?.data?.message || "Deletion failed");
      setConfirmDelete(null);
    }
  };

  return (
    <PageContainer>
      <Topbar>
        <Title>Administrative Corps</Title>
        <CreateBtn onClick={handleCreateNew}>Enlist New Staff</CreateBtn>
      </Topbar>

      {loading ? (
        <div style={{ textAlign:'center', padding:'100px' }}>Loading Personnel...</div>
      ) : (
        <TableCard>
          <div style={{ overflowX: 'auto' }}>
            <Table style={{ minWidth: '900px' }}>
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>Digital Email</th>
                  <th>Contact</th>
                  <th>Access Level</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(s => (
                  <tr key={s._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={getAvatarUrl(s)} 
                          alt="ID" 
                          style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover' }} 
                        />
                        <span>{s.first_name} {s.last_name}</span>
                      </div>
                    </td>
                    <td>{s.email}</td>
                    <td>{s.phone || 'N/A'}</td>
                    <td><span style={{ background:'var(--accent)', color:'var(--primary)', padding:'4px 12px', borderRadius:'20px', fontSize:'0.7rem', fontWeight:800 }}>{s.role?.toUpperCase() || 'ADMINISTRATOR'}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => handleEdit(s)}
                        style={{ background: 'var(--bg-cream)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '0.7rem', marginRight: '8px', border: 'none', cursor: 'pointer' }}
                      >
                        EDIT
                      </button>
                      <button 
                        onClick={() => setConfirmDelete(s)}
                        style={{ background: '#fdf2f0', color: '#d46a4f', padding: '6px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '0.7rem', border: 'none', cursor: 'pointer' }}
                      >
                        REMOVE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </TableCard>
      )}

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <Modal onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize:'2rem', color:'var(--primary)', marginBottom:'30px' }}>
              {editingId ? 'Update Personnel' : 'Enlist New Personnel'}
            </h3>
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
                <label>Access Level (Role)</label>
                <select value={form.role} onChange={e => setForm({...form, role:e.target.value})}>
                  <option value="admin">Administrator (Full Access)</option>
                  <option value="manager">Staff / Manager (Limited Scope)</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>Set New Staff Member's Password {editingId && <small>(Leave blank to keep current)</small>}</label>
                <div style={{ position: 'relative' }}>
                  <input placeholder="e.g. staff123" type={showPwd ? "text" : "password"} required={!editingId} value={form.password} onChange={e => setForm({...form, password:e.target.value})} />
                  <EyeBtn type="button" onClick={() => setShowPwd(!showPwd)}>{showPwd ? '👁️' : '🙈'}</EyeBtn>
                </div>
              </FormGroup>
              <FormGroup>
                <label>Direct Line</label>
                <input value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} />
              </FormGroup>
              <FormGroup>
                <label>Identity Photo (Local Storage Upload)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setAvatarFile(e.target.files[0])} 
                  style={{ padding: '12px' }}
                />
              </FormGroup>
              <div style={{ background: 'var(--bg-cream)', padding: '20px', borderRadius: '15px', border: '1px solid var(--border-soft)', marginBottom: '24px' }}>
                <FormGroup style={{ marginBottom: 0 }}>
                  <label style={{ color: '#d46a4f', fontSize: '0.85rem' }}>SECURITY CHECK: Enter YOUR CURRENT ADMIN Password</label>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', fontStyle: 'italic' }}>Prove your identity by typing your own admin password below.</p>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showConfirmPwd ? "text" : "password"} 
                      required 
                      placeholder="e.g. admin123"
                      value={form.confirmAdminPassword} 
                      onChange={e => setForm({...form, confirmAdminPassword:e.target.value})} 
                    />
                    <EyeBtn type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)}>{showConfirmPwd ? '👁️' : '🙈'}</EyeBtn>
                  </div>
                </FormGroup>
              </div>
              <div style={{ display:'flex', gap:'16px', marginTop:'40px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex:1, padding:'18px', borderRadius:'40px', border:'1px solid var(--border-soft)', fontWeight:800 }}>Cancel</button>
                <CreateBtn type="submit" disabled={saving} style={{ flex:1 }}>
                  {saving ? (editingId ? 'UPDATING...' : 'PROVISIONING...') : (editingId ? 'AUTHORIZE UPDATE' : 'AUTHORIZE ENLISTMENT')}
                </CreateBtn>
              </div>
            </form>
          </Modal>
        </ModalOverlay>
      )}

      {confirmDelete && (
        <ModalOverlay onClick={() => setConfirmDelete(null)}>
          <Modal onClick={e => e.stopPropagation()} style={{ maxWidth:'400px', textAlign:'center', padding:'40px' }}>
            <div style={{ fontSize:'3rem', marginBottom:'16px' }}>⚠️</div>
            <h3 style={{ color:'var(--primary)', fontSize:'1.5rem', marginBottom:'12px' }}>Authorize Personnel Removal</h3>
            <p style={{ color:'var(--text-muted)', marginBottom:'24px' }}>Are you sure you want to permanently revoke system access and remove <strong>{confirmDelete.first_name} {confirmDelete.last_name}</strong>?</p>
            <div style={{ display: "flex", gap: "16px" }}>
              <button 
                type="button" 
                style={{ flex:1, padding: '16px', background:'var(--bg-cream)', color:'var(--primary)', borderRadius:'var(--radius-pill)', fontWeight:800, border:'none', cursor:'pointer' }} 
                onClick={() => setConfirmDelete(null)}>
                CANCEL
              </button>
              <button 
                type="button" 
                style={{ flex:1, padding: '16px', background:'#d46a4f', color:'var(--white)', borderRadius:'var(--radius-pill)', fontWeight:800, border:'none', cursor:'pointer' }} 
                onClick={handleDelete}>
                CONFIRM PURGE
              </button>
            </div>
          </Modal>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default AdminStaff;
