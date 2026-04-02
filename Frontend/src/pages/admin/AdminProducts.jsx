import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../../api";
import BulkUploadModal from "../../components/BulkUploadModal";
import { Button, GlassCard } from "../../styles/StyledComponents";

// ===== STYLED COMPONENTS =====
const PageContainer = styled.div`
  padding: var(--spacing-xxl);
  animation: entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  background: var(--bg-app);
  min-height: 100vh;
`;

const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xxl);
  flex-wrap: wrap;
  gap: var(--spacing-lg);
`;

const PageTitle = styled.h2`
  font-size: 3.5rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  small { font-size: 1rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7; }
`;

const SearchInput = styled.input`
  padding: 18px 24px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 700;
  width: 400px;
  color: var(--text-primary);
  transition: var(--transition-smooth);
  &:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 15px var(--accent-glow); }
  &::placeholder { color: var(--text-secondary); opacity: 0.4; }
`;

const TableCard = styled(GlassCard)`
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--border);
`;

const EliteTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  thead th {
    background: var(--primary);
    padding: 24px;
    text-align: left;
    font-size: 0.72rem;
    font-weight: 900;
    color: var(--text-inverse);
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }

  tbody td {
    padding: 24px;
    border-bottom: 1px solid var(--border);
    color: var(--text-primary);
    font-weight: 600;
  }

  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: var(--bg-surface-alt); }
`;

const Badge = styled.span`
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${p => p.$c === 'Fertilizer' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(245, 182, 17, 0.1)'};
  color: ${p => p.$c === 'Fertilizer' ? '#4CAF50' : '#F5B611'};
  border: 1px solid currentColor;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(13, 15, 12, 0.85);
  backdrop-filter: blur(40px);
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  animation: entrance 0.4s ease;
`;

const ModalPanel = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: 50px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-premium);
  position: relative;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  label { display: block; font-size: 0.75rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.1em; }
  input, select, textarea {
    width: 100%;
    padding: 18px;
    background: var(--bg-surface-alt);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    color: var(--text-primary);
    font-weight: 700;
    transition: var(--transition-smooth);
    &:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 15px var(--accent-glow); }
  }
`;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  const [form, setForm] = useState({ name: "", category: "Fertilizer", price: "", stock: "", unit: "per bag", description: "" });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showBulk, setShowBulk] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products?search=${search}${category !== 'All' ? `&category=${category}` : ''}`);
      setProducts(res.data.products || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [search, category]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/products/${confirmDelete}`);
      setConfirmDelete(null);
      fetchProducts();
    } catch (err) { alert("Deletion failure."); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach(k => {
        if (k !== 'images' && form[k] !== undefined && form[k] !== null) {
          formData.append(k, form[k]);
        }
      });
      if (form.images && form.images.length > 0) {
        for(let i = 0; i < form.images.length; i++) {
          formData.append('images', form.images[i]);
        }
      }
      
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      
      if (editing) await api.put(`/products/${editing}`, formData, config);
      else await api.post("/products", formData, config);
      
      setShowModal(false);
      fetchProducts();
    } catch (err) { alert("Registry update failure."); }
  };

  return (
    <PageContainer>
      <Topbar>
        <PageTitle>Inventory Logic <small>Institutional Asset Registry</small></PageTitle>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button onClick={() => { setEditing(null); setForm({ name: "", category: "Fertilizer", price: "", stock: "", unit: "per bag", description: "" }); setShowModal(true); }} primary>+ REGISTER ASSET</Button>
          <Button onClick={() => setShowBulk(true)} outline>📦 BULK INGEST</Button>
        </div>
      </Topbar>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', alignItems: 'center' }}>
        <SearchInput placeholder="Search institutional manifest..." value={search} onChange={e => setSearch(e.target.value)} />
        <input list="categories-list" value={category === 'All' ? '' : category} onChange={e => setCategory(e.target.value || 'All')} placeholder="All Classifications" style={{ padding: '18px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-primary)', fontWeight: 900, width: '250px' }} />
        <datalist id="categories-list">
          <option value="Fertilizer" />
          <option value="Seeds" />
          <option value="Sprays" />
          <option value="Crop Medicines" />
        </datalist>
      </div>

      {loading ? (
        <div style={{ padding: '100px', textAlign: 'center' }}>🔄 Initializing Operational Data...</div>
      ) : (
        <TableCard>
          <EliteTable>
            <thead>
              <tr>
                <th>Asset Identity</th>
                <th>Classification</th>
                <th>Institutional Rate</th>
                <th>Reserve Level</th>
                <th>Protocol Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td style={{ fontWeight: 900 }}>{p.name}</td>
                  <td><Badge $c={p.category}>{p.category}</Badge></td>
                  <td style={{ fontWeight: 900 }}>Rs. {p.price.toLocaleString()} <span style={{fontSize:'0.8rem', opacity:0.5}}>/ {p.unit}</span></td>
                  <td style={{ fontWeight: 900 }}>{p.stock} units</td>
                  <td>
                    <Button onClick={() => { setEditing(p._id); setForm(p); setShowModal(true); }} outline small style={{ marginRight: '8px' }}>Edit</Button>
                    <Button onClick={() => setConfirmDelete(p._id)} amber small>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </EliteTable>
        </TableCard>
      )}

      {showModal && (
        <ModalOverlay onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <ModalPanel>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>{editing ? 'Update Asset Registry' : 'Register New Asset'}</h3>
            <form onSubmit={handleSubmit}>
              <FormGroup><label>Asset Specification</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></FormGroup>
              <FormGroup><label>Asset Classification</label><input required list="categories-list" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Select from list or define new classification..." /></FormGroup>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <FormGroup><label>Pricing Baseline (Rs.)</label><input type="number" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></FormGroup>
                <FormGroup><label>Operational Reserve (Units)</label><input type="number" required value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} /></FormGroup>
              </div>
              <FormGroup><label>Asset Images</label><input type="file" multiple accept="image/*" onChange={e => setForm({ ...form, images: e.target.files })} style={{ padding: '14px' }} /></FormGroup>
              <FormGroup><label>Detailed Payload Description</label><textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></FormGroup>
              <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                <Button type="button" onClick={() => setShowModal(false)} outline style={{ flex: 1 }}>ABORT</Button>
                <Button type="submit" primary style={{ flex: 2 }}>AUTHORIZE REGISTRY</Button>
              </div>
            </form>
          </ModalPanel>
        </ModalOverlay>
      )}

      {confirmDelete && (
        <ModalOverlay onClick={() => setConfirmDelete(null)}>
          <ModalPanel style={{ maxWidth: '500px', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '24px' }}>⚠️</div>
            <h3 style={{ fontSize: '2rem', marginBottom: '12px' }}>Critical Authorization</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontWeight: 600 }}>Are you certain you wish to permanently purge this asset from the institutional registry?</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Button onClick={() => setConfirmDelete(null)} outline style={{ flex: 1 }}>ABORT</Button>
              <Button onClick={handleDelete} amber style={{ flex: 1 }}>AUTHORIZE REMOVAL</Button>
            </div>
          </ModalPanel>
        </ModalOverlay>
      )}

      {showBulk && <BulkUploadModal onClose={() => setShowBulk(false)} onRefresh={fetchProducts} />}
    </PageContainer>
  );
};

export default AdminProducts;
