import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import Penjualan from './components/Penjualan';
import Pembelian from './components/Pembelian';
import Biaya from './components/Biaya';
import ProdukInventori from './components/ProdukInventori';
import Laporan from './components/Laporan';
import KasBank from './components/KasBank';
import Akun from './components/Akun';
import AsetTetap from './components/AsetTetap';
import Kontak from './components/Kontak';
import Payroll from './components/Payroll';
import CRM from './components/CRM';
import POS from './components/POS';
import LayananTambahan from './components/LayananTambahan';
import Pengaturan from './components/Pengaturan';
import FAQ from './components/FAQ';

export default function App() {
  const { activeTab, theme } = useContext(AppContext);

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'invoices':
      case 'customers':
        return <Penjualan />;
      case 'purchasing':
      case 'suppliers':
      case 'price-comparison':
        return <Pembelian />;
      case 'expenses':
        return <Biaya />;
      case 'products':
        return <ProdukInventori />;
      case 'reports':
        return <Laporan />;
      case 'cashbank':
        return <KasBank />;
      case 'coa':
        return <Akun />;
      case 'fixed-assets':
        return <AsetTetap />;
      case 'contacts':
        return <Kontak />;
      case 'payroll':
        return <Payroll />;
      case 'crm':
        return <CRM />;
      case 'pos-terminal':
        return <POS />;
      case 'extra-services':
        return <LayananTambahan />;
      case 'settings':
        return <Pengaturan />;
      case 'faq':
        return <FAQ />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content-wrapper">
        <Header />
        <main className="content-container">
          {renderActiveTabContent()}
        </main>
      </div>
    </div>
  );
}
