import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Save, Building, Percent, Landmark } from 'lucide-react';

export default function Pengaturan() {
  const { companyProfile, setCompanyProfile } = useContext(AppContext);

  // Form States
  const [name, setName] = useState(companyProfile.name);
  const [address, setAddress] = useState(companyProfile.address);
  const [phone, setPhone] = useState(companyProfile.phone);
  const [taxRate, setTaxRate] = useState(companyProfile.taxRate.toString());
  const [currency, setCurrency] = useState(companyProfile.currency);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCompanyProfile({
      name,
      address,
      phone,
      taxRate: parseFloat(taxRate) || 0,
      currency
    });
    alert('Pengaturan profil perusahaan berhasil diperbarui secara global!');
  };

  return (
    <div className="module-container max-w-2xl mx-auto animate-fade-in">
      <div className="module-header-actions">
        <div>
          <h2 className="module-title">Pengaturan Sistem</h2>
          <p className="module-subtitle">Sesuaikan identitas bisnis, sistem perpajakan, dan mata uang laporan pembukuan</p>
        </div>
      </div>

      <div className="card">
        <div className="form-header border-none p-0 mb-4">
          <Building className="text-primary mr-2" />
          <h4>Profil Perusahaan & Lokalisasi</h4>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Entitas Perusahaan *</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Contoh: PT Jasa Jaya Solusindo"
              required 
            />
          </div>

          <div className="form-group">
            <label>Alamat Lengkap Kantor Pusat *</label>
            <textarea 
              rows="3" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="Alamat penagihan resmi..."
              required
            ></textarea>
          </div>

          <div className="grid-2-cols">
            <div className="form-group">
              <label>No. Telp Perusahaan</label>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Contoh: 021-998877" 
              />
            </div>
            <div className="form-group">
              <label>Mata Uang (Prefix)</label>
              <input 
                type="text" 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)} 
                placeholder="Contoh: Rp" 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tarif PPN Standar Indonesia (%)</label>
            <div className="flex-row align-center gap-2 mt-1">
              <input 
                type="number" 
                value={taxRate} 
                onChange={(e) => setTaxRate(e.target.value)} 
                style={{ width: '100px' }}
                required 
              />
              <span className="text-muted text-sm">% PPN (Akan otomatis diterapkan ke draf invoice baru)</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4">
            <Save size={16} />
            <span>Simpan Perubahan</span>
          </button>
        </form>
      </div>
    </div>
  );
}
