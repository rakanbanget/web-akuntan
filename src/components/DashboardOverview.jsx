import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  Briefcase, 
  Wallet,
  Clock
} from 'lucide-react';

export default function DashboardOverview() {
  const { invoices, expenses, bankAccounts, products, setActiveTab, companyProfile } = useContext(AppContext);
  const [hoveredBar, setHoveredBar] = useState(null);

  // Helper formatting currency
  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Calculations
  const totalIncome = invoices
    .filter(inv => inv.status === 'Lunas')
    .reduce((sum, inv) => sum + inv.subtotal, 0);

  const pendingReceivables = invoices
    .filter(inv => inv.status === 'Pending' || inv.status === 'Jatuh Tempo')
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const cashBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  const netProfit = totalIncome - totalExpense;

  // Stock check
  const lowStockProducts = products.filter(p => p.stock <= 10);
  
  // Recent activities
  const recentActivities = [
    ...invoices.map(inv => ({
      id: inv.id,
      type: 'invoice',
      title: `Invoice ${inv.id} - ${inv.customerName}`,
      amount: inv.total,
      date: inv.date,
      status: inv.status,
      desc: inv.status === 'Lunas' ? 'Telah dilunasi' : 'Menunggu pembayaran'
    })),
    ...expenses.map(exp => ({
      id: exp.id,
      type: 'expense',
      title: `${exp.category} - ${exp.description}`,
      amount: exp.amount,
      date: exp.date,
      status: 'Selesai',
      desc: 'Pengeluaran dicatat'
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  // SVG Chart data
  // Monthly income vs expense simulation (Jan - June)
  const monthlyData = [
    { name: 'Jan', income: 18000000, expense: 12000000 },
    { name: 'Feb', income: 22000000, expense: 14000000 },
    { name: 'Mar', income: 25000000, expense: 19000000 },
    { name: 'Apr', income: 31000000, expense: 18000000 },
    { name: 'Mei', income: 28000000, expense: 22000000 },
    { name: 'Jun', income: totalIncome, expense: totalExpense }, // Current month actuals
  ];

  // Expense breakdown categories
  const expenseCategories = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
  const totalExpSum = Object.values(expenseCategories).reduce((s, v) => s + v, 0) || 1;
  const expenseChartData = Object.entries(expenseCategories).map(([name, val]) => ({
    name,
    value: val,
    percentage: Math.round((val / totalExpSum) * 100)
  })).sort((a, b) => b.value - a.value);

  // Bar chart parameters
  const chartHeight = 160;
  const chartWidth = 500;
  const maxVal = Math.max(...monthlyData.map(d => Math.max(d.income, d.expense))) * 1.1 || 10000000;

  return (
    <div className="dashboard-container animate-fade-in">
      {/* Welcome & Stats Row */}
      <div className="dashboard-header-row">
        <div>
          <h1 className="dashboard-title">Ringkasan Keuangan</h1>
          <p className="dashboard-subtitle">Pantau kesehatan finansial perusahaan Anda secara real-time</p>
        </div>
        <div className="current-date-badge">
          <Clock size={16} />
          <span>Periode Buku: Juni 2026</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="card-top">
            <div className="icon-wrapper bg-blue">
              <TrendingUp size={20} />
            </div>
            <span className="growth positive"><ArrowUpRight size={14} /> +12.4%</span>
          </div>
          <div className="card-bottom">
            <span className="stat-label">Pendapatan Realisasi (Bulan Ini)</span>
            <h2 className="stat-value">{formatIDR(totalIncome)}</h2>
            <span className="stat-helper">Hanya invoice yang berstatus LUNAS</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="card-top">
            <div className="icon-wrapper bg-red">
              <TrendingDown size={20} />
            </div>
            <span className="growth negative"><ArrowDownRight size={14} /> +8.1%</span>
          </div>
          <div className="card-bottom">
            <span className="stat-label">Pengeluaran Operasional (Bulan Ini)</span>
            <h2 className="stat-value">{formatIDR(totalExpense)}</h2>
            <span className="stat-helper">Seluruh pencatatan biaya kas & bank</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="card-top">
            <div className="icon-wrapper bg-emerald">
              <DollarSign size={20} />
            </div>
            <span className="growth positive"><ArrowUpRight size={14} /> +15.2%</span>
          </div>
          <div className="card-bottom">
            <span className="stat-label">Laba Bersih Sementara</span>
            <h2 className={`stat-value ${netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatIDR(netProfit)}
            </h2>
            <span className="stat-helper">Realisasi (Pendapatan - Biaya)</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="card-top">
            <div className="icon-wrapper bg-violet">
              <Wallet size={20} />
            </div>
            <span className="growth neutral">Saldo Kas & Bank</span>
          </div>
          <div className="card-bottom">
            <span className="stat-label">Total Kas & Rekening Bank</span>
            <h2 className="stat-value">{formatIDR(cashBalance)}</h2>
            <span className="stat-helper">Total likuiditas di seluruh akun bank</span>
          </div>
        </div>
      </div>

      {/* Ratios & Alerts Banner */}
      <div className="alerts-and-ratios">
        <div className="ratio-card">
          <h4>Arus Piutang Usaha</h4>
          <div className="progress-container">
            <div className="progress-info">
              <span>Piutang Menunggu (Receivables)</span>
              <strong>{formatIDR(pendingReceivables)}</strong>
            </div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-fill" style={{ width: '45%' }}></div>
            </div>
          </div>
        </div>
        {lowStockProducts.length > 0 && (
          <div className="alert-banner warning" onClick={() => setActiveTab('products')}>
            <AlertTriangle className="alert-icon" />
            <div className="alert-content">
              <h5>Peringatan Inventori!</h5>
              <p>Ada {lowStockProducts.length} produk dengan stok menipis di bawah batas aman.</p>
            </div>
            <span className="alert-action-link">Lihat Detail</span>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="dashboard-charts-grid">
        {/* Chart 1: Profit & Loss Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Tren Pendapatan vs Pengeluaran</h3>
            <div className="chart-legends">
              <span className="legend-item"><span className="legend-color bg-primary-chart"></span>Pendapatan</span>
              <span className="legend-item"><span className="legend-color bg-secondary-chart"></span>Biaya</span>
            </div>
          </div>
          <div className="chart-body">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`} className="svg-chart">
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
                const y = chartHeight * r + 10;
                return (
                  <line 
                    key={idx} 
                    x1="40" 
                    y1={y} 
                    x2={chartWidth - 10} 
                    y2={y} 
                    stroke="var(--border-color)" 
                    strokeDasharray="4 4" 
                  />
                );
              })}

              {/* Bars rendering */}
              {monthlyData.map((d, index) => {
                const colWidth = (chartWidth - 50) / monthlyData.length;
                const x = 50 + index * colWidth;
                const barWidth = 18;

                const incomeHeight = (d.income / maxVal) * chartHeight;
                const expenseHeight = (d.expense / maxVal) * chartHeight;

                const incomeY = chartHeight - incomeHeight + 10;
                const expenseY = chartHeight - expenseHeight + 10;

                return (
                  <g key={index}>
                    {/* Income Bar */}
                    <rect
                      x={x}
                      y={incomeY}
                      width={barWidth}
                      height={incomeHeight}
                      fill="url(#incomeGradient)"
                      rx="4"
                      className="chart-bar"
                      onMouseEnter={() => setHoveredBar({ index, type: 'Income', val: d.income })}
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                    {/* Expense Bar */}
                    <rect
                      x={x + barWidth + 4}
                      y={expenseY}
                      width={barWidth}
                      height={expenseHeight}
                      fill="url(#expenseGradient)"
                      rx="4"
                      className="chart-bar"
                      onMouseEnter={() => setHoveredBar({ index, type: 'Expense', val: d.expense })}
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                    {/* Month Label */}
                    <text 
                      x={x + barWidth} 
                      y={chartHeight + 30} 
                      textAnchor="middle" 
                      fill="var(--text-secondary)" 
                      fontSize="12"
                    >
                      {d.name}
                    </text>
                  </g>
                );
              })}

              {/* Define Gradients */}
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F87171" />
                  <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>
              </defs>
            </svg>

            {/* Hover details overlay */}
            {hoveredBar && (
              <div className="chart-tooltip">
                <span className="tooltip-title">{monthlyData[hoveredBar.index].name} - {hoveredBar.type}</span>
                <span className="tooltip-value">{formatIDR(hoveredBar.val)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Expense Breakdown List & Ring */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Distribusi Biaya</h3>
            <span className="chart-subtitle">Berdasarkan kategori pengeluaran</span>
          </div>
          <div className="chart-body flex-row">
            {/* Pie Chart Representation using SVG */}
            <div className="pie-chart-wrapper">
              <svg viewBox="0 0 100 100" width="120" height="120">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-color)" strokeWidth="10" />
                {/* Simulated circle layers */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" strokeWidth="10" strokeDasharray="125 251" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="10" strokeDasharray="60 251" strokeDashoffset="-125" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#FBBF24" strokeWidth="10" strokeDasharray="30 251" strokeDashoffset="-185" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F87171" strokeWidth="10" strokeDasharray="36 251" strokeDashoffset="-215" />
                <circle cx="50" cy="50" r="18" fill="var(--card-bg)" />
              </svg>
            </div>

            {/* Custom categories progress list */}
            <div className="expense-legend-list">
              {expenseChartData.slice(0, 4).map((d, i) => {
                const colors = ['#3B82F6', '#10B981', '#FBBF24', '#F87171'];
                return (
                  <div key={d.name} className="legend-row">
                    <div className="legend-color-dot" style={{ backgroundColor: colors[i % colors.length] }}></div>
                    <div className="legend-info">
                      <span className="legend-label">{d.name}</span>
                      <span className="legend-percent">{d.percentage}%</span>
                    </div>
                    <span className="legend-value">{formatIDR(d.value)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="recent-activity-card">
        <div className="card-header">
          <h3>Aktifitas Transaksi Terakhir</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('invoices')}>Lihat Semua Penjualan</button>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Transaksi</th>
                <th>Keterangan</th>
                <th>Jumlah</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((act) => (
                <tr key={act.id}>
                  <td>{act.date}</td>
                  <td>
                    <div className="activity-cell">
                      <span className={`activity-icon-badge ${act.type}`}>
                        {act.type === 'invoice' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      </span>
                      <span className="activity-title">{act.title}</span>
                    </div>
                  </td>
                  <td>{act.desc}</td>
                  <td className="font-semibold">{formatIDR(act.amount)}</td>
                  <td>
                    <span className={`badge ${
                      act.status === 'Lunas' || act.status === 'Selesai' ? 'badge-success' : 
                      act.status === 'Pending' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {act.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
