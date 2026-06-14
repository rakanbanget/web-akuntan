import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  FileCheck, 
  Share2, 
  Link2, 
  Smartphone, 
  CheckCircle, 
  QrCode, 
  Globe, 
  Database, 
  CheckSquare, 
  AlertCircle
} from 'lucide-react';

export default function LayananTambahan() {
  const { eMeteraiLogs, addEMeteraiLog, referrals, addReferral } = useContext(AppContext);
  const [activeExtraSubTab, setActiveExtraSubTab] = useState('emeterai'); // emeterai, referral, paymentgateway, integrations

  // e-Meterai states
  const [stampBalance, setStampBalance] = useState(8);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isStamping, setIsStamping] = useState(false);

  // Referral states
  const [copiedLink, setCopiedLink] = useState(false);
  const [refName, setRefName] = useState('');
  const [refPlan, setRefPlan] = useState('Professional Plan');

  // Payment Gateway states
  const [gatewayAmount, setGatewayAmount] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // e-Meterai seal document
  const handleStampDocument = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    if (stampBalance <= 0) {
      alert('Kuota e-Meterai Anda habis! Silakan lakukan top-up terlebih dahulu.');
      return;
    }

    setIsStamping(true);
    setTimeout(() => {
      const serial = `MTR-${Math.floor(10000000 + Math.random() * 90000000)}-10K`;
      const log = {
        id: `EMT-00${eMeteraiLogs.length + 1}`,
        docName: selectedFile.name,
        docType: 'Dokumen Pajak/Invoice',
        date: new Date().toLocaleString('id-ID').slice(0, 16),
        stampSerial: serial,
        status: 'Sukses'
      };

      addEMeteraiLog(log);
      setStampBalance(prev => prev - 1);
      setIsStamping(false);
      setSelectedFile(null);
      alert(`e-Meterai Rp 10.000 BERHASIL ditempelkan pada dokumen. Serial: ${serial}`);
    }, 1200);
  };

  // Referral registration
  const handleRegisterReferral = (e) => {
    e.preventDefault();
    if (!refName) return;

    const newRef = {
      id: `REF-00${referrals.length + 1}`,
      name: refName,
      dateJoined: new Date().toISOString().split('T')[0],
      planSelected: refPlan,
      bonusEarned: refPlan.includes('Professional') ? 250000 : 100000,
      status: 'Menunggu Verifikasi'
    };

    addReferral(newRef);
    setRefName('');
    alert('Simulasi referral ditambahkan. Status bonus menunggu verifikasi sistem.');
  };

  // Generate Payment Gateway Link
  const handleGeneratePaymentLink = (e) => {
    e.preventDefault();
    if (!gatewayAmount) return;
    const cleanAmt = parseFloat(gatewayAmount);
    const linkId = Math.floor(100000 + Math.random() * 900000);
    setGeneratedLink(`https://checkout.akuntanku.co.id/pay/invoice-${linkId}?amount=${cleanAmt}`);
  };

  const copyRefLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header-actions">
        <div>
          <h2 className="module-title">Layanan Tambahan & Hub Integrasi</h2>
          <p className="module-subtitle">Perluas fungsionalitas sistem Anda dengan e-Meterai resmi, penagihan digital, komisi referral, dan API pihak ketiga</p>
        </div>
      </div>

      {/* Selector sub-tabs */}
      <div className="filter-group mb-6">
        <button className={`filter-btn ${activeExtraSubTab === 'emeterai' ? 'active' : ''}`} onClick={() => setActiveExtraSubTab('emeterai')}>
          <FileCheck size={16} />
          <span>e-Meterai</span>
        </button>
        <button className={`filter-btn ${activeExtraSubTab === 'referral' ? 'active' : ''}`} onClick={() => setActiveExtraSubTab('referral')}>
          <Share2 size={16} />
          <span>Program Referal</span>
        </button>
        <button className={`filter-btn ${activeExtraSubTab === 'paymentgateway' ? 'active' : ''}`} onClick={() => setActiveExtraSubTab('paymentgateway')}>
          <Link2 size={16} />
          <span>Payment Gateway Link</span>
        </button>
        <button className={`filter-btn ${activeExtraSubTab === 'integrations' ? 'active' : ''}`} onClick={() => setActiveExtraSubTab('integrations')}>
          <Globe size={16} />
          <span>Integrasi API</span>
        </button>
      </div>

      {/* ================= E-METERAI SECTION ================= */}
      {activeExtraSubTab === 'emeterai' && (
        <div className="grid-split-layout">
          {/* Upload panel */}
          <div className="card">
            <h4>Pembubuhan Digital e-Meterai Rp10.000</h4>
            <p className="text-muted text-sm mb-4">Materaikan invoice, kontrak kerja, atau surat resmi secara digital sesuai standar Perum Peruri.</p>
            
            <div className="quota-meter-box text-center py-4 border bg-light mb-4">
              <span>Sisa Kuota Materai Anda:</span>
              <h2 className="text-3xl font-bold text-success mt-1">{stampBalance} pcs</h2>
              <button className="btn btn-xs btn-secondary mt-2" onClick={() => setStampBalance(prev => prev + 5)}>Top-up Kuota</button>
            </div>

            <form onSubmit={handleStampDocument}>
              <div className="form-group border-dashed-upload p-6 text-center mb-4">
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => setSelectedFile(e.target.files[0])} 
                  id="pdf-upload" 
                  className="hidden-file-input"
                />
                <label htmlFor="pdf-upload" style={{ cursor: 'pointer' }}>
                  <FileCheck size={32} className="text-muted mb-2" style={{ display: 'inline-block' }} />
                  <h6>{selectedFile ? selectedFile.name : 'Pilih File Dokumen PDF'}</h6>
                  <span className="text-xs text-muted">{selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Maksimal ukuran file: 10MB'}</span>
                </label>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={!selectedFile || isStamping}
              >
                {isStamping ? 'Menempelkan e-Meterai...' : 'Materaikan Dokumen'}
              </button>
            </form>
          </div>

          {/* Logs panel */}
          <div className="card col-span-2">
            <h4>Riwayat Pembubuhan e-Meterai</h4>
            <div className="table-responsive mt-3">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID Transaksi</th>
                    <th>Nama Dokumen</th>
                    <th>Tanggal Tempel</th>
                    <th>Nomor Seri e-Meterai</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {eMeteraiLogs.map(log => (
                    <tr key={log.id}>
                      <td className="font-semibold text-sm">{log.id}</td>
                      <td>{log.docName}</td>
                      <td>{log.date}</td>
                      <td className="font-mono text-sm font-semibold">{log.stampSerial}</td>
                      <td>
                        <span className="badge badge-success">{log.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= REFERRAL SECTION ================= */}
      {activeExtraSubTab === 'referral' && (
        <div className="grid-split-layout">
          {/* Share panel */}
          <div className="card">
            <h4>Program Kemitraan Referral</h4>
            <p className="text-muted text-sm mb-4">Dapatkan komisi saldo tunai dengan merekomendasikan AkuntanKu kepada kolega bisnis Anda.</p>
            
            <div className="form-group">
              <label>Link Referral Anda:</label>
              <div className="flex-row gap-2 mt-1">
                <input 
                  type="text" 
                  value="https://akuntanku.co.id/ref/sofiaamanda" 
                  readOnly 
                  className="bg-light"
                />
                <button className="btn btn-secondary" onClick={copyRefLink}>
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            <form onSubmit={handleRegisterReferral} className="border-top pt-4 mt-4">
              <h5>Simulasikan Registrasi Teman Baru:</h5>
              <div className="form-group mt-2">
                <label>Nama Kontak Relasi *</label>
                <input type="text" value={refName} onChange={(e) => setRefName(e.target.value)} placeholder="Contoh: PT Bangun Persada" required />
              </div>
              <div className="form-group">
                <label>Paket Dipilih</label>
                <select value={refPlan} onChange={(e) => setRefPlan(e.target.value)}>
                  <option value="Starter Plan">Starter Plan (Komisi Rp 100K)</option>
                  <option value="Professional Plan">Professional Plan (Komisi Rp 250K)</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-full">Klaim Pendaftaran Teman</button>
            </form>
          </div>

          {/* Referral leads list */}
          <div className="card col-span-2">
            <h4>Daftar Referral Anda</h4>
            <div className="table-responsive mt-3">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama Relasi Terdaftar</th>
                    <th>Tanggal Gabung</th>
                    <th>Paket Layanan</th>
                    <th>Komisi Bonus</th>
                    <th>Status Klaim</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map(ref => (
                    <tr key={ref.id}>
                      <td className="font-semibold text-sm">{ref.id}</td>
                      <td>{ref.name}</td>
                      <td>{ref.dateJoined}</td>
                      <td><span className="badge badge-neutral">{ref.planSelected}</span></td>
                      <td className="font-semibold text-success">{formatIDR(ref.bonusEarned)}</td>
                      <td>
                        <span className={`badge ${ref.status === 'Sudah Cair' ? 'badge-success' : 'badge-warning'}`}>
                          {ref.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= PAYMENT GATEWAY SECTION ================= */}
      {activeExtraSubTab === 'paymentgateway' && (
        <div className="card max-w-xl mx-auto">
          <h4>Generator Link Pembayaran Online</h4>
          <p className="text-muted text-sm mb-4">Buat link pembayaran tagihan instan terintegrasi Midtrans / Xendit. Pelanggan bisa membayar menggunakan QRIS, E-Wallet, atau Virtual Account.</p>

          <form onSubmit={handleGeneratePaymentLink}>
            <div className="form-group">
              <label>Jumlah Nominal Tagihan (Rp) *</label>
              <input 
                type="number" 
                value={gatewayAmount} 
                onChange={(e) => setGatewayAmount(e.target.value)} 
                placeholder="Contoh: 1500000" 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">Buat Invoice Link Pembayaran</button>
          </form>

          {generatedLink && (
            <div className="payment-link-result mt-6 p-4 bg-light border border-radius-sm">
              <span className="section-label">Link Pembayaran Terbit:</span>
              <p className="text-xs text-link font-mono select-all break-all mt-1">{generatedLink}</p>
              
              <div className="flex-row gap-2 mt-4 justify-center">
                <button className="btn btn-sm btn-secondary" onClick={() => setShowQRModal(true)}>
                  <QrCode size={14} />
                  <span>Tampilkan Kode QRIS</span>
                </button>
                <button className="btn btn-sm btn-ghost" onClick={() => alert('Link Pembayaran Disalin ke Clipboard')}>
                  Copy Link
                </button>
              </div>
            </div>
          )}

          {/* QRIS Simulated Modal */}
          {showQRModal && (
            <div className="pos-modal-overlay">
              <div className="pos-modal-content card text-center max-w-xs">
                <h5>Simulasi QRIS Midtrans</h5>
                <p className="text-xs text-muted">Scan QRIS di bawah ini untuk melunasi tagihan</p>
                <div className="qris-img-box my-4 p-2 bg-white border inline-block">
                  <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=200&q=80" alt="QRIS Mock" width="180" height="180" className="grayscale" />
                </div>
                <h4 className="font-bold text-success">{formatIDR(gatewayAmount)}</h4>
                <button className="btn btn-primary btn-sm w-full mt-4" onClick={() => { setShowQRModal(false); setGeneratedLink(''); setGatewayAmount(''); alert('Simulasi Pembayaran QRIS Berhasil Dilunasi.'); }}>
                  Sudah Bayar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= INTEGRATIONS API SECTION ================= */}
      {activeExtraSubTab === 'integrations' && (
        <div>
          <h4>Daftar Konektor & Integrasi API</h4>
          <p className="text-muted text-sm mb-6">Hubungkan data pembukuan AkuntanKu dengan berbagai software eksternal pilihan Anda.</p>

          <div className="integrations-grid">
            <div className="card integration-item-card">
              <div className="integration-header-row">
                <h5 className="integration-name">WhatsApp Gateway Notification</h5>
                <span className="badge badge-success">Terhubung</span>
              </div>
              <p className="integration-desc">Kirim tagihan otomatis via WhatsApp langsung ke nomor HP pelanggan saat invoice diterbitkan.</p>
              <div className="integration-footer">
                <span className="text-xs text-muted">API Kunci: *******_wa_api</span>
                <button className="btn btn-xs btn-ghost text-danger" onClick={() => alert('Integrasi WhatsApp dinonaktifkan')}>Disconnect</button>
              </div>
            </div>

            <div className="card integration-item-card">
              <div className="integration-header-row">
                <h5 className="integration-name">Midtrans Payment Gateway</h5>
                <span className="badge badge-success">Terhubung</span>
              </div>
              <p className="integration-desc">Aktifkan sinkronisasi otomatis status pembayaran tagihan dengan webhooks Midtrans.</p>
              <div className="integration-footer">
                <span className="text-xs text-muted">Merchant ID: mid_283819</span>
                <button className="btn btn-xs btn-ghost text-danger" onClick={() => alert('Integrasi Midtrans dinonaktifkan')}>Disconnect</button>
              </div>
            </div>

            <div className="card integration-item-card">
              <div className="integration-header-row">
                <h5 className="integration-name">Shopee & Tokopedia Sync</h5>
                <span className="badge badge-warning">Menunggu Otorisasi</span>
              </div>
              <p className="integration-desc">Tarik pesanan online marketplace langsung menjadi draf invoice penjualan & potong stok inventori otomatis.</p>
              <div className="integration-footer">
                <span className="text-xs text-muted">Toko: Belum Tersambung</span>
                <button className="btn btn-xs btn-primary" onClick={() => alert('Membuka OAuth 2.0 Tokopedia/Shopee API Login...')}>Sambungkan Toko</button>
              </div>
            </div>

            <div className="card integration-item-card">
              <div className="integration-header-row">
                <h5 className="integration-name">DJP PajakKu API</h5>
                <span className="badge badge-neutral">Non-Aktif</span>
              </div>
              <p className="integration-desc">Pelaporan SPT Masa PPN 11% bulanan langsung ke sistem Direktorat Jenderal Pajak (DJP) Indonesia.</p>
              <div className="integration-footer">
                <span className="text-xs text-muted">NPWP: Belum Dimasukkan</span>
                <button className="btn btn-xs btn-secondary" onClick={() => alert('Mengaktifkan integrasi DJP PajakKu...')}>Aktifkan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
