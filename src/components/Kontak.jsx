import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, Plus, UserPlus, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Kontak() {
  const { contacts, employees, addContact } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [contactType, setContactType] = useState('Pelanggan');

  // Unified contacts list
  const allContacts = [
    ...contacts,
    ...employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      email: `${emp.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      phone: '0812' + Math.floor(10000000 + Math.random() * 90000000),
      company: 'Karyawan Tetap',
      address: 'Alamat Karyawan',
      type: 'Karyawan'
    }))
  ];

  const handleCreateContact = (e) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newContact = {
      id: `${contactType === 'Pelanggan' ? 'C' : 'S'}00${contacts.length + 1}`,
      name,
      email: email || '-',
      phone,
      company: company || 'Personal',
      address: address || '-',
      type: contactType
    };

    addContact(newContact);

    // Reset Form
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setAddress('');
    setShowAddForm(false);
  };

  const filteredContacts = allContacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = typeFilter === 'Semua' || c.type === typeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header-actions">
        <div>
          <h2 className="module-title">Kontak & Relasi Bisnis</h2>
          <p className="module-subtitle">Database kontak terpusat untuk pelanggan, supplier vendor, dan internal karyawan</p>
        </div>
        {!showAddForm && (
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            <Plus size={16} />
            <span>Tambah Kontak Baru</span>
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="filter-search-row">
        <div className="search-wrapper">
          <Search className="search-icon" size={16} />
          <input 
            type="text" 
            placeholder="Cari nama atau instansi relasi..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          {['Semua', 'Pelanggan', 'Supplier', 'Karyawan'].map(filter => (
            <button
              key={filter}
              className={`filter-btn ${typeFilter === filter ? 'active' : ''}`}
              onClick={() => setTypeFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-split-layout">
        {/* Contacts Grid Table */}
        <div className="card col-span-2">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama Kontak</th>
                  <th>Perusahaan / Instansi</th>
                  <th>Tipe Relasi</th>
                  <th>Nomor HP / WA</th>
                  <th>Email</th>
                  <th>Tindakan WA</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map(c => (
                  <tr key={c.id}>
                    <td className="font-semibold">{c.name}</td>
                    <td>{c.company}</td>
                    <td>
                      <span className={`badge ${
                        c.type === 'Pelanggan' ? 'badge-primary' :
                        c.type === 'Supplier' ? 'badge-warning' : 'badge-neutral'
                      }`}>
                        {c.type}
                      </span>
                    </td>
                    <td>
                      <span className="flex-row align-center gap-1 text-sm">
                        <Phone size={12} className="text-muted" /> {c.phone}
                      </span>
                    </td>
                    <td>
                      <span className="flex-row align-center gap-1 text-sm">
                        <Mail size={12} className="text-muted" /> {c.email}
                      </span>
                    </td>
                    <td>
                      <a 
                        href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-link text-xs flex-row align-center gap-1"
                        onClick={(e) => { e.preventDefault(); alert(`Menghubungi ${c.name} via WhatsApp Link...`); }}
                      >
                        <span>Chat WA</span>
                        <ExternalLink size={10} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Contact Sidebar */}
        {showAddForm && (
          <div className="card">
            <div className="form-header">
              <UserPlus size={18} className="text-primary mr-2" />
              <h4>Tambah Kontak Baru</h4>
            </div>
            <form onSubmit={handleCreateContact} className="mt-4">
              <div className="form-group">
                <label>Nama Kontak Utama *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Linda Septiana" required />
              </div>
              <div className="form-group">
                <label>Kategori Relasi</label>
                <select value={contactType} onChange={(e) => setContactType(e.target.value)}>
                  <option value="Pelanggan">Pelanggan (Customer)</option>
                  <option value="Supplier">Supplier (Vendor)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nama Perusahaan / Organisasi</label>
                <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Contoh: PT Sinar Abadi Raya" />
              </div>
              <div className="form-group">
                <label>No. HP / WhatsApp *</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Contoh: 08123456789" required />
              </div>
              <div className="form-group">
                <label>Alamat Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Contoh: sales@sinarabadi.com" />
              </div>
              <div className="form-group">
                <label>Alamat Lengkap</label>
                <textarea rows="3" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Alamat lengkap instansi..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-full mt-2">
                Simpan Kontak
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
