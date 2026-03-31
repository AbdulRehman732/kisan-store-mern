import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import api from "../../api";

// ===== ANIMATIONS =====
const spin = keyframes`to { transform: rotate(360deg); }`;
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

// ===== STYLED COMPONENTS =====
const PageContainer = styled.div`
  padding: 40px;
  animation: ${fadeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 54px;
  flex-wrap: wrap;
  gap: 24px;
`;

const PageTitle = styled.h2`
  font-size: 3rem;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 16px;
  small { font-size: 1rem; color: var(--text-muted); font-weight: 500; font-family: 'Inter', sans-serif; }
`;

const CountBadge = styled.span`
  background: var(--bg-cream);
  color: var(--primary);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-pill);
  padding: 6px 18px;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const AddBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  background: var(--text-charcoal);
  color: var(--white);
  border: none;
  border-radius: var(--radius-pill);
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-premium);

  &:hover { background: var(--primary); transform: translateY(-3px); }
`;

const BulkUploadBtn = styled(AddBtn)`
  background: var(--bg-cream);
  color: var(--primary);
  border: 1px solid var(--border-soft);
  box-shadow: none;
  &:hover { background: var(--white); border-color: var(--primary); }
`;

const SearchInput = styled.input`
  padding: 18px 28px;
  background: var(--white);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 600;
  width: 320px;
  margin-bottom: 32px;
  transition: var(--transition);
  &:focus { outline: none; border-color: var(--primary); box-shadow: var(--shadow-premium); }
  &::placeholder { color: var(--text-muted); opacity: 0.5; }
`;

const AlertBanner = styled.div`
  background: ${(p) => (p.warning ? "var(--bg-cream)" : "#fdf2f0")};
  border: 1px solid ${(p) => (p.warning ? "var(--accent)" : "#f5c6cb")};
  color: ${(p) => (p.warning ? "var(--primary)" : "#721c24")};
  border-radius: var(--radius-sm);
  padding: 16px 24px;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TableWrapper = styled.div`
  background: var(--white);
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--border-soft);
  overflow-x: auto;

  table { width: 100%; border-collapse: collapse; }

  thead th {
    background: var(--primary);
    padding: 24px 32px;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--white);
  }

  tbody td {
    padding: 24px 32px;
    border-bottom: 1px solid var(--bg-cream);
    color: var(--text-charcoal);
    font-weight: 600;
  }

  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: var(--bg-cream); }
`;

const ProductImg = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: var(--bg-cream);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  overflow: hidden;
  border: 1px solid var(--border-soft);
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const CategoryBadge = styled.span`
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${(p) => (p.$category === "Fertilizer" ? "var(--bg-cream)" : "var(--accent)")};
  color: var(--primary);
  border: 1px solid var(--border-soft);
`;

const StockBadge = styled.span`
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${(p) => (p.$stock === 0 ? "#fdf2f0" : p.$stock <= 10 ? "var(--accent)" : "rgba(43,57,34,0.05)")};
  color: ${(p) => (p.$stock === 0 ? "#d46a4f" : "var(--primary)")};
  border: 1px solid ${(p) => (p.$stock === 0 ? "#f5c6cb" : "var(--border-soft)")};
`;

const ActionBtn = styled.button`
  padding: 10px 18px;
  border-radius: var(--radius-pill);
  font-weight: 800;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid var(--border-soft);
  background: ${(p) => (p.danger ? "var(--white)" : "var(--white)")};
  color: ${(p) => (p.danger ? "#d46a4f" : "var(--primary)")};
  margin-right: 12px;

  &:hover {
    background: ${(p) => (p.danger ? "#d46a4f" : "var(--primary)")};
    color: var(--white);
    transform: translateY(-2px);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(43, 57, 34, 0.4);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const Modal = styled.div`
  background: var(--white);
  border-radius: var(--radius-card);
  padding: 60px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-premium);
  animation: ${fadeIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid var(--border-soft);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
`;

const ModalTitle = styled.h3`
  font-size: 2.2rem;
  color: var(--primary);
  letter-spacing: -0.02em;
`;

const CloseBtn = styled.button`
  background: var(--bg-cream);
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  color: var(--primary);
  &:hover { transform: rotate(90deg); background: var(--accent); }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;

  label {
    display: block;
    font-size: 0.75rem;
    font-weight: 800;
    color: var(--primary);
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  input, select, textarea {
    width: 100%;
    padding: 16px 20px;
    border: 1px solid var(--bg-cream);
    background: var(--bg-cream);
    border-radius: var(--radius-sm);
    font-size: 1rem;
    color: var(--text-charcoal);
    font-weight: 600;
    transition: var(--transition);
    &:focus { outline: none; border-color: var(--primary); background: var(--white); }
  }

  textarea { min-height: 120px; resize: vertical; }
`;

const CheckboxLabel = styled.label`
  display: flex !important;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0 !important;
  input { width: 22px !important; height: 22px !important; accent-color: var(--primary); }
`;

const Alert = styled.div`
  padding: 20px 24px;
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 32px;
  background: ${(p) => (p.success ? "var(--bg-cream)" : "#fdf2f0")};
  color: ${(p) => (p.success ? "var(--primary)" : "#d46a4f")};
  border: 1px solid ${(p) => (p.success ? "var(--border-soft)" : "#f5c6cb")};
`;

const BtnRow = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 24px;
`;

const CancelBtn = styled.button`
  flex: 1;
  padding: 20px;
  background: var(--bg-cream);
  color: var(--primary);
  border: none;
  border-radius: var(--radius-pill);
  font-weight: 800;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: var(--transition);
  &:hover { background: var(--white); border: 1px solid var(--primary); }
`;

const SubmitBtn = styled.button`
  flex: 2;
  padding: 20px;
  background: var(--text-charcoal);
  color: var(--white);
  border: none;
  border-radius: var(--radius-pill);
  font-weight: 800;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: var(--transition);
  &:hover { background: var(--primary); transform: translateY(-3px); }
  &:disabled { opacity: 0.5; }
`;

const ProductCell = styled.div`
  display: flex !important;
  align-items: center;
  gap: 18px;
`;

const SpinnerWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid var(--bg-cream);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

// ===== COMPONENT =====
const emojis = { Fertilizer: "🌱", Seeds: "🌾" };
const empty = {
  name: "",
  category: "Fertilizer",
  price: "",
  unit: "per bag",
  stock: "",
  description: "",
  brand: "",
  featured: false,
  tags: "",
  crops: [],
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [search, setSearch] = useState("");
  const fileInputRef = useRef(null);

  const fetchProducts = () => {
    setLoading(true);
    api.get("/products")
      .then((res) => setProducts(res.data.products || []))
      .catch((err) => console.error("Fetch failed:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setMsg({ text: "", type: "" });
    setShowModal(true);
    setImageFiles([]);
  };

  const openEdit = (p) => {
    setEditing(p._id);
    setForm(p);
    setMsg({ text: "", type: "" });
    setShowModal(true);
    setImageFiles([]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Authorize administrative deletion of this asset?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Operational Deletion Failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      if (imageFiles.length > 0) {
        imageFiles.forEach(file => fd.append("images", file));
      }

      if (editing) {
        await api.put(`/products/${editing}`, fd);
        setMsg({ text: "Asset Registration Updated Successfully", type: "success" });
      } else {
        await api.post("/products", fd);
        setMsg({ text: "New Asset Registered Successfully", type: "success" });
      }
      setTimeout(() => {
        setShowModal(false);
        fetchProducts();
      }, 1500);
    } catch (err) {
      setMsg({ text: err.response?.data?.message || "Operation Authorization Failed", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBulkLoading(true);
    setBulkStatus("Initiating secure data ingestion...");
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await api.post("/admin/products/bulk-upload", fd);
      setBulkStatus(`Synchronization Successful: ${res.data.count} records ingested.`);
      fetchProducts();
    } catch (err) {
      setBulkStatus(`Ingestion Aborted: ${err.response?.data?.message || err.message}`);
    } finally {
      setBulkLoading(false);
      e.target.value = null;
    }
  };

  const openBulkUpload = () => fileInputRef.current.click();

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()))
  );

  const outOfStock = products.filter((p) => p.stock === 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5);

  return (
    <PageContainer>
      <Topbar>
        <PageTitle>
          Operational Inventory
          <small> Institutional fertilizer and seed management</small>
        </PageTitle>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <AddBtn onClick={openAdd}>+ REGISTER PRODUCT</AddBtn>
          <BulkUploadBtn
            type="button"
            onClick={openBulkUpload}
            disabled={bulkLoading}
          >
            {bulkLoading ? "SYNCHRONIZING..." : "📄 BULK CSV INGEST"}
          </BulkUploadBtn>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={handleBulkUpload}
        />
      </Topbar>

      {outOfStock.length > 0 && (
        <AlertBanner>
          ⚠ <strong>CRITICAL STOCK DEPLETION:</strong> {outOfStock.length} assets are currently unavailable:{" "}
          {outOfStock.map((p) => p.name).join(", ")}
        </AlertBanner>
      )}
      {bulkStatus && (
        <AlertBanner warning={bulkStatus.includes("failed") || bulkStatus.includes("Aborted")}>
          ℹ {bulkStatus}
        </AlertBanner>
      )}
      {lowStock.length > 0 && (
        <AlertBanner warning>
          ⚠ <strong>THRESHOLD WARNING:</strong> {lowStock.length} assets are below optimal reserve levels:{" "}
          {lowStock.map((p) => p.name).join(", ")}
        </AlertBanner>
      )}

      <SearchInput
        type="text"
        placeholder="Search operational database..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <SpinnerWrap>
          <Spinner />
        </SpinnerWrap>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "100px 20px", color: "var(--text-muted)" }}>
          <span style={{ fontSize: "4rem", display: "block", marginBottom: "24px" }}>🌱</span>
          <h3 style={{ fontSize: "1.5rem" }}>No registry entries found</h3>
        </div>
      ) : (
        <TableWrapper>
          <table>
            <thead>
              <tr>
                <th>Asset Specification</th>
                <th>Classification</th>
                <th>Institutional Rate</th>
                <th>Reserve Level</th>
                <th>Priority</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td>
                    <ProductCell style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                      <ProductImg>
                        {p.image?.[0] ? (
                          <img
                            src={`http://localhost:5000${p.image[0]}`}
                            alt={p.name}
                          />
                        ) : (
                          emojis[p.category] || "📦"
                        )}
                      </ProductImg>
                      <div>
                        <div style={{ fontWeight: 800, color: "var(--primary)", fontSize: "1.15rem" }}>{p.name}</div>
                        {p.brand && (
                          <div
                            style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}
                          >
                            {p.brand}
                          </div>
                        )}
                      </div>
                    </ProductCell>
                  </td>
                  <td>
                    <CategoryBadge $category={p.category}>
                      {p.category}
                    </CategoryBadge>
                  </td>
                  <td style={{ fontWeight: 800, color: "var(--text-charcoal)" }}>
                    Rs. {p.price?.toLocaleString()}
                    <span style={{ color: "var(--text-muted)", fontWeight: 500, fontSize: "0.85rem", marginLeft: "4px" }}>
                      /{p.unit}
                    </span>
                  </td>
                  <td>
                    <StockBadge $stock={p.stock}>{p.stock} units</StockBadge>
                  </td>
                  <td>{p.featured ? "⭐ HIGH" : "STANDARD"}</td>
                  <td>
                    <ActionBtn onClick={() => openEdit(p)}>EDIT</ActionBtn>
                    <ActionBtn danger onClick={() => handleDelete(p._id)}>
                      DELETE
                    </ActionBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <Overlay
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <Modal>
            <ModalHeader>
              <ModalTitle>
                {editing ? "Edit Registry Entry" : "Register New Asset"}
              </ModalTitle>
              <CloseBtn onClick={() => setShowModal(false)}>✕</CloseBtn>
            </ModalHeader>

            {msg.text && (
              <Alert success={msg.type === "success"}>
                {msg.text}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <label>Asset Specification Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </FormGroup>
              <FormRow>
                <FormGroup>
                  <label>Operational Category</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option>Fertilizer</option>
                    <option>Seeds</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <label>Brand Designation</label>
                  <input
                    value={form.brand}
                    onChange={(e) =>
                      setForm({ ...form, brand: e.target.value })
                    }
                    placeholder="Alpha, Bravo, etc."
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <label>Unit Valuation (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <label>Standard Unit</label>
                  <input
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="per bag, per kg"
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <label>Reserve Inventory (units)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <label>Identifier Tags</label>
                  <input
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="wheat, organic, nitrogen"
                  />
                </FormGroup>
              </FormRow>
              <FormGroup>
                <label>Target Crops</label>
                <div style={{ display:'flex', gap:'15px', flexWrap:'wrap', background:'var(--bg-cream)', padding:'15px', borderRadius:'12px' }}>
                  {['Wheat', 'Cotton', 'Rice', 'Maize', 'Sugarcane', 'Citrus'].map(c => (
                    <label key={c} style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'0.85rem', fontWeight:800, cursor:'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={form.crops?.includes(c)}
                        onChange={(e) => {
                          const newCrops = e.target.checked 
                            ? [...(form.crops || []), c]
                            : (form.crops || []).filter(x => x !== c);
                          setForm({...form, crops: newCrops});
                        }}
                      /> {c}
                    </label>
                  ))}
                </div>
              </FormGroup>
              <FormGroup>
                <label>Technical Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <label>Product Imagery <small style={{fontWeight:400}}>(Select up to 5 photos)</small></label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImageFiles(Array.from(e.target.files))}
                  />
                  {imageFiles.length > 0 && (
                    <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                      {imageFiles.map((f, i) => (
                        <div key={i} style={{ fontSize:'0.75rem', background:'var(--bg-cream)', padding:'4px 10px', borderRadius:'8px', fontWeight:800 }}>
                          📸 {f.name.substring(0, 15)}...
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormGroup>
              <FormGroup>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                  />
                  Mark as High-Priority Priority Allocation
                </CheckboxLabel>
              </FormGroup>
              <BtnRow>
                <CancelBtn type="button" onClick={() => setShowModal(false)}>
                  DISMISS
                </CancelBtn>
                <SubmitBtn type="submit" disabled={saving}>
                  {saving
                    ? "COMMITTING..."
                    : editing
                      ? "AUTHORIZE UPDATE"
                      : "CONFIRM REGISTRATION"}
                </SubmitBtn>
              </BtnRow>
            </form>
          </Modal>
        </Overlay>
      )}
    </PageContainer>
  );
};



export default AdminProducts;
