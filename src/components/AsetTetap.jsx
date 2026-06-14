import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Plus, BarChart, Calculator, Calendar } from 'lucide-react';

export default function AsetTetap() {
  const { fixedAssets, addFixedAsset } = useContext(AppContext);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Form States
  const [assetName, setAssetName] = useState('');
  const [category, setCategory] = useState('Peralatan Kantor');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [cost, setCost] = useState('');
  const [lifespan, setLifespan] = useState('4'); // years
  const [salvageValue, setSalvageValue] = useState('0');

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Straight line depreciation calculator
  const calculateDepreciation = (asset) => {
    const costVal = parseFloat(asset.cost);
    const salvage = parseFloat(asset.salvageValue);
    const lifeYears = parseInt(asset.lifespan);

    const yearlyDepreciation = (costVal - salvage) / lifeYears;
    const monthlyDepreciation = yearlyDepreciation / 12;

    // Calculate how many months have passed since purchase
    const pDate = new Date(asset.purchaseDate);
    const currentDate = new Date('2026-06-15'); // Current Mock Date
    const monthsPassed = Math.max(0, (currentDate.getFullYear() - pDate.getFullYear()) * 12 + (currentDate.getMonth() - pDate.getMonth()));
    
    const accumulatedDep = Math.min(costVal - salvage, monthsPassed * monthlyDepreciation);
    const bookValue = Math.max(salvage, costVal - accumulatedDep);

    return {
      yearly: Math.round(yearlyDepreciation),
      monthly: Math.round(monthlyDepreciation),
      accumulated: Math.round(accumulatedDep),
      bookValue: Math.round(bookValue)
    };
  };

  const handleRegisterAsset = (e) => {
    e.preventDefault();
    if (!assetName || !cost) return;

    const newAsset = {
      id: `AST-00${fixedAssets.length + 1}`,
      name: assetName,
      category,
      purchaseDate,
      cost: parseFloat(cost),
      lifespan: parseInt(lifespan),
      salvageValue: parseFloat(salvageValue),
      depreciationMethod: 'Garis Lurus'
    };

    addFixedAsset(newAsset);

    // Reset Form
    setAssetName('');
    setCost('');
    setSalvageValue('0');
    setShowAddForm(false);
  };

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header-actions">
        <div>
          <h2 className="module-title">Aset Tetap & Inventaris Perusahaan</h2>
          <p className="module-subtitle">Daftarkan aset berharga, hitung nilai penyusutan bulanan secara otomatis dengan metode garis lurus</p>
        </div>
        {!showAddForm && (
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            <Plus size={16} />
            <span>Daftarkan Aset Baru</span>
          </button>
        )}
      </div>

      <div className="grid-split-layout">
        {/* Assets List */}
        <div className="card col-span-2">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID Aset</th>
                  <th>Nama Barang Aset</th>
                  <th>Kategori</th>
                  <th>Tanggal Perolehan</th>
                  <th>Harga Perolehan</th>
                  <th>Penyusutan Bulanan</th>
                  <th>Akumulasi Penyusutan</th>
                  <th>Nilai Buku Sekarang</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {fixedAssets.map(asset => {
                  const dep = calculateDepreciation(asset);
                  return (
                    <tr key={asset.id}>
                      <td className="font-semibold text-sm">{asset.id}</td>
                      <td>{asset.name}</td>
                      <td><span className="badge badge-neutral">{asset.category}</span></td>
                      <td>{asset.purchaseDate}</td>
                      <td className="font-semibold">{formatIDR(asset.cost)}</td>
                      <td className="text-danger font-semibold">-{formatIDR(dep.monthly)}</td>
                      <td className="text-danger">-{formatIDR(dep.accumulated)}</td>
                      <td className="text-success font-semibold">{formatIDR(dep.bookValue)}</td>
                      <td>
                        <button className="btn btn-xs btn-secondary" onClick={() => setSelectedAsset(asset)}>
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Register Form */}
        {showAddForm && (
          <div className="card">
            <div className="form-header">
              <Calculator size={18} className="text-primary mr-2" />
              <h4>Registrasi Aset Tetap</h4>
            </div>
            <form onSubmit={handleRegisterAsset} className="mt-4">
              <div className="form-group">
                <label>Nama Aset Tetap *</label>
                <input type="text" value={assetName} onChange={(e) => setAssetName(e.target.value)} placeholder="Contoh: Honda Vario Sales" required />
              </div>
              <div className="form-group">
                <label>Golongan Aset</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Kendaraan">Kendaraan Operasional (Mobil/Motor)</option>
                  <option value="Peralatan Kantor">Peralatan Kantor & Komputer</option>
                  <option value="Bangunan">Bangunan & Gedung Kantor</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tanggal Beli Aset *</label>
                <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Harga Beli Perolehan (Rp) *</label>
                <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="Contoh: 20000000" required />
              </div>
              <div className="grid-2-cols">
                <div className="form-group">
                  <label>Masa Pakai (Tahun)</label>
                  <input type="number" min="1" value={lifespan} onChange={(e) => setLifespan(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Nilai Sisa / Residu (Rp)</label>
                  <input type="number" value={salvageValue} onChange={(e) => setSalvageValue(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full mt-2">
                Daftarkan Aset
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Asset Depreciation Detail Panel */}
      {selectedAsset && (
        <div className="card mt-6">
          <div className="card-header justify-between">
            <h4>Analisis Tabel Depresiasi: {selectedAsset.name}</h4>
            <button className="btn btn-xs btn-ghost" onClick={() => setSelectedAsset(null)}>Tutup Analisis</button>
          </div>
          <div className="grid-2-cols mt-4">
            <div className="dep-metrics-list">
              <div className="detail-row">
                <span>Metode Penyusutan:</span>
                <strong>Garis Lurus (Straight Line)</strong>
              </div>
              <div className="detail-row">
                <span>Nilai Depresiasi Tahunan:</span>
                <strong className="text-danger">{formatIDR(calculateDepreciation(selectedAsset).yearly)} / tahun</strong>
              </div>
              <div className="detail-row">
                <span>Nilai Depresiasi Bulanan:</span>
                <strong className="text-danger">{formatIDR(calculateDepreciation(selectedAsset).monthly)} / bulan</strong>
              </div>
              <div className="detail-row">
                <span>Nilai Buku Akhir (Residu):</span>
                <span>{formatIDR(selectedAsset.salvageValue)}</span>
              </div>
            </div>
            
            {/* Visual SVG chart showing book value depreciation line */}
            <div className="depreciation-chart-box">
              <h5>Simulasi Penurunan Nilai Buku Aset (Tahun 0 - {selectedAsset.lifespan})</h5>
              <svg viewBox="0 0 350 120" className="svg-chart mt-3">
                {/* Axes */}
                <line x1="30" y1="10" x2="30" y2="100" stroke="var(--text-secondary)" />
                <line x1="30" y1="100" x2="330" y2="100" stroke="var(--text-secondary)" />
                
                {/* Plot line */}
                <path 
                  d={`M 30 20 L 330 90`} 
                  fill="transparent" 
                  stroke="#ef4444" 
                  strokeWidth="3" 
                  strokeDasharray="4 4" 
                />
                
                {/* Year indicators */}
                <text x="30" y="112" fontSize="9" textAnchor="middle" fill="var(--text-secondary)">Th 0</text>
                <text x="180" y="112" fontSize="9" textAnchor="middle" fill="var(--text-secondary)">Th {Math.floor(selectedAsset.lifespan / 2)}</text>
                <text x="330" y="112" fontSize="9" textAnchor="middle" fill="var(--text-secondary)">Th {selectedAsset.lifespan}</text>

                {/* Values */}
                <text x="35" y="18" fontSize="9" fill="var(--text-secondary)">Rp {formatIDR(selectedAsset.cost)}</text>
                <text x="310" y="85" fontSize="9" textAnchor="end" fill="var(--text-secondary)">Rp {formatIDR(selectedAsset.salvageValue)}</text>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
