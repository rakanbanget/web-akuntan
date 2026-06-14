import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Plus, Search, Tag, ShoppingCart, CheckCircle, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';

export default function Pembelian() {
  const { 
    contacts, 
    addContact,
    products, 
    setProducts,
    expenses,
    addExpense,
    activeTab, 
    setActiveTab 
  } = useContext(AppContext);

  // States
  const [viewMode, setViewMode] = useState('list'); // list, create_bill, comparison
  const [searchTerm, setSearchTerm] = useState('');
  
  // Simulated purchases list (bills)
  const [bills, setBills] = useState([
    { id: 'BILL-001', supplierName: 'PT Distributor IT Nasional', date: '2026-06-01', amount: 15000000, status: 'Lunas', item: '10x Keyboard Mechanical Keychron K2' },
    { id: 'BILL-002', supplierName: 'CV Indo Furnitureindo', date: '2026-06-11', amount: 9000000, status: 'Belum Lunas', item: '5x Kursi Kantor ErgoComfort' },
  ]);

  // Supplier form
  const [suppName, setSuppName] = useState('');
  const [suppEmail, setSuppEmail] = useState('');
  const [suppPhone, setSuppPhone] = useState('');
  const [suppCompany, setSuppCompany] = useState('');
  const [suppAddress, setSuppAddress] = useState('');

  // Bill form state
  const [billSupplier, setBillSupplier] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [billProduct, setBillProduct] = useState('');
  const [billQty, setBillQty] = useState(1);
  const [billPrice, setBillPrice] = useState(0);

  // Price comparison simulator state
  const [compareCategory, setCompareCategory] = useState('Laptop');
  const [compareResults, setCompareResults] = useState([]);
  const [isComparing, setIsComparing] = useState(false);

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Add Bill Submit
  const handleCreateBill = (e) => {
    e.preventDefault();
    if (!billSupplier || !billProduct) return;
    
    const prod = products.find(p => p.id === billProduct);
    const totalAmount = billQty * billPrice;
    const newBillId = `BILL-00${bills.length + 1}`;

    const newBill = {
      id: newBillId,
      supplierName: billSupplier,
      date: billDate,
      amount: totalAmount,
      status: 'Belum Lunas',
      item: `${billQty}x ${prod ? prod.name : 'Produk'}`
    };

    setBills([newBill, ...bills]);

    // Update stock levels in AppContext
    if (prod) {
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, stock: p.stock + Number(billQty), purchasePrice: Number(billPrice) } : p));
    }

    setViewMode('list');
  };

  // Pay bill helper
  const handlePayBill = (billId) => {
    setBills(prev => prev.map(b => {
      if (b.id === billId) {
        // Log as expense
        addExpense({
          id: `EXP-B-${b.id}`,
          category: 'Pembelian Stok',
          description: `Pelunasan tagihan ${b.id} kepada ${b.supplierName}`,
          date: new Date().toISOString().split('T')[0],
          amount: b.amount,
          account: '5-505 (Beban Administrasi/Pembelian)'
        });
        return { ...b, status: 'Lunas' };
      }
      return b;
    }));
  };

  // Create Supplier Submit
  const handleCreateSupplier = (e) => {
    e.preventDefault();
    if (!suppName) return;
    const newContact = {
      id: `S${String(contacts.length + 1).padStart(3, '0')}`,
      name: suppName,
      email: suppEmail,
      phone: suppPhone,
      company: suppCompany || 'Personal',
      address: suppAddress,
      type: 'Supplier'
    };
    addContact(newContact);
    setSuppName('');
    setSuppEmail('');
    setSuppPhone('');
    setSuppCompany('');
    setSuppAddress('');
  };

  // Run price comparison simulation
  const runComparison = () => {
    setIsComparing(true);
    setTimeout(() => {
      let mockOffers = [];
      if (compareCategory === 'Laptop') {
        mockOffers = [
          { supplier: 'PT Distributor IT Nasional', price: 7200000, shipping: 150000, time: '2 Hari', rating: 4.8, stock: 'Tersedia' },
          { supplier: 'UD Aksesoris Gadget Indonesia', price: 7450000, shipping: 50000, time: '1 Hari', rating: 4.6, stock: 'Tersedia' },
          { supplier: 'Megabyte Mandiri Raya', price: 7100000, shipping: 300000, time: '4 Hari', rating: 4.2, stock: 'Terbatas' },
        ];
      } else if (compareCategory === 'Monitor') {
        mockOffers = [
          { supplier: 'PT Distributor IT Nasional', price: 1480000, shipping: 80000, time: '2 Hari', rating: 4.8, stock: 'Tersedia' },
          { supplier: 'UD Aksesoris Gadget Indonesia', price: 1420000, shipping: 120000, time: '3 Hari', rating: 4.5, stock: 'Terbatas' },
          { supplier: 'CV Elektro Nusantara', price: 1510000, shipping: 30000, time: '1 Hari', rating: 4.9, stock: 'Tersedia' },
        ];
      } else {
        mockOffers = [
          { supplier: 'CV Indo Furnitureindo', price: 1750000, shipping: 250000, time: '5 Hari', rating: 4.7, stock: 'Indent' },
          { supplier: 'Jaya Mandiri Mebel', price: 1850000, shipping: 100000, time: '2 Hari', rating: 4.3, stock: 'Tersedia' },
          { supplier: 'PT Woodcraft Indonesia', price: 1720000, shipping: 350000, time: '7 Hari', rating: 4.9, stock: 'Indent' },
        ];
      }

      // Calculate total cost (price + shipping)
      const mapped = mockOffers.map(o => ({
        ...o,
        totalCost: o.price + o.shipping
      })).sort((a, b) => a.totalCost - b.totalCost);

      setCompareResults(mapped);
      setIsComparing(false);
    }, 800);
  };

  const handleCheckoutComparison = (offer) => {
    // Generate bill
    const newBillId = `BILL-CMP-${bills.length + 1}`;
    const newBill = {
      id: newBillId,
      supplierName: offer.supplier,
      date: new Date().toISOString().split('T')[0],
      amount: offer.totalCost,
      status: 'Belum Lunas',
      item: `1x Pembelian ${compareCategory} (Simulasi Perbandingan)`
    };
    setBills([newBill, ...bills]);
    alert(`Berhasil membuat Purchase Order (PO) ke ${offer.supplier}. Data masuk ke Daftar Tagihan.`);
    setActiveTab('purchasing');
    setViewMode('list');
  };

  const activeSuppliers = contacts.filter(c => c.type === 'Supplier');

  return (
    <div className="module-container animate-fade-in">
      {/* Tab routing inside Pembelian */}
      {activeTab === 'purchasing' && viewMode === 'list' && (
        <div>
          <div className="module-header-actions">
            <div>
              <h2 className="module-title">Purchasing & Pembelian</h2>
              <p className="module-subtitle">Catat tagihan dari supplier dan buat order pembelian stok barang</p>
            </div>
            <div className="flex-row gap-2">
              <button className="btn btn-secondary" onClick={() => { setActiveTab('price-comparison'); runComparison(); }}>
                <TrendingUp size={16} />
                <span>Bandingkan Harga</span>
              </button>
              <button className="btn btn-primary" onClick={() => setViewMode('create_bill')}>
                <Plus size={16} />
                <span>Buat Tagihan Baru</span>
              </button>
            </div>
          </div>

          <div className="table-responsive card">
            <table className="table">
              <thead>
                <tr>
                  <th>No. Tagihan</th>
                  <th>Supplier</th>
                  <th>Tanggal</th>
                  <th>Item Barang</th>
                  <th>Total Biaya</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(b => (
                  <tr key={b.id}>
                    <td className="font-semibold">{b.id}</td>
                    <td>{b.supplierName}</td>
                    <td>{b.date}</td>
                    <td>{b.item}</td>
                    <td className="font-semibold">{formatIDR(b.amount)}</td>
                    <td>
                      <span className={`badge ${b.status === 'Lunas' ? 'badge-success' : 'badge-warning'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {b.status !== 'Lunas' && (
                        <button className="btn btn-xs btn-success" onClick={() => handlePayBill(b.id)}>
                          Lunasi Tagihan
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'purchasing' && viewMode === 'create_bill' && (
        <div className="card max-w-xl mx-auto">
          <h4>Catat Tagihan Pembelian (Supplier Bill)</h4>
          <form onSubmit={handleCreateBill} className="mt-4">
            <div className="form-group">
              <label>Supplier / Vendor</label>
              <select value={billSupplier} onChange={(e) => setBillSupplier(e.target.value)} required>
                <option value="">-- Pilih Supplier --</option>
                {activeSuppliers.map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.company})</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Tanggal Tagihan</label>
              <input type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Pilih Produk (Stok Masuk)</label>
              <select value={billProduct} onChange={(e) => {
                setBillProduct(e.target.value);
                const p = products.find(prod => prod.id === e.target.value);
                if (p) setBillPrice(p.purchasePrice);
              }} required>
                <option value="">-- Pilih Produk --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="grid-2-cols">
              <div className="form-group">
                <label>Jumlah Kuantitas</label>
                <input type="number" min="1" value={billQty} onChange={(e) => setBillQty(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Harga Satuan Beli (Rp)</label>
                <input type="number" value={billPrice} onChange={(e) => setBillPrice(e.target.value)} required />
              </div>
            </div>

            <div className="form-total-banner">
              <span>Estimasi Pengeluaran:</span>
              <strong className="text-xl">{formatIDR(billQty * billPrice)}</strong>
            </div>

            <div className="form-action-footer">
              <button type="button" className="btn btn-ghost" onClick={() => setViewMode('list')}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary">
                Simpan & Tambah Stok
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Supplier Management SubTab */}
      {activeTab === 'suppliers' && (
        <div>
          <div className="module-header-actions">
            <div>
              <h2 className="module-title">Database Supplier / Vendor</h2>
              <p className="module-subtitle">Kelola daftar penyuplai bahan baku, peralatan, dan jasa kantor</p>
            </div>
          </div>

          <div className="grid-split-layout">
            <div className="card">
              <h4>Daftar Supplier Mitra</h4>
              <div className="table-responsive mt-3">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nama Supplier</th>
                      <th>Perusahaan</th>
                      <th>Telepon</th>
                      <th>Alamat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSuppliers.map(s => (
                      <tr key={s.id}>
                        <td className="font-semibold">{s.name}</td>
                        <td>{s.company}</td>
                        <td>{s.phone}</td>
                        <td>{s.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <h4>Daftarkan Supplier Baru</h4>
              <form onSubmit={handleCreateSupplier} className="mt-4">
                <div className="form-group">
                  <label>Nama Kontak Sales / Admin *</label>
                  <input type="text" value={suppName} onChange={(e) => setSuppName(e.target.value)} placeholder="Contoh: Linda Siregar" required />
                </div>
                <div className="form-group">
                  <label>Nama Perusahaan Supplier *</label>
                  <input type="text" value={suppCompany} onChange={(e) => setSuppCompany(e.target.value)} placeholder="Contoh: PT Kayu Mebel Utama" required />
                </div>
                <div className="form-group">
                  <label>No. Telepon / Kantor</label>
                  <input type="text" value={suppPhone} onChange={(e) => setSuppPhone(e.target.value)} placeholder="Contoh: 021-998811" />
                </div>
                <div className="form-group">
                  <label>Email Sales</label>
                  <input type="email" value={suppEmail} onChange={(e) => setSuppEmail(e.target.value)} placeholder="Contoh: sales@kayumebel.com" />
                </div>
                <div className="form-group">
                  <label>Alamat Gudang / Kantor Supplier</label>
                  <textarea rows="3" value={suppAddress} onChange={(e) => setSuppAddress(e.target.value)} placeholder="Alamat pengiriman retur / PO..."></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-full mt-2">
                  Daftarkan Supplier
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Price Comparison Simulator SubTab */}
      {activeTab === 'price-comparison' && (
        <div>
          <div className="module-header-actions">
            <div>
              <h2 className="module-title">Perbandingan Harga Vendor</h2>
              <p className="module-subtitle">Gunakan sistem analisis pencocokan harga produk dari berbagai penyuplai mitra</p>
            </div>
          </div>

          <div className="card max-w-3xl mx-auto">
            <h4>Bandingkan Penawaran Barang</h4>
            <div className="comparison-controls mt-4">
              <div className="form-group">
                <label>Kategori Produk</label>
                <select value={compareCategory} onChange={(e) => setCompareCategory(e.target.value)}>
                  <option value="Laptop">Laptop Bisnis</option>
                  <option value="Monitor">Monitor IPS Office</option>
                  <option value="Kursi">Kursi Kerja Kantor</option>
                </select>
              </div>
              <button className="btn btn-primary mt-6" onClick={runComparison} disabled={isComparing}>
                {isComparing ? <RefreshCw className="animate-spin" size={16} /> : 'Cari Penawaran Terbaik'}
              </button>
            </div>

            {isComparing && (
              <div className="text-center py-12">
                <RefreshCw className="animate-spin text-blue mb-2" size={32} style={{ display: 'inline-block' }} />
                <p>Menghubungi API vendor dan memproses analisis biaya...</p>
              </div>
            )}

            {!isComparing && compareResults.length > 0 && (
              <div className="comparison-results mt-6">
                <h5>Hasil Perbandingan (Urut dari Termurah):</h5>
                <div className="offers-grid mt-3">
                  {compareResults.map((offer, index) => (
                    <div key={index} className={`offer-item-card ${index === 0 ? 'best-deal' : ''}`}>
                      {index === 0 && (
                        <span className="best-deal-badge">
                          <Tag size={12} /> Rekomendasi Terhemat
                        </span>
                      )}
                      <div className="offer-header">
                        <h6>{offer.supplier}</h6>
                        <span className="rating-pill">⭐ {offer.rating}</span>
                      </div>
                      <div className="offer-details">
                        <div className="detail-row">
                          <span>Harga Satuan:</span>
                          <strong>{formatIDR(offer.price)}</strong>
                        </div>
                        <div className="detail-row">
                          <span>Biaya Ongkir:</span>
                          <span>{formatIDR(offer.shipping)}</span>
                        </div>
                        <div className="detail-row">
                          <span>Estimasi Tiba:</span>
                          <span>{offer.time}</span>
                        </div>
                        <div className="detail-row">
                          <span>Status Stok:</span>
                          <span className="text-success font-semibold">{offer.stock}</span>
                        </div>
                      </div>
                      <div className="offer-footer">
                        <div className="total-cost-box">
                          <span>Total Pengeluaran:</span>
                          <strong>{formatIDR(offer.totalCost)}</strong>
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={() => handleCheckoutComparison(offer)}>
                          <ShoppingCart size={14} />
                          <span>Pesan PO</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
