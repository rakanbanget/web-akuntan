import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import {
  ShoppingBag,
  CreditCard,
  Package,
  Home,
  TrendingUp,
  DollarSign,
  List,
  Building,
  Users,
  CheckSquare,
  Award,
  Smartphone,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Menu,
  Briefcase,
  Layers,
  FileText
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen, theme } = useContext(AppContext);
  const [openDropdowns, setOpenDropdowns] = useState({
    penjualan: false,
    pembelian: false,
    pos: false,
  });

  const toggleDropdown = (key) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const navigateTo = (tabId) => {
    setActiveTab(tabId);
  };

  const isTabActive = (tabId) => activeTab === tabId;
  const isDropdownActive = (subTabs) => subTabs.includes(activeTab);

  return (
    <aside className={`sidebar ${sidebarOpen ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-brand">
        <div className="brand-logo">
          <Layers className="logo-icon" />
          {sidebarOpen && <span className="brand-name">Akuntan<span className="accent-text">Ku</span></span>}
        </div>
        <button className="toggle-sidebar-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu size={18} />
        </button>
      </div>

      <nav className="sidebar-menu">
        {/* Dashboard Link */}
        <div 
          className={`menu-item ${isTabActive('dashboard') ? 'active' : ''}`}
          onClick={() => navigateTo('dashboard')}
        >
          <Home className="menu-icon" size={18} />
          {sidebarOpen && <span className="menu-text">Dasbor Utama</span>}
        </div>

        {/* Dropdown: Penjualan */}
        <div className="menu-group">
          <div 
            className={`menu-item ${isDropdownActive(['invoices', 'customers']) ? 'active-parent' : ''}`}
            onClick={() => {
              if (sidebarOpen) toggleDropdown('penjualan');
              else navigateTo('invoices');
            }}
          >
            <ShoppingBag className="menu-icon" size={18} />
            {sidebarOpen && (
              <>
                <span className="menu-text">Penjualan</span>
                {openDropdowns.penjualan ? (
                  <ChevronDown className="dropdown-arrow" size={14} />
                ) : (
                  <ChevronRight className="dropdown-arrow" size={14} />
                )}
              </>
            )}
          </div>
          {sidebarOpen && openDropdowns.penjualan && (
            <div className="sub-menu">
              <div 
                className={`sub-menu-item ${isTabActive('invoices') ? 'active' : ''}`}
                onClick={() => navigateTo('invoices')}
              >
                Daftar Invoice
              </div>
              <div 
                className={`sub-menu-item ${isTabActive('customers') ? 'active' : ''}`}
                onClick={() => navigateTo('customers')}
              >
                Pelanggan
              </div>
            </div>
          )}
        </div>

        {/* Dropdown: Pembelian */}
        <div className="menu-group">
          <div 
            className={`menu-item ${isDropdownActive(['purchasing', 'suppliers', 'price-comparison']) ? 'active-parent' : ''}`}
            onClick={() => {
              if (sidebarOpen) toggleDropdown('pembelian');
              else navigateTo('purchasing');
            }}
          >
            <ShoppingBag className="menu-icon" size={18} style={{ transform: 'rotate(180deg)' }} />
            {sidebarOpen && (
              <>
                <span className="menu-text">Pembelian</span>
                {openDropdowns.pembelian ? (
                  <ChevronDown className="dropdown-arrow" size={14} />
                ) : (
                  <ChevronRight className="dropdown-arrow" size={14} />
                )}
              </>
            )}
          </div>
          {sidebarOpen && openDropdowns.pembelian && (
            <div className="sub-menu">
              <div 
                className={`sub-menu-item ${isTabActive('purchasing') ? 'active' : ''}`}
                onClick={() => navigateTo('purchasing')}
              >
                Daftar Tagihan
              </div>
              <div 
                className={`sub-menu-item ${isTabActive('suppliers') ? 'active' : ''}`}
                onClick={() => navigateTo('suppliers')}
              >
                Supplier
              </div>
              <div 
                className={`sub-menu-item ${isTabActive('price-comparison') ? 'active' : ''}`}
                onClick={() => navigateTo('price-comparison')}
              >
                Perbandingan Harga
              </div>
            </div>
          )}
        </div>

        {/* Biaya */}
        <div 
          className={`menu-item ${isTabActive('expenses') ? 'active' : ''}`}
          onClick={() => navigateTo('expenses')}
        >
          <CreditCard className="menu-icon" size={18} />
          {sidebarOpen && <span className="menu-text">Biaya</span>}
        </div>

        {/* Produk */}
        <div 
          className={`menu-item ${isTabActive('products') ? 'active' : ''}`}
          onClick={() => navigateTo('products')}
        >
          <Package className="menu-icon" size={18} />
          {sidebarOpen && <span className="menu-text">Produk</span>}
        </div>

        {/* Laporan */}
        <div 
          className={`menu-item ${isTabActive('reports') ? 'active' : ''}`}
          onClick={() => navigateTo('reports')}
        >
          <TrendingUp className="menu-icon" size={18} />
          {sidebarOpen && <span className="menu-text">Laporan Keuangan</span>}
        </div>

        {/* Kas & Bank */}
        <div 
          className={`menu-item ${isTabActive('cashbank') ? 'active' : ''}`}
          onClick={() => navigateTo('cashbank')}
        >
          <DollarSign className="menu-icon" size={18} />
          {sidebarOpen && <span className="menu-text">Kas & Bank</span>}
        </div>

        {/* Akun */}
        <div 
          className={`menu-item ${isTabActive('coa') ? 'active' : ''}`}
          onClick={() => navigateTo('coa')}
        >
          <List className="menu-icon" size={18} />
          {sidebarOpen && <span className="menu-text">Daftar Akun</span>}
        </div>

        {/* Aset Tetap */}
        <div 
          className={`menu-item ${isTabActive('fixed-assets') ? 'active' : ''}`}
          onClick={() => navigateTo('fixed-assets')}
        >
          <Building className="menu-icon" size={18} />
          {sidebarOpen && <span className="menu-text">Aset Tetap</span>}
        </div>

        {/* Kontak */}
        <div 
          className={`menu-item ${isTabActive('contacts') ? 'active' : ''}`}
          onClick={() => navigateTo('contacts')}
        >
          <Users className="menu-icon" size={18} />
          {sidebarOpen && <span className="menu-text">Kontak</span>}
        </div>

        {/* Payroll */}
        <div 
          className={`menu-item ${isTabActive('payroll') ? 'active' : ''}`}
          onClick={() => navigateTo('payroll')}
        >
          <Briefcase className="menu-icon" size={18} />
          {sidebarOpen && <span className="menu-text">Payroll Karyawan</span>}
        </div>

        {/* CRM */}
        <div 
          className={`menu-item ${isTabActive('crm') ? 'active' : ''}`}
          onClick={() => navigateTo('crm')}
        >
          <Award className="menu-icon" size={18} />
          {sidebarOpen && <span className="menu-text">CRM (Leads)</span>}
        </div>

        {/* Dropdown: POS */}
        <div className="menu-group">
          <div 
            className={`menu-item ${isDropdownActive(['pos-terminal', 'pos-history']) ? 'active-parent' : ''}`}
            onClick={() => {
              if (sidebarOpen) toggleDropdown('pos');
              else navigateTo('pos-terminal');
            }}
          >
            <Smartphone className="menu-icon" size={18} />
            {sidebarOpen && (
              <>
                <span className="menu-text">POS (Aplikasi Kasir)</span>
                {openDropdowns.pos ? (
                  <ChevronDown className="dropdown-arrow" size={14} />
                ) : (
                  <ChevronRight className="dropdown-arrow" size={14} />
                )}
              </>
            )}
          </div>
          {sidebarOpen && openDropdowns.pos && (
            <div className="sub-menu">
              <div 
                className={`sub-menu-item ${isTabActive('pos-terminal') ? 'active' : ''}`}
                onClick={() => navigateTo('pos-terminal')}
              >
                Terminal Kasir
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-divider">Layanan Tambahan</div>

        {/* Integrasi & e-Meterai / Referral */}
        <div 
          className={`menu-item ${isTabActive('extra-services') ? 'active' : ''}`}
          onClick={() => navigateTo('extra-services')}
        >
          <FileText className="menu-icon" size={18} />
          {sidebarOpen && <span className="menu-text">Layanan & Integrasi</span>}
        </div>

        <div className="sidebar-divider">Sistem</div>

        {/* Pengaturan */}
        <div 
          className={`menu-item ${isTabActive('settings') ? 'active' : ''}`}
          onClick={() => navigateTo('settings')}
        >
          <Settings className="menu-icon" size={18} />
          {sidebarOpen && <span className="menu-text">Pengaturan</span>}
        </div>

        {/* FAQ */}
        <div 
          className={`menu-item ${isTabActive('faq') ? 'active' : ''}`}
          onClick={() => navigateTo('faq')}
        >
          <HelpCircle className="menu-icon" size={18} />
          {sidebarOpen && <span className="menu-text">FAQ / Bantuan</span>}
        </div>
      </nav>

      <div className="sidebar-footer">
        {sidebarOpen && (
          <div className="user-profile-summary">
            <div className="avatar">AD</div>
            <div className="user-info">
              <span className="name">Admin Demo</span>
              <span className="role">Akuntan Utama</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
