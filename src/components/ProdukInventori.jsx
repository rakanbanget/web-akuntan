import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Plus, Search, Edit3, Save, AlertTriangle, ShieldCheck, CornerDownRight } from 'lucide-react';

export default function ProdukInventori() {
  const { products, addProduct, updateProductStock, setProducts } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Add Product Form State
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodCategory, setProdCategory] = useState('Elektronik');
  const [prodPurPrice, setProdPurPrice] = useState('');
  const [prodSalPrice, setProdSalPrice] = useState('');
  const [prodStock, setProdStock] = useState('');

  // Stock Adjust Modal/Form state
  const [adjustProductId, setAdjustProductId] = useState('');
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustType, setAdjustType] = useState('tambah'); // tambah, kurang

  // Adjustment History log
  const [stockLogs, setStockLogs] = useState([
    { id: 'LOG-001', name: 'Laptop ASUS VivoBook', type: 'tambah', qty: 5, date: '2026-06-01', desc: 'Restock Pembelian Supplier' },
    { id: 'LOG-002', name: 'Monitor LG 24 Inch IPS', type: 'kurang', qty: 2, date: '2026-06-03', desc: 'Keluar Invoice INV-2026-001' },
  ]);

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!prodName || !prodSku || !prodPurPrice || !prodSalPrice || !prodStock) return;

    const newProd = {
      id: `P00${products.length + 1}`,
      name: prodName,
      sku: prodSku,
      category: prodCategory,
      purchasePrice: parseFloat(prodPurPrice),
      salesPrice: parseFloat(prodSalPrice),
      stock: parseInt(prodStock)
    };

    addProduct(newProd);

    // Reset fields
    setProdName('');
    setProdSku('');
    setProdPurPrice('');
    setProdSalPrice('');
    setProdStock('');
    setShowAddForm(false);

    // Log stock event
    setStockLogs([
      {
        id: `LOG-00${stockLogs.length + 1}`,
        name: newProd.name,
        type: 'tambah',
        qty: newProd.stock,
        date: new Date().toISOString().split('T')[0],
        desc: 'Stok Awal Produk Baru Baru Didaftarkan'
      },
      ...stockLogs
    ]);
  };

  const handleAdjustStockSubmit = (e) => {
    e.preventDefault();
    if (!adjustProductId || !adjustQty) return;

    const prod = products.find(p => p.id === adjustProductId);
    if (!prod) return;

    const qtyVal = parseInt(adjustQty);
    const newStock = adjustType === 'tambah' ? prod.stock + qtyVal : Math.max(0, prod.stock - qtyVal);
    
    updateProductStock(adjustProductId, newStock);

    // Save logs
    setStockLogs([
      {
        id: `LOG-00${stockLogs.length + 1}`,
        name: prod.name,
        type: adjustType,
        qty: qtyVal,
        date: new Date().toISOString().split('T')[0],
        desc: adjustType === 'tambah' ? 'Penyesuaian Manual (Masuk)' : 'Penyesuaian Manual (Keluar / Rusak)'
      },
      ...stockLogs
    ]);

    setAdjustProductId('');
    setAdjustQty('');
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header-actions">
        <div>
          <h2 className="module-title">Katalog Produk & Inventori</h2>
          <p className="module-subtitle">Kelola SKU produk, harga beli/jual, monitor stok fisik, dan log pergudangan</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      <div className="grid-split-layout">
        {/* Products Directory Grid */}
        <div className="card col-span-2">
          <div className="filter-search-row p-0 mb-4 border-none">
            <div className="search-wrapper">
              <Search className="search-icon" size={16} />
              <input 
                type="text" 
                placeholder="Cari SKU atau nama produk..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Nama Produk</th>
                  <th>Kategori</th>
                  <th>Harga Beli</th>
                  <th>Harga Jual</th>
                  <th>Fisik Stok</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td className="font-semibold text-sm">{p.sku}</td>
                    <td>{p.name}</td>
                    <td><span className="badge badge-neutral">{p.category}</span></td>
                    <td>{formatIDR(p.purchasePrice)}</td>
                    <td className="font-semibold">{formatIDR(p.salesPrice)}</td>
                    <td className="font-semibold">{p.stock} unit</td>
                    <td>
                      {p.stock <= 5 ? (
                        <span className="badge badge-danger flex-row align-center gap-1">
                          <AlertTriangle size={12} /> Kritis ({p.stock})
                        </span>
                      ) : p.stock <= 12 ? (
                        <span className="badge badge-warning flex-row align-center gap-1">
                          <AlertTriangle size={12} /> Menipis
                        </span>
                      ) : (
                        <span className="badge badge-success flex-row align-center gap-1">
                          <ShieldCheck size={12} /> Aman
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar forms */}
        <div className="flex-col gap-4">
          {/* Add Product Form */}
          {showAddForm && (
            <div className="card">
              <h4>Tambah Produk Katalog</h4>
              <form onSubmit={handleCreateProduct} className="mt-4">
                <div className="form-group">
                  <label>Nama Produk *</label>
                  <input type="text" value={prodName} onChange={(e) => setProdName(e.target.value)} placeholder="Contoh: Meja Kerja Jati" required />
                </div>
                <div className="form-group">
                  <label>Kode SKU / Barcode *</label>
                  <input type="text" value={prodSku} onChange={(e) => setProdSku(e.target.value)} placeholder="Contoh: MJ-JK-02" required />
                </div>
                <div className="form-group">
                  <label>Kategori</label>
                  <select value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                    <option value="Elektronik">Elektronik & Gadget</option>
                    <option value="Aksesoris">Aksesoris Kantor</option>
                    <option value="Furnitur">Furnitur & Interior</option>
                  </select>
                </div>
                <div className="grid-2-cols">
                  <div className="form-group">
                    <label>Harga Beli (Rp)</label>
                    <input type="number" value={prodPurPrice} onChange={(e) => setProdPurPrice(e.target.value)} placeholder="Beli" required />
                  </div>
                  <div className="form-group">
                    <label>Harga Jual (Rp)</label>
                    <input type="number" value={prodSalPrice} onChange={(e) => setProdSalPrice(e.target.value)} placeholder="Jual" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Kuantitas Stok Awal</label>
                  <input type="number" value={prodStock} onChange={(e) => setProdStock(e.target.value)} placeholder="Contoh: 10" required />
                </div>
                <button type="submit" className="btn btn-primary w-full mt-2">
                  Daftarkan Katalog
                </button>
              </form>
            </div>
          )}

          {/* Adjust Stock Form */}
          <div className="card">
            <h4>Penyesuaian Manual Stok Gudang</h4>
            <form onSubmit={handleAdjustStockSubmit} className="mt-4">
              <div className="form-group">
                <label>Pilih Barang</label>
                <select value={adjustProductId} onChange={(e) => setAdjustProductId(e.target.value)} required>
                  <option value="">-- Pilih Produk --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>
                  ))}
                </select>
              </div>

              <div className="grid-2-cols">
                <div className="form-group">
                  <label>Tipe Event</label>
                  <select value={adjustType} onChange={(e) => setAdjustType(e.target.value)}>
                    <option value="tambah">Masuk Gudang (+)</option>
                    <option value="kurang">Keluar Gudang (-)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Jumlah Unit</label>
                  <input type="number" min="1" value={adjustQty} onChange={(e) => setAdjustQty(e.target.value)} placeholder="Qty" required />
                </div>
              </div>
              <button type="submit" className="btn btn-secondary w-full mt-2">
                Update Stok Fisik
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Stock adjustment log sheet */}
      <div className="card mt-6">
        <h4>Histori Log Arus Masuk Keluar Barang (Mutasi Stok)</h4>
        <div className="table-responsive mt-3">
          <table className="table">
            <thead>
              <tr>
                <th>Tanggal Log</th>
                <th>Nama Produk</th>
                <th>Jenis Gerakan</th>
                <th>Kuantitas</th>
                <th>Keterangan Alasan</th>
              </tr>
            </thead>
            <tbody>
              {stockLogs.map(log => (
                <tr key={log.id}>
                  <td>{log.date}</td>
                  <td className="font-semibold">{log.name}</td>
                  <td>
                    <span className={`badge ${log.type === 'tambah' ? 'badge-success' : 'badge-danger'}`}>
                      {log.type === 'tambah' ? 'STOK MASUK (+)' : 'STOK KELUAR (-)'}
                    </span>
                  </td>
                  <td className="font-semibold">{log.qty} unit</td>
                  <td>{log.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
