import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Plus, FolderPlus, ListCollapse } from 'lucide-react';

export default function Akun() {
  const { coa, setCoa } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('Harta (Aktiva Lancar)');
  const [balance, setBalance] = useState('0');

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleAddAccount = (e) => {
    e.preventDefault();
    if (!code || !name) return;

    // Check duplicate code
    if (coa.some(acc => acc.code === code)) {
      alert('Nomor akun/kode perkiraan sudah terdaftar!');
      return;
    }

    const newAcc = {
      code,
      name,
      type,
      balance: parseFloat(balance) || 0
    };

    // Sort COA by code order
    setCoa([...coa, newAcc].sort((a, b) => a.code.localeCompare(b.code)));

    // Reset Form
    setCode('');
    setName('');
    setBalance('0');
    setShowForm(false);
  };

  // Grouped counts for statistics
  const totalBalanceAssets = coa
    .filter(a => a.code.startsWith('1-'))
    .reduce((sum, a) => sum + a.balance, 0);

  const totalBalanceLiabilities = coa
    .filter(a => a.code.startsWith('2-'))
    .reduce((sum, a) => sum + a.balance, 0);

  const totalBalanceEquity = coa
    .filter(a => a.code.startsWith('3-'))
    .reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header-actions">
        <div>
          <h2 className="module-title">Daftar Akun Perkiraan (Chart of Accounts)</h2>
          <p className="module-subtitle">Struktur kode rekening pembukuan ledger untuk menyusun laporan keuangan perusahaan</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            <span>Tambah Akun Baru</span>
          </button>
        )}
      </div>

      {/* COA stats summaries */}
      <div className="coa-stats-banner mb-6">
        <div className="coa-stat-item">
          <span>Total Saldo Harta (1-xxx):</span>
          <strong>{formatIDR(totalBalanceAssets)}</strong>
        </div>
        <div className="coa-stat-item">
          <span>Total Kewajiban (2-xxx):</span>
          <strong>{formatIDR(totalBalanceLiabilities)}</strong>
        </div>
        <div className="coa-stat-item">
          <span>Total Ekuitas Modal (3-xxx):</span>
          <strong>{formatIDR(totalBalanceEquity)}</strong>
        </div>
      </div>

      <div className="grid-split-layout">
        {/* Accounts Table List */}
        <div className="card col-span-2">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th width="120">Kode Akun</th>
                  <th>Nama Perkiraan (Ledger Account)</th>
                  <th>Kategori Golongan</th>
                  <th style={{ textAlign: 'right' }}>Saldo Buku</th>
                </tr>
              </thead>
              <tbody>
                {coa.map(acc => (
                  <tr key={acc.code}>
                    <td className="font-semibold text-sm">{acc.code}</td>
                    <td>{acc.name}</td>
                    <td>
                      <span className={`badge ${
                        acc.code.startsWith('1-') ? 'badge-primary' :
                        acc.code.startsWith('2-') ? 'badge-warning' :
                        acc.code.startsWith('3-') ? 'badge-violet' :
                        acc.code.startsWith('4-') ? 'badge-success' : 'badge-danger'
                      }`}>
                        {acc.type}
                      </span>
                    </td>
                    <td className="font-semibold" style={{ textAlign: 'right' }}>
                      {formatIDR(acc.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Account Sidebar form */}
        {showForm && (
          <div className="card">
            <div className="form-header">
              <FolderPlus size={18} className="text-primary mr-2" />
              <h4>Buat Kode Perkiraan Baru</h4>
            </div>
            <form onSubmit={handleAddAccount} className="mt-4">
              <div className="form-group">
                <label>Nomor Kode Akun *</label>
                <input 
                  type="text" 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)} 
                  placeholder="Contoh: 1-105 atau 5-506" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Nama Perkiraan Rekening *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Contoh: Kas Kecil Cabang Solo" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Kategori Jenis Akun</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="Harta (Aktiva Lancar)">Harta (Aktiva Lancar) - Kode 1-1xx</option>
                  <option value="Harta (Aktiva Tetap)">Harta (Aktiva Tetap) - Kode 1-2xx</option>
                  <option value="Kewajiban (Liabilitas)">Kewajiban (Liabilitas) - Kode 2-xxx</option>
                  <option value="Modal (Ekuitas)">Modal (Ekuitas) - Kode 3-xxx</option>
                  <option value="Pendapatan">Pendapatan Operasional - Kode 4-xxx</option>
                  <option value="Beban (Pengeluaran)">Beban Pengeluaran - Kode 5-xxx</option>
                </select>
              </div>

              <div className="form-group">
                <label>Saldo Awal Rekening (Rp)</label>
                <input 
                  type="number" 
                  value={balance} 
                  onChange={(e) => setBalance(e.target.value)} 
                />
              </div>

              <div className="form-action-footer mt-4">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Buat Akun
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
