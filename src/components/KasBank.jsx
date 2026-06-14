import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Wallet, RefreshCw, CheckCircle, ArrowRightLeft, FileCheck } from 'lucide-react';

export default function KasBank() {
  const { bankAccounts, setBankAccounts, invoices, expenses } = useContext(AppContext);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('accounts'); // accounts, reconciliation

  // Transfer Form States
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNotes, setTransferNotes] = useState('');

  // Bank Reconciliation simulation lists
  const [reconciledItems, setReconciledItems] = useState([
    { id: 'REC-01', date: '2026-06-01', description: 'Trsf Masuk PT Surya Abadi (INV-001)', amount: 29692500, type: 'CR', matched: true },
    { id: 'REC-02', date: '2026-06-01', description: 'Biaya Sewa Ruko Bandung (EXP-001)', amount: 5000000, type: 'DR', matched: true },
    { id: 'REC-03', date: '2026-06-05', description: 'Pembayaran Listrik Juni (EXP-002)', amount: 1250000, type: 'DR', matched: false },
    { id: 'REC-04', date: '2026-06-10', description: 'Transfer Masuk Tokopedia Settlement', amount: 8450000, type: 'CR', matched: false },
  ]);

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!fromAccount || !toAccount || !transferAmount) return;
    if (fromAccount === toAccount) {
      alert('Akun asal dan akun tujuan tidak boleh sama!');
      return;
    }

    const amt = parseFloat(transferAmount);
    const sourceAcc = bankAccounts.find(a => a.id === fromAccount);
    
    if (sourceAcc.balance < amt) {
      alert('Saldo akun asal tidak mencukupi untuk melakukan transfer!');
      return;
    }

    // Update balances
    setBankAccounts(prev => prev.map(a => {
      if (a.id === fromAccount) {
        return { ...a, balance: a.balance - amt };
      }
      if (a.id === toAccount) {
        return { ...a, balance: a.balance + amt };
      }
      return a;
    }));

    // Reset transfer form
    setTransferAmount('');
    setTransferNotes('');
    setShowTransferForm(false);
    alert('Transfer dana antar kas/bank berhasil dijalankan.');
  };

  const toggleReconcileMatch = (id) => {
    setReconciledItems(prev => prev.map(item => 
      item.id === id ? { ...item, matched: !item.matched } : item
    ));
  };

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header-actions">
        <div>
          <h2 className="module-title">Kas & Rekening Bank</h2>
          <p className="module-subtitle">Monitor saldo rekening bank, mutasi kas, transfer internal, dan rekonsiliasi koran</p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="filter-group mb-6">
        <button 
          className={`filter-btn ${activeSubTab === 'accounts' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('accounts')}
        >
          <Wallet size={16} />
          <span>Daftar Rekening Kas</span>
        </button>
        <button 
          className={`filter-btn ${activeSubTab === 'reconciliation' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('reconciliation')}
        >
          <FileCheck size={16} />
          <span>Rekonsiliasi Bank</span>
        </button>
      </div>

      {activeSubTab === 'accounts' && (
        <div className="grid-split-layout">
          {/* Accounts Cards List */}
          <div className="col-span-2">
            <div className="accounts-cards-list">
              {bankAccounts.map(acc => (
                <div key={acc.id} className="card bank-account-card">
                  <div className="bank-card-top">
                    <div>
                      <span className="bank-account-type">{acc.type}</span>
                      <h4 className="bank-account-name">{acc.name}</h4>
                    </div>
                    <div className="bank-account-icon-wrapper">
                      <Wallet size={20} className="text-primary" />
                    </div>
                  </div>
                  <div className="bank-card-bottom">
                    <span className="bank-account-number">{acc.number}</span>
                    <h3 className="bank-account-balance">{formatIDR(acc.balance)}</h3>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Quick transaction history */}
            <div className="card mt-6">
              <h4>Jurnal Mutasi Kas Terakhir</h4>
              <div className="table-responsive mt-3">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Keterangan</th>
                      <th>Akun Terkait</th>
                      <th>Debit (Masuk)</th>
                      <th>Kredit (Keluar)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.filter(i => i.status === 'Lunas').map(inv => (
                      <tr key={inv.id}>
                        <td>{inv.date}</td>
                        <td>Penerimaan Invoice {inv.id}</td>
                        <td className="font-semibold text-blue">Bank BCA Utama</td>
                        <td className="text-success font-semibold">+{formatIDR(inv.total)}</td>
                        <td>-</td>
                      </tr>
                    ))}
                    {expenses.map(exp => (
                      <tr key={exp.id}>
                        <td>{exp.date}</td>
                        <td>Beban: {exp.description}</td>
                        <td className="font-semibold text-red">Bank BCA Utama</td>
                        <td>-</td>
                        <td className="text-danger font-semibold">-{formatIDR(exp.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Transfer Form Panel */}
          <div className="card">
            <h4>Transfer Antar Bank / Kas</h4>
            <p className="text-muted text-sm mb-4">Pindahkan dana internal dari satu rekening kas ke kas lainnya.</p>
            <form onSubmit={handleTransferSubmit}>
              <div className="form-group">
                <label>Dari Akun Asal</label>
                <select value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} required>
                  <option value="">-- Pilih Akun Asal --</option>
                  {bankAccounts.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({formatIDR(a.balance)})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Ke Akun Tujuan</label>
                <select value={toAccount} onChange={(e) => setToAccount(e.target.value)} required>
                  <option value="">-- Pilih Akun Tujuan --</option>
                  {bankAccounts.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Jumlah Transfer (Rp)</label>
                <input 
                  type="number" 
                  value={transferAmount} 
                  onChange={(e) => setTransferAmount(e.target.value)} 
                  placeholder="Contoh: 5000000"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Keterangan / Memo</label>
                <textarea 
                  rows="2" 
                  value={transferNotes} 
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="Memo internal transfer..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-full mt-2">
                <ArrowRightLeft size={16} />
                <span>Kirim Transfer Dana</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {activeSubTab === 'reconciliation' && (
        <div className="card max-w-4xl mx-auto">
          <div className="reconcile-header mb-4">
            <h4>Pencocokan Rekening Koran (Bank Reconciliation)</h4>
            <p className="text-muted text-sm">Cocokkan mutasi bank eksternal dengan catatan transaksi akuntansi internal Anda</p>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal Bank</th>
                  <th>Deskripsi Rekening Koran</th>
                  <th>Tipe</th>
                  <th>Nominal</th>
                  <th>Saran Kecocokan Buku</th>
                  <th style={{ textAlign: 'center' }}>Cocok?</th>
                </tr>
              </thead>
              <tbody>
                {reconciledItems.map(item => (
                  <tr key={item.id} className={item.matched ? 'bg-light-success' : ''}>
                    <td>{item.date}</td>
                    <td className="font-semibold">{item.description}</td>
                    <td>
                      <span className={`badge ${item.type === 'CR' ? 'badge-success' : 'badge-neutral'}`}>
                        {item.type === 'CR' ? 'Kredit (Masuk)' : 'Debit (Keluar)'}
                      </span>
                    </td>
                    <td className="font-semibold">{formatIDR(item.amount)}</td>
                    <td>
                      {item.matched ? (
                        <span className="text-success font-semibold">✓ Terkunci Buku Besar</span>
                      ) : (
                        <span className="text-warning font-semibold flex-row align-center gap-1">
                          <RefreshCw className="animate-spin-slow" size={12} /> Ditemukan 1 Transaksi Mirip
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={item.matched}
                        onChange={() => toggleReconcileMatch(item.id)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="reconcile-footer mt-4 text-right">
            <button className="btn btn-primary" onClick={() => alert('Rekonsiliasi Bank Bulan Juni Berhasil Disimpan & Dikunci.')}>
              Selesaikan Rekonsiliasi Bank
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
