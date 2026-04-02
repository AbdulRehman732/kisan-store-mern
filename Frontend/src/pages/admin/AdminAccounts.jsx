import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import api from "../../api";

// ===== STYLED COMPONENTS =====
const PageContainer = styled.div`
  padding: var(--spacing-xl);
  animation: entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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

const ActionBtn = styled.button`
  padding: 16px 32px;
  background: var(--primary);
  color: var(--text-inverse);
  border-radius: var(--radius-pill);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.85rem;
  box-shadow: var(--shadow-subtle);
  transition: var(--transition-smooth);

  &:hover {
    background: var(--accent);
    color: var(--text-inverse);
    transform: translateY(-3px);
    box-shadow: var(--shadow-premium);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: var(--spacing-xl);
`;

const AccountCard = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: var(--spacing-xl);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-subtle);
  position: relative;
  overflow: hidden;
  transition: var(--transition-smooth);

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 6px;
    background: ${props => props.$type === 'Bank' ? '#2196F3' : 'var(--primary)'};
    opacity: 0.8;
  }

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: var(--shadow-premium);
    border-color: var(--accent);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
`;

const Badge = styled.span`
  background: ${props => props.$type === 'Bank' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(76, 175, 80, 0.1)'};
  color: ${props => props.$type === 'Bank' ? '#2196F3' : '#4CAF50'};
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border: 1px solid currentColor;
`;

const AccountName = styled.h3`
  font-size: 1.8rem;
  color: var(--text-primary);
  margin-bottom: 4px;
`;

const BankInfo = styled.div`
  font-size: 0.88rem;
  color: var(--text-secondary);
  font-weight: 700;
  opacity: 0.7;
`;

const BalanceDisplay = styled.div`
  margin-top: 40px;
  padding: var(--spacing-lg);
  background: var(--bg-surface-alt);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);

  .label { font-size: 0.75rem; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.1em; }
  .value { font-size: 2.8rem; font-weight: 900; color: var(--text-primary); letter-spacing: -0.02em; }
`;

const MOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(13, 15, 12, 0.7);
  backdrop-filter: blur(20px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: entrance 0.4s ease;
`;

const MModal = styled.div`
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: var(--spacing-xxl);
  width: 100%;
  max-width: 580px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-premium);
`;

const MGroup = styled.div`
  margin-bottom: var(--spacing-lg);
  label { display: block; font-size: 0.8rem; font-weight: 900; color: var(--text-primary); text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.1em; }
  input, select, textarea {
    width: 100%;
    padding: 18px;
    background: var(--bg-surface-alt);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    color: var(--text-primary);
    transition: var(--transition-smooth);
    &:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 15px var(--accent-glow); }
  }
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  font-weight: 900;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  margin-top: 24px;
  opacity: 0.6;
  transition: var(--transition-smooth);
  &:hover { opacity: 1; text-decoration: underline; }
`;

const AdminAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form States
  const [form, setForm] = useState({ name: "", type: "Bank", bankName: "", accountNumber: "" });
  const [transfer, setTransfer] = useState({ fromId: "", toId: "", amount: "", note: "" });

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/accounts");
      setAccounts(res.data.accounts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/accounts", form);
      fetchAccounts();
      setShowModal(false);
      setForm({ name: "", type: "Bank", bankName: "", accountNumber: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to establish registry entry");
    } finally {
      setSaving(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (transfer.fromId === transfer.toId) return alert("Source and destination must differ");
    setSaving(true);
    try {
      await api.post("/accounts/transfer", {
        fromAccountId: transfer.fromId,
        toAccountId: transfer.toId,
        amount: Number(transfer.amount),
        note: transfer.note
      });
      alert("Atomic Transfer Successfully Executed.");
      fetchAccounts();
      setShowTransfer(false);
      setTransfer({ fromId: "", toId: "", amount: "", note: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Atomic Transfer Aborted");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Authorize permanent removal of this registry?")) return;
    try {
      await api.delete(`/accounts/${id}`);
      fetchAccounts();
    } catch (err) {
      alert("Removal failed");
    }
  };

  return (
    <PageContainer>
      <Topbar>
        <PageTitle>
          Treasury Assets
          <small>INSTITUTIONAL LIQUIDITY</small>
        </PageTitle>
        <div style={{ display: "flex", gap: "16px" }}>
          <ActionBtn onClick={() => setShowTransfer(true)} style={{ background: "var(--bg-surface-alt)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
            ?? ATOMIC TRANSFER
          </ActionBtn>
          <ActionBtn onClick={() => setShowModal(true)}>
            + NEW ACCOUNT
          </ActionBtn>
        </div>
      </Topbar>

      {loading ? (
        <div style={{display:'flex',justifyContent:'center',padding:'100px'}}><div style={{width:'50px',height:'50px',border:'4px solid var(--border)',borderTopColor:'var(--primary)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} /></div>
      ) : (
        <Grid>
          {accounts.map((acc) => (
            <AccountCard key={acc._id} $type={acc.type}>
              <CardHeader>
                <div>
                  <AccountName>{acc.name}</AccountName>
                  <BankInfo>
                    {acc.type === 'Bank' ? `🏦 ${acc.bankName} · ${acc.accountNumber}` : '💎 Primary Cash Vault'}
                  </BankInfo>
                </div>
                <Badge $type={acc.type}>{acc.type}</Badge>
              </CardHeader>

              <BalanceDisplay>
                <div className="label">Available Treasury Liquidity</div>
                <div className="value">Rs. {acc.balance.toLocaleString()}</div>
              </BalanceDisplay>

              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <DeleteBtn onClick={() => handleDelete(acc._id)}>RETIRE REGISTRY</DeleteBtn>
                <div style={{fontSize:'0.65rem', fontWeight:900, color:'var(--text-secondary)', marginTop:'24px', opacity:0.4}}>VERIFIED LOG</div>
              </div>
            </AccountCard>
          ))}
        </Grid>
      )}

      {/* CREATE MODAL */}
      {showModal && (
        <MOverlay onClick={() => setShowModal(false)}>
          <MModal onClick={e => e.stopPropagation()}>
            <h3 style={{fontSize:'2rem', marginBottom:'8px'}}>Establish Treasury Registry</h3>
            <p style={{color:'var(--text-secondary)', marginBottom:'40px', fontWeight:600}}>Define a new institutional ledger for financial coordination.</p>
            <form onSubmit={handleCreate}>
              <MGroup>
                <label>Registry Identification</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Master Operational Fund" />
              </MGroup>
              <MGroup>
                <label>Registry Mode</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="Bank">Banking Deposit/Ledger</option>
                  <option value="Cash">Physical Currency Vault</option>
                </select>
              </MGroup>
              {form.type === 'Bank' && (
                <>
                  <MGroup>
                    <label>Bank Institution</label>
                    <input required value={form.bankName} onChange={e => setForm({...form, bankName: e.target.value})} placeholder="Institution Name" />
                  </MGroup>
                  <MGroup>
                    <label>Account Reference Number</label>
                    <input required value={form.accountNumber} onChange={e => setForm({...form, accountNumber: e.target.value})} placeholder="IBAN or Account #" />
                  </MGroup>
                </>
              )}
              <div style={{display:'flex', gap:'16px', marginTop:'48px'}}>
                <ActionBtn type="button" onClick={() => setShowModal(false)} style={{flex:1, background:'var(--bg-surface-alt)', color:'var(--text-primary)', border:'1px solid var(--border)'}}>DISMISS</ActionBtn>
                <SubmitBtn as="button" type="submit" disabled={saving} style={{flex:2}}>{saving ? "COMMITTING..." : "CONFIRM ESTABLISHMENT"}</SubmitBtn>
              </div>
            </form>
          </MModal>
        </MOverlay>
      )}

      {/* TRANSFER MODAL */}
      {showTransfer && (
        <MOverlay onClick={() => setShowTransfer(false)}>
          <MModal onClick={e => e.stopPropagation()}>
            <h3 style={{fontSize:'2rem', marginBottom:'8px'}}>Authorize Atomic Transfer</h3>
            <p style={{color:'var(--text-secondary)', marginBottom:'40px', fontWeight:600}}>Execute a zero-loss internal relocation of treasury funds.</p>
            <form onSubmit={handleTransfer}>
              <MGroup>
                <label>Source Registry (Debit)</label>
                <select required value={transfer.fromId} onChange={e => setTransfer({...transfer, fromId: e.target.value})}>
                  <option value="">-- Select Outbound --</option>
                  {accounts.map(a => <option key={a._id} value={a._id}>{a.name} (Rs. {a.balance.toLocaleString()})</option>)}
                </select>
              </MGroup>
              <MGroup>
                <label>Destination Registry (Credit)</label>
                <select required value={transfer.toId} onChange={e => setTransfer({...transfer, toId: e.target.value})}>
                  <option value="">-- Select Inbound --</option>
                  {accounts.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </MGroup>
              <MGroup>
                <label>Transfer Magnitude (Rs.)</label>
                <input type="number" required min="1" value={transfer.amount} onChange={e => setTransfer({...transfer, amount: e.target.value})} />
              </MGroup>
              <div style={{display:'flex', gap:'16px', marginTop:'48px'}}>
                <ActionBtn type="button" onClick={() => setShowTransfer(false)} style={{flex:1, background:'var(--bg-surface-alt)', color:'var(--text-primary)', border:'1px solid var(--border)'}}>ABORT</ActionBtn>
                <SubmitBtn as="button" type="submit" disabled={saving} style={{flex:2}}>{saving ? "EXECUTING..." : "AUTHORIZE TRANSFER"}</SubmitBtn>
              </div>
            </form>
          </MModal>
        </MOverlay>
      )}
    </PageContainer>
  );
};

const SubmitBtn = styled(ActionBtn)`
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export default AdminAccounts;
