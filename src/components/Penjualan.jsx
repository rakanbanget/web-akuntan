import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Plus, Trash2, Printer, Search, CheckCircle, Eye, AlertCircle, ArrowLeft, Send } from 'lucide-react';

export default function Penjualan() {
  const { 
    invoices, 
    addInvoice, 
    payInvoice,
    contacts, 
    addContact,
    products, 
    companyProfile, 
    activeTab, 
    setActiveTab 
  } = useContext(AppContext);

  // Sub-tabs switcher (Invoices vs Customers list)
  const isInvoiceTab = activeTab === 'invoices';

  // State management
  const [viewMode, setViewMode] = useState('list'); // list, create, preview
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  // Customer state
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custCompany, setCustCompany] = useState('');
  const [custAddress, setCustAddress] = useState('');

  // Invoice creator form state
  const [invoiceCustomer, setInvoiceCustomer] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceDueDate, setInvoiceDueDate] = useState('');
  const [invoiceNotes, setInvoiceNotes] = useState('Pembayaran ditransfer ke Bank BCA Rek. 888-999-111 a/n PT AkuntanKu');
  const [invoiceItems, setInvoiceItems] = useState([{ productId: '', quantity: 1, price: 0 }]);
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Add Item row in Invoice Form
  const addInvoiceItemRow = () => {
    setInvoiceItems([...invoiceItems, { productId: '', quantity: 1, price: 0 }]);
  };

  // Remove Item row
  const removeInvoiceItemRow = (index) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((_, idx) => idx !== index));
    }
  };

  // Handle Item Row change
  const handleItemRowChange = (index, field, val) => {
    const updated = [...invoiceItems];
    if (field === 'productId') {
      const prod = products.find(p => p.id === val);
      updated[index].productId = val;
      updated[index].price = prod ? prod.salesPrice : 0;
      updated[index].productName = prod ? prod.name : '';
    } else if (field === 'quantity') {
      updated[index].quantity = parseInt(val) || 1;
    } else if (field === 'price') {
      updated[index].price = parseFloat(val) || 0;
    }
    setInvoiceItems(updated);
  };

  // Calculate temporary pricing for form
  const getFormCalculations = () => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const tax = Math.round((subtotal - invoiceDiscount) * (companyProfile.taxRate / 100));
    const total = subtotal - invoiceDiscount + tax;
    return { subtotal, tax, total };
  };

  // Submit Invoice Creation
  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!invoiceCustomer) {
      alert('Silakan pilih pelanggan terlebih dahulu!');
      return;
    }
    if (invoiceItems.some(item => !item.productId)) {
      alert('Silakan pilih produk pada semua baris item!');
      return;
    }

    const { subtotal, tax, total } = getFormCalculations();
    const newInvId = `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`;

    const newInvoice = {
      id: newInvId,
      customerName: invoiceCustomer,
      date: invoiceDate,
      dueDate: invoiceDueDate || invoiceDate,
      status: 'Pending',
      items: invoiceItems.map(item => ({
        productId: item.productId,
        productName: products.find(p => p.id === item.productId).name,
        quantity: item.quantity,
        price: item.price
      })),
      discount: Number(invoiceDiscount) || 0,
      taxRate: companyProfile.taxRate,
      notes: invoiceNotes,
      subtotal,
      tax,
      total
    };

    addInvoice(newInvoice);
    setViewMode('list');
    // Reset form
    setInvoiceCustomer('');
    setInvoiceItems([{ productId: '', quantity: 1, price: 0 }]);
    setInvoiceDiscount(0);
  };

  // Create Customer Submit
  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!custName) return;
    const newContact = {
      id: `C${String(contacts.length + 1).padStart(3, '0')}`,
      name: custName,
      email: custEmail,
      phone: custPhone,
      company: custCompany || 'Personal',
      address: custAddress,
      type: 'Pelanggan'
    };
    addContact(newContact);
    // Reset form fields
    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setCustCompany('');
    setCustAddress('');
  };

  // Filter & Search Invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'Semua' || inv.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const activeCustomers = contacts.filter(c => c.type === 'Pelanggan');

  return (
    <div className="module-container animate-fade-in">
      {isInvoiceTab ? (
        /* ================= INVOICE TAB ================= */
        <div>
          {viewMode === 'list' && (
            <div>
              <div className="module-header-actions">
                <div>
                  <h2 className="module-title">Invoicing & Penjualan</h2>
                  <p className="module-subtitle">Kelola penawaran, tagihan, dan pantau piutang pelanggan</p>
                </div>
                <button className="btn btn-primary" onClick={() => setViewMode('create')}>
                  <Plus size={16} />
                  <span>Buat Invoice Baru</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="filter-search-row">
                <div className="search-wrapper">
                  <Search className="search-icon" size={16} />
                  <input 
                    type="text" 
                    placeholder="Cari invoice atau pelanggan..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  {['Semua', 'Lunas', 'Pending', 'Jatuh Tempo'].map(st => (
                    <button
                      key={st}
                      className={`filter-btn ${statusFilter === st ? 'active' : ''}`}
                      onClick={() => setStatusFilter(st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Invoices Table */}
              <div className="table-responsive card">
                <table className="table">
                  <thead>
                    <tr>
                      <th>No. Invoice</th>
                      <th>Pelanggan</th>
                      <th>Tanggal</th>
                      <th>Jatuh Tempo</th>
                      <th>Total Tagihan</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-8">
                          <AlertCircle size={24} className="text-muted mb-2" style={{ display: 'inline-block' }} />
                          <p>Tidak ada data invoice ditemukan</p>
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices.map(inv => (
                        <tr key={inv.id}>
                          <td className="font-semibold">{inv.id}</td>
                          <td>{inv.customerName}</td>
                          <td>{inv.date}</td>
                          <td>{inv.dueDate}</td>
                          <td className="font-semibold">{formatIDR(inv.total)}</td>
                          <td>
                            <span className={`badge ${
                              inv.status === 'Lunas' ? 'badge-success' : 
                              inv.status === 'Pending' ? 'badge-warning' : 'badge-danger'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="action-buttons-group">
                              <button 
                                className="icon-btn btn-ghost" 
                                title="Lihat/Cetak"
                                onClick={() => { setSelectedInvoice(inv); setViewMode('preview'); }}
                              >
                                <Eye size={16} />
                              </button>
                              {inv.status !== 'Lunas' && (
                                <button 
                                  className="icon-btn btn-success" 
                                  title="Tandai Lunas"
                                  onClick={() => payInvoice(inv.id)}
                                >
                                  <CheckCircle size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {viewMode === 'create' && (
            <div className="card max-w-4xl mx-auto">
              <div className="form-header">
                <button className="btn btn-ghost p-0 mr-4" onClick={() => setViewMode('list')}>
                  <ArrowLeft size={18} />
                </button>
                <h3>Buat Invoice Penjualan Baru</h3>
              </div>

              <form onSubmit={handleCreateInvoice} className="form-grid-layout">
                {/* Form fields */}
                <div className="form-group col-span-2">
                  <label>Pelanggan</label>
                  <select 
                    value={invoiceCustomer} 
                    onChange={(e) => setInvoiceCustomer(e.target.value)}
                    required
                  >
                    <option value="">-- Pilih Pelanggan --</option>
                    {activeCustomers.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.company})</option>
                    ))}
                  </select>
                  <p className="form-helper-text">
                    Belum ada pelanggan? <span className="text-link" onClick={() => setActiveTab('customers')}>Tambah di tab Pelanggan</span>
                  </p>
                </div>

                <div className="form-group">
                  <label>Tanggal Transaksi</label>
                  <input 
                    type="date" 
                    value={invoiceDate} 
                    onChange={(e) => setInvoiceDate(e.target.value)} 
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tanggal Jatuh Tempo</label>
                  <input 
                    type="date" 
                    value={invoiceDueDate} 
                    onChange={(e) => setInvoiceDueDate(e.target.value)} 
                    required
                  />
                </div>

                {/* Items Invoice Table */}
                <div className="col-span-4 item-rows-section">
                  <h4>Item Detail Tagihan</h4>
                  <table className="form-table">
                    <thead>
                      <tr>
                        <th>Pilih Produk</th>
                        <th width="100">Jumlah</th>
                        <th width="180">Harga Satuan</th>
                        <th width="150">Total</th>
                        <th width="40"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceItems.map((row, idx) => (
                        <tr key={idx}>
                          <td>
                            <select 
                              value={row.productId} 
                              onChange={(e) => handleItemRowChange(idx, 'productId', e.target.value)}
                              required
                            >
                              <option value="">-- Pilih Produk --</option>
                              {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input 
                              type="number" 
                              min="1" 
                              value={row.quantity} 
                              onChange={(e) => handleItemRowChange(idx, 'quantity', e.target.value)}
                              required
                            />
                          </td>
                          <td>
                            <input 
                              type="number" 
                              value={row.price} 
                              onChange={(e) => handleItemRowChange(idx, 'price', e.target.value)}
                              required
                            />
                          </td>
                          <td className="font-semibold align-middle">
                            {formatIDR(row.quantity * row.price)}
                          </td>
                          <td>
                            <button 
                              type="button" 
                              className="text-danger p-1" 
                              onClick={() => removeInvoiceItemRow(idx)}
                              disabled={invoiceItems.length === 1}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button type="button" className="btn btn-secondary btn-sm mt-3" onClick={addInvoiceItemRow}>
                    + Tambah Item
                  </button>
                </div>

                {/* Summaries & Notes */}
                <div className="col-span-2 form-group">
                  <label>Catatan Syarat & Ketentuan</label>
                  <textarea 
                    rows="4" 
                    value={invoiceNotes} 
                    onChange={(e) => setInvoiceNotes(e.target.value)}
                  ></textarea>
                </div>

                <div className="col-span-2 invoice-calculator-summary">
                  <div className="calc-row">
                    <span>Subtotal</span>
                    <span>{formatIDR(getFormCalculations().subtotal)}</span>
                  </div>
                  <div className="calc-row">
                    <span>Diskon Tambahan</span>
                    <input 
                      type="number" 
                      value={invoiceDiscount} 
                      onChange={(e) => setInvoiceDiscount(e.target.value)} 
                      style={{ width: '120px', textAlign: 'right' }}
                    />
                  </div>
                  <div className="calc-row">
                    <span>PPN ({companyProfile.taxRate}%)</span>
                    <span>{formatIDR(getFormCalculations().tax)}</span>
                  </div>
                  <div className="calc-row total-row">
                    <span>Total Bersih</span>
                    <span>{formatIDR(getFormCalculations().total)}</span>
                  </div>
                </div>

                <div className="col-span-4 form-action-footer">
                  <button type="button" className="btn btn-ghost" onClick={() => setViewMode('list')}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Simpan & Terbitkan Invoice
                  </button>
                </div>
              </form>
            </div>
          )}

          {viewMode === 'preview' && selectedInvoice && (
            <div className="max-w-3xl mx-auto">
              <div className="no-print mb-4 flex-row justify-between align-center">
                <button className="btn btn-secondary" onClick={() => setViewMode('list')}>
                  <ArrowLeft size={16} />
                  <span>Kembali</span>
                </button>
                <div className="flex-row gap-2">
                  {selectedInvoice.status !== 'Lunas' && (
                    <button 
                      className="btn btn-success" 
                      onClick={() => { payInvoice(selectedInvoice.id); setSelectedInvoice({...selectedInvoice, status: 'Lunas'}); }}
                    >
                      <CheckCircle size={16} />
                      <span>Pelunasan Tunai</span>
                    </button>
                  )}
                  <button className="btn btn-primary" onClick={() => window.print()}>
                    <Printer size={16} />
                    <span>Cetak Invoice</span>
                  </button>
                </div>
              </div>

              {/* Official Invoice Sheet */}
              <div className="invoice-paper card relative" id="print-area">
                {selectedInvoice.status === 'Lunas' && (
                  <div className="invoice-stamp paid">LUNAS</div>
                )}
                
                <div className="invoice-paper-header">
                  <div>
                    <h2 className="company-title">{companyProfile.name}</h2>
                    <p className="company-details">{companyProfile.address}</p>
                    <p className="company-details">Telp: {companyProfile.phone}</p>
                  </div>
                  <div className="text-right">
                    <h1 className="invoice-title-text">INVOICE</h1>
                    <p className="invoice-id-text">{selectedInvoice.id}</p>
                  </div>
                </div>

                <div className="invoice-paper-billing">
                  <div>
                    <span className="section-label">Ditagihkan Kepada:</span>
                    <h4 className="bill-to-name">{selectedInvoice.customerName}</h4>
                  </div>
                  <div className="text-right billing-dates">
                    <div>
                      <span>Tanggal Invoice:</span>
                      <strong>{selectedInvoice.date}</strong>
                    </div>
                    <div>
                      <span>Tanggal Jatuh Tempo:</span>
                      <strong>{selectedInvoice.dueDate}</strong>
                    </div>
                  </div>
                </div>

                <table className="invoice-paper-table">
                  <thead>
                    <tr>
                      <th>Deskripsi Item</th>
                      <th className="text-center" width="80">Qty</th>
                      <th className="text-right" width="150">Harga Satuan</th>
                      <th className="text-right" width="180">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.productName}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-right">{formatIDR(item.price)}</td>
                        <td className="text-right">{formatIDR(item.quantity * item.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="invoice-paper-summary">
                  <div className="summary-left-notes">
                    <span className="section-label">Catatan Pembayaran:</span>
                    <p>{selectedInvoice.notes}</p>
                  </div>
                  <div className="summary-right-totals">
                    <div className="row">
                      <span>Subtotal:</span>
                      <span>{formatIDR(selectedInvoice.subtotal)}</span>
                    </div>
                    {selectedInvoice.discount > 0 && (
                      <div className="row text-success">
                        <span>Potongan Diskon:</span>
                        <span>-{formatIDR(selectedInvoice.discount)}</span>
                      </div>
                    )}
                    <div className="row">
                      <span>PPN ({selectedInvoice.taxRate}%):</span>
                      <span>{formatIDR(selectedInvoice.tax)}</span>
                    </div>
                    <div className="row final-total">
                      <span>Total Bayar:</span>
                      <span>{formatIDR(selectedInvoice.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="invoice-paper-footer">
                  <div className="signature-col">
                    <p>Penerima,</p>
                    <div className="signature-line"></div>
                    <span>( __________________ )</span>
                  </div>
                  <div className="signature-col text-right">
                    <p>Hormat Kami,</p>
                    <div className="signature-line"></div>
                    <span>( Sofia Amanda )</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ================= CUSTOMERS TAB ================= */
        <div>
          <div className="module-header-actions">
            <div>
              <h2 className="module-title">Database Pelanggan</h2>
              <p className="module-subtitle">Kelola informasi kontak pelanggan dan histori relasi bisnis</p>
            </div>
          </div>

          <div className="grid-split-layout">
            {/* Customer List */}
            <div className="card">
              <h4>Daftar Pelanggan Aktif</h4>
              <div className="table-responsive mt-3">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Perusahaan</th>
                      <th>Telepon</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCustomers.map(c => (
                      <tr key={c.id}>
                        <td className="font-semibold">{c.name}</td>
                        <td>{c.company}</td>
                        <td>{c.phone}</td>
                        <td>{c.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Customer Form Creator */}
            <div className="card">
              <h4>Tambah Pelanggan Baru</h4>
              <form onSubmit={handleCreateCustomer} className="mt-4">
                <div className="form-group">
                  <label>Nama Kontak Utama *</label>
                  <input 
                    type="text" 
                    value={custName} 
                    onChange={(e) => setCustName(e.target.value)} 
                    placeholder="Contoh: Budi Santoso"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nama Perusahaan / Organisasi</label>
                  <input 
                    type="text" 
                    value={custCompany} 
                    onChange={(e) => setCustCompany(e.target.value)} 
                    placeholder="Contoh: PT Surya Jaya (kosongkan jika personal)"
                  />
                </div>
                <div className="form-group">
                  <label>No. HP / WhatsApp *</label>
                  <input 
                    type="text" 
                    value={custPhone} 
                    onChange={(e) => setCustPhone(e.target.value)} 
                    placeholder="Contoh: 08123456789"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Resmi</label>
                  <input 
                    type="email" 
                    value={custEmail} 
                    onChange={(e) => setCustEmail(e.target.value)} 
                    placeholder="Contoh: budi@surya.com"
                  />
                </div>
                <div className="form-group">
                  <label>Alamat Lengkap Kantor/Rumah</label>
                  <textarea 
                    rows="3" 
                    value={custAddress} 
                    onChange={(e) => setCustAddress(e.target.value)}
                    placeholder="Alamat penagihan atau pengiriman..."
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-full mt-2">
                  Daftarkan Pelanggan
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
