import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Sun, Moon, Bell, Plus, Briefcase, FilePlus, CreditCard, ChevronDown } from 'lucide-react';

export default function Header() {
  const { theme, toggleTheme, activeTab, setActiveTab, companyProfile } = useContext(AppContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const formatBreadcrumb = (tab) => {
    switch (tab) {
      case 'dashboard': return 'Dasbor';
      case 'invoices': return 'Penjualan / Daftar Invoice';
      case 'customers': return 'Penjualan / Pelanggan';
      case 'purchasing': return 'Pembelian / Daftar Tagihan';
      case 'suppliers': return 'Pembelian / Supplier';
      case 'price-comparison': return 'Pembelian / Perbandingan Harga';
      case 'expenses': return 'Biaya & Pengeluaran';
      case 'products': return 'Produk & Inventori';
      case 'reports': return 'Laporan Keuangan';
      case 'cashbank': return 'Kas & Bank';
      case 'coa': return 'Daftar Akun (Chart of Accounts)';
      case 'fixed-assets': return 'Aset Tetap';
      case 'contacts': return 'Kontak Relasi';
      case 'payroll': return 'Payroll & Gaji Karyawan';
      case 'crm': return 'CRM Leads Tracker';
      case 'pos-terminal': return 'POS Terminal Kasir';
      case 'extra-services': return 'Layanan Tambahan & Integrasi';
      case 'settings': return 'Pengaturan Sistem';
      case 'faq': return 'FAQ & Bantuan';
      default: return 'Aplikasi Akuntansi';
    }
  };

  const notifications = [
    { id: 1, text: 'Tagihan INV-2026-003 telah melewati jatuh tempo', time: '1 jam yang lalu', type: 'warning' },
    { id: 2, text: 'Stok Laptop ASUS VivoBook tersisa 12 unit (Batas minimum: 15)', time: '3 jam yang lalu', type: 'info' },
    { id: 3, text: 'Pencairan komisi referral Toko Kelontong Berkah diproses', time: '1 hari yang lalu', type: 'success' },
  ];

  return (
    <header className="main-header">
      <div className="header-left">
        <div className="breadcrumbs">
          <span className="root-crumb">{companyProfile.name}</span>
          <span className="crumb-separator">/</span>
          <span className="active-crumb">{formatBreadcrumb(activeTab)}</span>
        </div>
      </div>

      <div className="header-right">
        {/* Quick Action Button */}
        <div className="quick-actions-container">
          <button className="btn btn-primary btn-sm quick-action-btn" onClick={() => setShowQuickActions(!showQuickActions)}>
            <Plus size={16} />
            <span>Tambah Data</span>
            <ChevronDown size={14} />
          </button>
          
          {showQuickActions && (
            <div className="dropdown-panel quick-actions-dropdown">
              <div className="dropdown-item" onClick={() => { setActiveTab('invoices'); setShowQuickActions(false); }}>
                <FilePlus size={16} className="icon-blue" />
                <span>Buat Invoice Penjualan</span>
              </div>
              <div className="dropdown-item" onClick={() => { setActiveTab('expenses'); setShowQuickActions(false); }}>
                <CreditCard size={16} className="icon-red" />
                <span>Catat Biaya Pengeluaran</span>
              </div>
              <div className="dropdown-item" onClick={() => { setActiveTab('products'); setShowQuickActions(false); }}>
                <Briefcase size={16} className="icon-green" />
                <span>Tambah Produk Baru</span>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button className="icon-btn theme-toggle" onClick={toggleTheme} title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications */}
        <div className="notifications-container">
          <button className="icon-btn notification-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            <span className="notification-badge">{notifications.length}</span>
          </button>

          {showNotifications && (
            <div className="dropdown-panel notifications-dropdown">
              <div className="dropdown-header">
                <h3>Notifikasi Sistem</h3>
                <span className="clear-all">Tandai dibaca</span>
              </div>
              <div className="notifications-list">
                {notifications.map(n => (
                  <div key={n.id} className={`notification-item ${n.type}`}>
                    <p className="notif-text">{n.text}</p>
                    <span className="notif-time">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="header-divider"></div>

        {/* User Profile Info */}
        <div className="profile-pill">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Avatar" className="profile-avatar" />
          <span className="profile-name">Sofia Amanda</span>
        </div>
      </div>
    </header>
  );
}
