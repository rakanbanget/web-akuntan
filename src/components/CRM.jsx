import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Plus, MoveRight, HelpCircle, PhoneCall, Handshake, CheckCircle } from 'lucide-react';

export default function CRM() {
  const { leads, addLead, updateLeadStatus } = useContext(AppContext);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [leadName, setLeadName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [val, setVal] = useState('');
  const [notes, setNotes] = useState('');

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleCreateLead = (e) => {
    e.preventDefault();
    if (!leadName || !contactPerson || !phone) return;

    const newLead = {
      id: `LD-00${leads.length + 1}`,
      name: leadName,
      contactPerson,
      email: email || '-',
      phone,
      status: 'Lead',
      value: parseFloat(val) || 0,
      notes
    };

    addLead(newLead);

    // Reset Form
    setLeadName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setVal('');
    setNotes('');
    setShowAddForm(false);
  };

  const handleAdvanceStatus = (leadId, currentStatus) => {
    const sequence = ['Lead', 'Dihubungi', 'Negosiasi', 'Proposal', 'Deal'];
    const currentIndex = sequence.indexOf(currentStatus);
    if (currentIndex < sequence.length - 1) {
      updateLeadStatus(leadId, sequence[currentIndex + 1]);
    }
  };

  const kanbanColumns = [
    { title: 'Prospect / Lead', statusKey: 'Lead', bg: 'bg-light-blue' },
    { title: 'Dihubungi (Contacted)', statusKey: 'Dihubungi', bg: 'bg-light-yellow' },
    { title: 'Negosiasi (Negotiating)', statusKey: 'Negosiasi', bg: 'bg-light-orange' },
    { title: 'Proposal Penawaran', statusKey: 'Proposal', bg: 'bg-light-violet' },
    { title: 'Deal (Closed Won)', statusKey: 'Deal', bg: 'bg-light-success' },
  ];

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header-actions">
        <div>
          <h2 className="module-title">CRM (Customer Relationship Management)</h2>
          <p className="module-subtitle">Pantau pipeline prospek penjualan bisnis Anda secara visual menggunakan papan Kanban</p>
        </div>
        {!showAddForm && (
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            <Plus size={16} />
            <span>Tambah Prospek Baru</span>
          </button>
        )}
      </div>

      <div className="grid-split-layout">
        {/* Kanban Board Container */}
        <div className="kanban-board col-span-2">
          {kanbanColumns.map(col => {
            const colLeads = leads.filter(l => l.status === col.statusKey);
            return (
              <div key={col.statusKey} className={`kanban-column ${col.bg}`}>
                <div className="kanban-column-header">
                  <h5>{col.title}</h5>
                  <span className="badge badge-neutral">{colLeads.length}</span>
                </div>
                <div className="kanban-cards-list">
                  {colLeads.map(lead => (
                    <div key={lead.id} className="kanban-card card">
                      <div className="kanban-card-top">
                        <span className="lead-id-label">{lead.id}</span>
                        <span className="lead-value-tag">{formatIDR(lead.value)}</span>
                      </div>
                      <h4 className="lead-company-name">{lead.name}</h4>
                      <div className="lead-contact-info">
                        <span>Contact: <strong>{lead.contactPerson}</strong></span>
                        <span>Telp: <strong>{lead.phone}</strong></span>
                      </div>
                      <p className="lead-notes">{lead.notes}</p>
                      
                      {lead.status !== 'Deal' && (
                        <div className="kanban-card-footer">
                          <button 
                            className="btn btn-xs btn-ghost flex-row align-center gap-1 w-full justify-center"
                            onClick={() => handleAdvanceStatus(lead.id, lead.status)}
                          >
                            <span>Lanjut Tahap</span>
                            <MoveRight size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {colLeads.length === 0 && (
                    <div className="kanban-empty-state">Belum ada prospek</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Lead Form */}
        {showAddForm && (
          <div className="card">
            <div className="form-header">
              <h4>Tambah Lead Penjualan</h4>
            </div>
            <form onSubmit={handleCreateLead} className="mt-4">
              <div className="form-group">
                <label>Nama Perusahaan / Client *</label>
                <input type="text" value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="Contoh: PT Harapan Jaya" required />
              </div>
              <div className="form-group">
                <label>Nama Kontak Hubungan *</label>
                <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="Contoh: Budi Susanto" required />
              </div>
              <div className="form-group">
                <label>No. Telp / WhatsApp *</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Contoh: 0812998877" required />
              </div>
              <div className="form-group">
                <label>Email Prospek</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Contoh: budi@harapanjaya.com" />
              </div>
              <div className="form-group">
                <label>Estimasi Nilai Proyek (Rp)</label>
                <input type="number" value={val} onChange={(e) => setVal(e.target.value)} placeholder="Contoh: 15000000" />
              </div>
              <div className="form-group">
                <label>Catatan Prospek</label>
                <textarea rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Uraikan detail penawaran proyek..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-full mt-2">
                Daftarkan Prospek
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
