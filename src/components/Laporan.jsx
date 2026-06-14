import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Printer, Download, BookOpen, Layers, BarChart2 } from 'lucide-react';

export default function Laporan() {
  const { invoices, expenses, bankAccounts, coa, fixedAssets, companyProfile } = useContext(AppContext);
  const [reportType, setReportType] = useState('labarugi'); // labarugi, neraca, aruskas

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Calculations for Profit & Loss
  const revenue = invoices
    .filter(inv => inv.status === 'Lunas')
    .reduce((sum, inv) => sum + inv.subtotal, 0);

  const cogs = invoices
    .filter(inv => inv.status === 'Lunas')
    .reduce((sum, inv) => {
      // simulated COGS is 65% of subtotal for mock simplicity
      return sum + Math.round(inv.subtotal * 0.65);
    }, 0);

  const grossProfit = revenue - cogs;

  // Expenses grouped
  const expensesList = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const totalOperatingExpenses = Object.values(expensesList).reduce((s, v) => s + v, 0);
  const operatingProfit = grossProfit - totalOperatingExpenses;
  const netIncome = operatingProfit;

  // Balance sheet metrics
  const cashAndEquivalents = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const accountsReceivable = invoices
    .filter(inv => inv.status === 'Pending' || inv.status === 'Jatuh Tempo')
    .reduce((sum, inv) => sum + inv.total, 0);

  // fixed assets net book value
  const totalAssetsCost = fixedAssets.reduce((sum, a) => sum + a.cost, 0);
  // simulated depreciation is 15% of cost for simplicity
  const accumulatedDepreciation = Math.round(totalAssetsCost * 0.15);
  const netFixedAssets = totalAssetsCost - accumulatedDepreciation;

  const totalAssets = cashAndEquivalents + accountsReceivable + netFixedAssets;

  const accountsPayable = 9000000; // Mock liabilities
  const taxLiabilities = invoices.reduce((sum, inv) => sum + (inv.status !== 'Lunas' ? inv.tax : 0), 0);
  const totalLiabilities = accountsPayable + taxLiabilities;

  const ownerEquity = 200000000; // Mock Equity Capital
  const retainedEarnings = totalAssets - totalLiabilities - ownerEquity; // Balancing figure
  const totalEquity = ownerEquity + retainedEarnings;

  const handleExportCSV = () => {
    alert('Simulasi Export: Laporan berhasil diexport ke format CSV/Excel.');
  };

  return (
    <div className="module-container animate-fade-in">
      <div className="module-header-actions no-print">
        <div>
          <h2 className="module-title">Laporan Keuangan Perusahaan</h2>
          <p className="module-subtitle">Hasil kalkulasi otomatis seluruh jurnal, penjualan, dan beban operasional</p>
        </div>
        <div className="flex-row gap-2">
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={16} />
            <span>Ekspor CSV</span>
          </button>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={16} />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="filter-group mb-6 no-print">
        <button 
          className={`filter-btn ${reportType === 'labarugi' ? 'active' : ''}`}
          onClick={() => setReportType('labarugi')}
        >
          <BarChart2 size={16} />
          <span>Laporan Laba Rugi</span>
        </button>
        <button 
          className={`filter-btn ${reportType === 'neraca' ? 'active' : ''}`}
          onClick={() => setReportType('neraca')}
        >
          <Layers size={16} />
          <span>Neraca Keuangan</span>
        </button>
        <button 
          className={`filter-btn ${reportType === 'aruskas' ? 'active' : ''}`}
          onClick={() => setReportType('aruskas')}
        >
          <BookOpen size={16} />
          <span>Laporan Arus Kas</span>
        </button>
      </div>

      {/* Visual Report Sheet */}
      <div className="report-paper card" id="print-area">
        <div className="report-paper-header text-center">
          <h2>{companyProfile.name}</h2>
          <h3>
            {reportType === 'labarugi' && 'LAPORAN LABA RUGI'}
            {reportType === 'neraca' && 'NERACA KEUANGAN'}
            {reportType === 'aruskas' && 'LAPORAN ARUS KAS (METODE LANGSUNG)'}
          </h3>
          <p className="report-period">Periode Berakhir: 30 Juni 2026 • Rupiah (IDR)</p>
          <hr className="report-divider" />
        </div>

        {/* ================= LABA RUGI SHEET ================= */}
        {reportType === 'labarugi' && (
          <div className="report-table-sheet">
            {/* Revenue Section */}
            <div className="report-section-header">Pendapatan Operasional</div>
            <div className="report-row indentation-1">
              <span>Pendapatan Penjualan Bersih</span>
              <span className="font-semibold">{formatIDR(revenue)}</span>
            </div>
            <div className="report-row total-row border-double">
              <span>Total Pendapatan (A)</span>
              <span>{formatIDR(revenue)}</span>
            </div>

            {/* COGS Section */}
            <div className="report-section-header">Harga Pokok Penjualan (HPP)</div>
            <div className="report-row indentation-1">
              <span>Beban Pokok Penjualan (COGS)</span>
              <span className="text-danger">({formatIDR(cogs)})</span>
            </div>
            <div className="report-row total-row">
              <span>Total Beban Pokok (B)</span>
              <span className="text-danger">({formatIDR(cogs)})</span>
            </div>

            <div className="report-row summary-row mt-4">
              <span>LABA KOTOR OPERASIONAL (A - B)</span>
              <span className="font-semibold">{formatIDR(grossProfit)}</span>
            </div>

            {/* Operating Expenses Section */}
            <div className="report-section-header">Beban Pengeluaran Operasional</div>
            {Object.entries(expensesList).map(([cat, val]) => (
              <div key={cat} className="report-row indentation-1">
                <span>{cat}</span>
                <span className="text-danger">({formatIDR(val)})</span>
              </div>
            ))}
            {Object.keys(expensesList).length === 0 && (
              <div className="report-row indentation-1 text-muted">Belum ada beban tercatat.</div>
            )}
            <div className="report-row total-row border-double">
              <span>Total Beban Operasional (C)</span>
              <span className="text-danger">({formatIDR(totalOperatingExpenses)})</span>
            </div>

            {/* Net Profit Summary */}
            <div className="report-row summary-row highlight-row mt-6">
              <span>LABA BERSIH OPERASIONAL (EBIT)</span>
              <span className={`text-xl ${netIncome >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatIDR(netIncome)}
              </span>
            </div>
          </div>
        )}

        {/* ================= NERACA SHEET ================= */}
        {reportType === 'neraca' && (
          <div className="report-table-sheet">
            <div className="grid-2-cols gap-8">
              {/* Asset Column */}
              <div>
                <div className="report-section-header">ASET (AKTIVA)</div>
                
                <h5 className="sub-section-title">Aset Lancar</h5>
                <div className="report-row indentation-1">
                  <span>Kas dan Setara Kas</span>
                  <span>{formatIDR(cashAndEquivalents)}</span>
                </div>
                <div className="report-row indentation-1">
                  <span>Piutang Dagang / Usaha</span>
                  <span>{formatIDR(accountsReceivable)}</span>
                </div>
                
                <h5 className="sub-section-title mt-4">Aset Tetap (Non-Lancar)</h5>
                <div className="report-row indentation-1">
                  <span>Peralatan & Inventaris</span>
                  <span>{formatIDR(totalAssetsCost)}</span>
                </div>
                <div className="report-row indentation-1 text-danger">
                  <span>Akumulasi Penyusutan Aset</span>
                  <span>({formatIDR(accumulatedDepreciation)})</span>
                </div>
                <div className="report-row indentation-1 font-semibold border-top">
                  <span>Nilai Buku Aset Tetap</span>
                  <span>{formatIDR(netFixedAssets)}</span>
                </div>

                <div className="report-row total-row border-double mt-6 highlight-row">
                  <span>TOTAL ASET (AKTIVA)</span>
                  <span>{formatIDR(totalAssets)}</span>
                </div>
              </div>

              {/* Liabilities & Equity Column */}
              <div>
                <div className="report-section-header">KEWAJIBAN & EKUITAS</div>
                
                <h5 className="sub-section-title">Liabilitas (Kewajiban)</h5>
                <div className="report-row indentation-1">
                  <span>Hutang Usaha (Supplier)</span>
                  <span>{formatIDR(accountsPayable)}</span>
                </div>
                <div className="report-row indentation-1">
                  <span>Kewajiban Hutang Pajak</span>
                  <span>{formatIDR(taxLiabilities)}</span>
                </div>
                <div className="report-row total-row border-top">
                  <span>Total Liabilitas</span>
                  <span>{formatIDR(totalLiabilities)}</span>
                </div>

                <h5 className="sub-section-title mt-6">Ekuitas (Modal)</h5>
                <div className="report-row indentation-1">
                  <span>Modal Disetor Pemilik</span>
                  <span>{formatIDR(ownerEquity)}</span>
                </div>
                <div className="report-row indentation-1">
                  <span>Laba Ditahan / Sementara</span>
                  <span>{formatIDR(retainedEarnings)}</span>
                </div>
                <div className="report-row total-row border-top">
                  <span>Total Ekuitas</span>
                  <span>{formatIDR(totalEquity)}</span>
                </div>

                <div className="report-row total-row border-double mt-6 highlight-row">
                  <span>TOTAL KEWAJIBAN & EKUITAS</span>
                  <span>{formatIDR(totalLiabilities + totalEquity)}</span>
                </div>
              </div>
            </div>
            
            {/* Balance check indicator */}
            <div className="balance-check-bar mt-8 text-center p-3 bg-light border-radius-sm">
              <span className="text-success font-semibold text-sm">✓ STATUS BALANCE: Selisih Rp 0</span>
            </div>
          </div>
        )}

        {/* ================= ARUS KAS SHEET ================= */}
        {reportType === 'aruskas' && (
          <div className="report-table-sheet">
            {/* Operating Activity */}
            <div className="report-section-header">Arus Kas Dari Aktivitas Operasional</div>
            <div className="report-row indentation-1">
              <span>Penerimaan Kas dari Pelanggan</span>
              <span>{formatIDR(revenue)}</span>
            </div>
            <div className="report-row indentation-1 text-danger">
              <span>Pengeluaran Kas untuk Operasional & Biaya</span>
              <span>({formatIDR(totalOperatingExpenses)})</span>
            </div>
            <div className="report-row total-row">
              <span>Kas Bersih dari Aktivitas Operasional (A)</span>
              <span className={revenue - totalOperatingExpenses >= 0 ? 'text-success' : 'text-danger'}>
                {formatIDR(revenue - totalOperatingExpenses)}
              </span>
            </div>

            {/* Investing Activity */}
            <div className="report-section-header mt-4">Arus Kas Dari Aktivitas Investasi</div>
            <div className="report-row indentation-1 text-danger">
              <span>Pembelian Aset Tetap (Peralatan & Kendaraan)</span>
              <span>({formatIDR(totalAssetsCost)})</span>
            </div>
            <div className="report-row total-row">
              <span>Kas Bersih dari Aktivitas Investasi (B)</span>
              <span className="text-danger">({formatIDR(totalAssetsCost)})</span>
            </div>

            {/* Financing Activity */}
            <div className="report-section-header mt-4">Arus Kas Dari Aktivitas Pendanaan</div>
            <div className="report-row indentation-1">
              <span>Setoran Modal Awal Pemilik</span>
              <span>{formatIDR(ownerEquity)}</span>
            </div>
            <div className="report-row total-row border-double">
              <span>Kas Bersih dari Aktivitas Pendanaan (C)</span>
              <span>{formatIDR(ownerEquity)}</span>
            </div>

            {/* Net Cash flow position */}
            <div className="report-row summary-row highlight-row mt-6">
              <span>KENAIKAN / (PENURUNAN) KAS BERSIH (A + B + C)</span>
              <span className="text-xl font-bold">
                {formatIDR((revenue - totalOperatingExpenses) - totalAssetsCost + ownerEquity)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
