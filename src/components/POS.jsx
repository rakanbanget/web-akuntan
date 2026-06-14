import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ShoppingCart, Search, Trash2, CheckCircle, Smartphone, Printer, ArrowLeft } from 'lucide-react';

export default function POS() {
  const { products, addInvoice, companyProfile } = useContext(AppContext);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [discount, setDiscount] = useState(0);

  // Cash payment checkout states
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [cashAmount, setCashAmount] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [lastOrderReceipt, setLastOrderReceipt] = useState(null);

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Add item to cart
  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert('Stok produk habis!');
      return;
    }

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        alert('Tidak bisa menambah lebih dari stok yang tersedia!');
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Update quantity in cart
  const updateCartQty = (productId, change) => {
    const item = cart.find(i => i.id === productId);
    const prod = products.find(p => p.id === productId);
    if (!item || !prod) return;

    const newQty = item.quantity + change;
    if (newQty <= 0) {
      setCart(cart.filter(i => i.id !== productId));
    } else if (newQty > prod.stock) {
      alert('Batas stok terlampaui!');
    } else {
      setCart(cart.map(i => i.id === productId ? { ...i, quantity: newQty } : i));
    }
  };

  // Clear cart
  const clearCart = () => setCart([]);

  // Calculate cart pricing
  const getCartTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.salesPrice), 0);
    const total = Math.max(0, subtotal - discount);
    return { subtotal, total };
  };

  const { subtotal, total } = getCartTotals();

  // Complete cashier transaction
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    const paidVal = parseFloat(cashAmount) || 0;
    if (paidVal < total) {
      alert('Jumlah uang bayar kurang dari total transaksi!');
      return;
    }

    const orderId = `POS-${Date.now().toString().slice(-6)}`;
    const receiptObj = {
      orderId,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
      subtotal,
      discount,
      total,
      cashPaid: paidVal,
      change: paidVal - total
    };

    // Log the transaction in Penjualan invoices context
    addInvoice({
      id: orderId,
      customerName: 'Pelanggan Walk-in (Kasir POS)',
      date: receiptObj.date,
      dueDate: receiptObj.date,
      status: 'Lunas',
      items: cart.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.salesPrice
      })),
      discount: parseFloat(discount) || 0,
      taxRate: 0,
      notes: 'Transaksi diselesaikan via Terminal POS Kasir',
      subtotal,
      tax: 0,
      total
    });

    setLastOrderReceipt(receiptObj);
    setPaymentCompleted(true);
    setCart([]);
    setDiscount(0);
    setCashAmount('');
  };

  const categories = ['Semua', 'Elektronik', 'Aksesoris', 'Furnitur'];
  
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="module-container pos-module animate-fade-in">
      <div className="pos-layout">
        
        {/* Left Side: Product catalog grids */}
        <div className="pos-catalog-panel card">
          <div className="pos-search-filters">
            <div className="search-wrapper">
              <Search className="search-icon" size={16} />
              <input 
                type="text" 
                placeholder="Cari barcode / SKU / nama barang..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="pos-category-tabs">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`pos-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pos-products-grid">
            {filteredProducts.map(p => (
              <div 
                key={p.id} 
                className={`pos-product-card ${p.stock <= 0 ? 'out-of-stock' : ''}`}
                onClick={() => addToCart(p)}
              >
                <div className="product-img-placeholder">
                  <span className="sku-tag">{p.sku}</span>
                  <Smartphone size={24} className="text-muted" />
                </div>
                <div className="pos-product-info">
                  <h5>{p.name}</h5>
                  <div className="price-stock-row">
                    <span className="price">{formatIDR(p.salesPrice)}</span>
                    <span className={`stock ${p.stock <= 5 ? 'critical' : ''}`}>Stok: {p.stock}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Cashier cart list */}
        <div className="pos-cart-panel card">
          <div className="pos-cart-header">
            <h4><ShoppingCart size={18} /> Keranjang Belanja</h4>
            <button className="btn btn-xs btn-ghost text-danger" onClick={clearCart} disabled={cart.length === 0}>
              Kosongkan
            </button>
          </div>

          <div className="pos-cart-list">
            {cart.length === 0 ? (
              <div className="pos-empty-cart-state">
                <ShoppingCart size={48} className="text-muted mb-2" />
                <p>Belum ada produk dipilih</p>
                <span className="text-xs text-muted">Klik produk pada katalog kiri untuk menambahkan</span>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="pos-cart-item">
                  <div className="cart-item-details">
                    <h6>{item.name}</h6>
                    <span>{formatIDR(item.salesPrice)} x {item.quantity}</span>
                  </div>
                  <div className="cart-item-controls">
                    <button className="qty-adjust" onClick={() => updateCartQty(item.id, -1)}>-</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-adjust" onClick={() => updateCartQty(item.id, 1)}>+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing calculations */}
          <div className="pos-cart-checkout-box border-top">
            <div className="pos-calc-row">
              <span>Subtotal:</span>
              <strong>{formatIDR(subtotal)}</strong>
            </div>
            <div className="pos-calc-row">
              <span>Diskon (Rp):</span>
              <input 
                type="number" 
                value={discount} 
                onChange={(e) => setDiscount(e.target.value)} 
                className="pos-discount-input"
                placeholder="Diskon Rp"
              />
            </div>
            <div className="pos-calc-row pos-total-row border-top">
              <span>Total Tagihan:</span>
              <h2 className="text-primary font-bold">{formatIDR(total)}</h2>
            </div>
            
            <button 
              className="btn btn-primary w-full py-3 mt-4 text-md"
              disabled={cart.length === 0}
              onClick={() => setShowCheckoutModal(true)}
            >
              Bayar Transaksi
            </button>
          </div>
        </div>
      </div>

      {/* Checkout cash payment modal */}
      {showCheckoutModal && (
        <div className="pos-modal-overlay">
          <div className="pos-modal-content card">
            {!paymentCompleted ? (
              <div>
                <h4>Pembayaran Tunai (Checkout)</h4>
                <p className="text-muted text-sm mb-4">Input jumlah uang yang diserahkan pelanggan</p>
                
                <div className="total-to-pay-banner text-center py-4 bg-light">
                  <span>Total yang Harus Dibayar:</span>
                  <h2 className="text-2xl text-primary font-bold mt-1">{formatIDR(total)}</h2>
                </div>

                <form onSubmit={handleCheckoutSubmit} className="mt-4">
                  <div className="form-group">
                    <label>Jumlah Uang Cash (Rp)</label>
                    <input 
                      type="number" 
                      value={cashAmount} 
                      onChange={(e) => setCashAmount(e.target.value)}
                      placeholder="Contoh: 100000"
                      className="text-xl py-2 text-center"
                      required 
                      autoFocus
                    />
                  </div>

                  {cashAmount && parseFloat(cashAmount) >= total && (
                    <div className="change-calculation-box text-center text-success mt-2">
                      Kembalian Uang: <strong>{formatIDR(parseFloat(cashAmount) - total)}</strong>
                    </div>
                  )}

                  <div className="form-action-footer mt-4">
                    <button type="button" className="btn btn-ghost" onClick={() => setShowCheckoutModal(false)}>
                      Kembali
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Konfirmasi Bayar
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Receipt print simulator preview screen */
              lastOrderReceipt && (
                <div className="text-center">
                  <div className="receipt-success-badge mb-2">
                    <CheckCircle size={32} className="text-success" style={{ display: 'inline-block' }} />
                  </div>
                  <h4>Pembayaran Berhasil!</h4>
                  <p className="text-sm text-muted">Struk kasir diterbitkan otomatis</p>

                  {/* Cashier printed receipt layout */}
                  <div className="cashier-receipt-paper border mt-4 text-left p-4 font-mono text-xs">
                    <div className="text-center font-bold">
                      <p>KASIR AKUNTANKU</p>
                      <p>{companyProfile.name}</p>
                      <p>--------------------------------</p>
                    </div>
                    <div>
                      <p>No. Struk: {lastOrderReceipt.orderId}</p>
                      <p>Tanggal  : {lastOrderReceipt.date} {lastOrderReceipt.time}</p>
                      <p>Kasir    : Sofia Amanda</p>
                      <p>================================</p>
                    </div>
                    <div className="receipt-items-list my-2">
                      {lastOrderReceipt.items.map((item, idx) => (
                        <div key={idx} className="receipt-item-row flex-row justify-between">
                          <span>{item.name.slice(0, 16)} x{item.quantity}</span>
                          <span>{formatIDR(item.salesPrice * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p>================================</p>
                      <div className="flex-row justify-between">
                        <span>Subtotal:</span>
                        <span>{formatIDR(lastOrderReceipt.subtotal)}</span>
                      </div>
                      {lastOrderReceipt.discount > 0 && (
                        <div className="flex-row justify-between text-success">
                          <span>Diskon:</span>
                          <span>-{formatIDR(lastOrderReceipt.discount)}</span>
                        </div>
                      )}
                      <div className="flex-row justify-between font-bold">
                        <span>Total Bayar:</span>
                        <span>{formatIDR(lastOrderReceipt.total)}</span>
                      </div>
                      <p>--------------------------------</p>
                      <div className="flex-row justify-between">
                        <span>Tunai / Bayar:</span>
                        <span>{formatIDR(lastOrderReceipt.cashPaid)}</span>
                      </div>
                      <div className="flex-row justify-between">
                        <span>Kembalian:</span>
                        <span>{formatIDR(lastOrderReceipt.change)}</span>
                      </div>
                      <p>================================</p>
                    </div>
                    <div className="text-center text-xs mt-4">
                      <p>Terima Kasih</p>
                      <p>Sudah Berbelanja!</p>
                    </div>
                  </div>

                  <div className="flex-row gap-2 justify-center mt-6">
                    <button className="btn btn-secondary" onClick={() => window.print()}>
                      <Printer size={16} />
                      <span>Cetak Struk</span>
                    </button>
                    <button className="btn btn-primary" onClick={() => { setShowCheckoutModal(false); setPaymentCompleted(false); }}>
                      Transaksi Baru
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
