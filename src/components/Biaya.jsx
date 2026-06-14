import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Plus, CreditCard, AlertTriangle, ListFilter, Trash2 } from 'lucide-react';

export default function Biaya() {
  const { expenses, addExpense, setExpenses, coa } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [category, setCategory] = useState('Biaya Sewa');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [coaCode, setCoaCode] = useState('5-501 (Beban Sewa)');

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Budget configuration for demo
  const monthlyBudgetLimit = 35000000;
  const currentTotalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const budgetPercentage = Math.min(100, Math.round((currentTotalExpenses / monthlyBudgetLimit) * 100));

  const handleRecordExpense = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newExp = {
      id: `EXP-${String(expenses.length + 1).padStart(3, '0')}`,
      category,
      description,
      date,
      amount: parseFloat(amount),
      account: coaCode
    };

    addExpense(newExp);
    
    // Reset form
    setDescription('');
    setAmount('');
    setShowForm(false);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Find COA list matching expense types
  const expenseAccounts = coa.filter(acc => acc.code.startsWith('5-'));

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header-actions">
        <div>
          <h2 className="module-title">Pencatatan Biaya & Pengeluaran</h2>
          <p className="module-subtitle">Catat pengeluaran rutin, operasional, sewa, dan pengeluaran tunai</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            <span>Catat Pengeluaran Baru</span>
          </button>
        )}
      </div>

      {/* Budget Monitor Bar */}
      <div className="card budget-monitor-card">
        <div className="budget-header-info">
          <div>
            <h5>Batas Anggaran Operasional Bulanan</h5>
            <p className="text-muted">Juni 2026</p>
          </div>
          <div className="text-right">
            <strong>{formatIDR(currentTotalExpenses)}</strong> / <span className="text-muted">{formatIDR(monthlyBudgetLimit)}</span>
          </div>
        </div>
        <div className="budget-progress-bar-container">
          <div 
            className={`budget-progress-bar-fill ${budgetPercentage > 85 ? 'bg-danger' : budgetPercentage > 60 ? 'bg-warning' : 'bg-primary'}`} 
            style={{ width: `${budgetPercentage}%` }}
          ></div>
        </div>
        <div className="budget-footer-info">
          <span>Penggunaan Anggaran: {budgetPercentage}%</span>
          {budgetPercentage > 85 && (
            <span className="text-danger flex-row align-center gap-1 font-semibold">
              <AlertTriangle size={14} /> Anggaran hampir habis! Mohon kurangi pengeluaran non-prioritas.
            </span>
          )}
        </div>
      </div>

      <div className="grid-split-layout mt-6">
        {/* Expense List Card */}
        <div className="card col-span-2">
          <div className="card-header">
            <h4>Riwayat Pengeluaran Kas</h4>
            <div className="flex-row align-center gap-2">
              <ListFilter size={16} className="text-muted" />
              <span className="text-sm text-muted">Bulan ini</span>
            </div>
          </div>
          <div className="table-responsive mt-3">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tanggal</th>
                  <th>Kategori</th>
                  <th>Uraian Deskripsi</th>
                  <th>Akun Ledger</th>
                  <th>Jumlah Pengeluaran</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6">Belum ada pengeluaran yang dicatat.</td>
                  </tr>
                ) : (
                  expenses.map(exp => (
                    <tr key={exp.id}>
                      <td className="font-semibold text-sm">{exp.id}</td>
                      <td>{exp.date}</td>
                      <td>
                        <span className="badge badge-neutral">{exp.category}</span>
                      </td>
                      <td>{exp.description}</td>
                      <td className="text-muted text-sm">{exp.account}</td>
                      <td className="font-semibold text-danger">-{formatIDR(exp.amount)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="text-danger p-1" onClick={() => handleDeleteExpense(exp.id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expense Quick Form - conditionally shown or fixed in sidebar */}
        {showForm && (
          <div className="card">
            <div className="form-header">
              <h4>Catat Pengeluaran Baru</h4>
            </div>
            <form onSubmit={handleRecordExpense} className="mt-4">
              <div className="form-group">
                <label>Pilih Kategori</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Biaya Sewa">Biaya Sewa Gedung/Ruko</option>
                  <option value="Utilitas">Tagihan Utilitas (Listrik/Air/Internet)</option>
                  <option value="Gaji Karyawan">Beban Gaji & Upah</option>
                  <option value="Pemasaran">Pemasaran & Iklan</option>
                  <option value="Administrasi">Alat Tulis Kantor & Keperluan Dapur</option>
                  <option value="Transportasi">Biaya Perjalanan Dinas & Bahan Bakar</option>
                </select>
              </div>

              <div className="form-group">
                <label>Akun Pengeluaran (Beban COA)</label>
                <select value={coaCode} onChange={(e) => setCoaCode(e.target.value)}>
                  {expenseAccounts.map(acc => (
                    <option key={acc.code} value={`${acc.code} (${acc.name})`}>
                      {acc.code} - {acc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tanggal Keluar Uang</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Jumlah Nominal (Rp)</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="Contoh: 1500000"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Keterangan Deskripsi Pengeluaran</label>
                <textarea 
                  rows="3" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Uraikan detail keperluan pengeluaran..."
                  required
                ></textarea>
              </div>

              <div className="form-action-footer mt-4">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
