export const initialProducts = [
  { id: 'P001', name: 'Laptop ASUS VivoBook', sku: 'LPT-AS-VB01', category: 'Elektronik', purchasePrice: 7500000, salesPrice: 9500000, stock: 12 },
  { id: 'P002', name: 'Monitor LG 24 Inch IPS', sku: 'MON-LG-24IPS', category: 'Elektronik', purchasePrice: 1500000, salesPrice: 2100000, stock: 8 },
  { id: 'P003', name: 'Keyboard Mechanical Keychron K2', sku: 'KB-KC-K2', category: 'Aksesoris', purchasePrice: 1200000, salesPrice: 1650000, stock: 15 },
  { id: 'P004', name: 'Mouse Logitech MX Master 3S', sku: 'MS-LT-MX3S', category: 'Aksesoris', purchasePrice: 1400000, salesPrice: 1890000, stock: 20 },
  { id: 'P005', name: 'Meja Kerja Ergonomis Jati', sku: 'MJ-ERG-JATI', category: 'Furnitur', purchasePrice: 2500000, salesPrice: 3800000, stock: 5 },
  { id: 'P006', name: 'Kursi Kantor ErgoComfort', sku: 'KR-ERG-CF02', category: 'Furnitur', purchasePrice: 1800000, salesPrice: 2750000, stock: 10 },
];

export const initialContacts = [
  { id: 'C001', name: 'PT Surya Abadi', email: 'info@suryaabadi.co.id', phone: '081234567890', type: 'Pelanggan', company: 'PT Surya Abadi', address: 'Jl. Jendral Sudirman No. 12, Jakarta' },
  { id: 'C002', name: 'CV Makmur Sejahtera', email: 'sales@makmursejahtera.com', phone: '082198765432', type: 'Pelanggan', company: 'CV Makmur Sejahtera', address: 'Jl. Gatot Subroto No. 45, Bandung' },
  { id: 'C003', name: 'Budi Santoso', email: 'budi.santoso@gmail.com', phone: '087755566677', type: 'Pelanggan', company: 'Personal', address: 'Jl. Mawar No. 8, Surabaya' },
  { id: 'S001', name: 'PT Distributor IT Nasional', email: 'order@itnasional.com', phone: '021-5551234', type: 'Supplier', company: 'PT Distributor IT Nasional', address: 'Kawasan Industri Pulogadung, Jakarta' },
  { id: 'S002', name: 'CV Indo Furnitureindo', email: 'mebelindo@outlook.com', phone: '0291-777888', type: 'Supplier', company: 'CV Indo Furnitureindo', address: 'Jl. Raya Jepara-Kudus KM 7, Jepara' },
  { id: 'S003', name: 'UD Aksesoris Gadget Indonesia', email: 'sales@gadgetindo.co.id', phone: '081999888777', type: 'Supplier', company: 'UD Aksesoris Gadget Indonesia', address: 'Mangga Dua Mall Lt. 3, Jakarta' },
];

export const initialInvoices = [
  {
    id: 'INV-2026-001',
    customerName: 'PT Surya Abadi',
    date: '2026-06-01',
    dueDate: '2026-07-01',
    status: 'Lunas',
    items: [
      { productId: 'P001', productName: 'Laptop ASUS VivoBook', quantity: 2, price: 9500000 },
      { productId: 'P003', productName: 'Keyboard Mechanical Keychron K2', quantity: 5, price: 1650000 },
    ],
    discount: 500000,
    taxRate: 11, // PPN 11%
    notes: 'Terima kasih atas kerja samanya. Pembayaran telah diterima via Bank BCA.',
    subtotal: 27250000,
    tax: 2942500,
    total: 29692500,
  },
  {
    id: 'INV-2026-002',
    customerName: 'CV Makmur Sejahtera',
    date: '2026-06-10',
    dueDate: '2026-07-10',
    status: 'Pending',
    items: [
      { productId: 'P002', productName: 'Monitor LG 24 Inch IPS', quantity: 3, price: 2100000 },
      { productId: 'P006', productName: 'Kursi Kantor ErgoComfort', quantity: 4, price: 2750000 },
    ],
    discount: 0,
    taxRate: 11,
    notes: 'Mohon lakukan transfer ke Bank BCA Rek. 888-999-111 a/n PT AkuntanKu.',
    subtotal: 17300000,
    tax: 1903000,
    total: 19203000,
  },
  {
    id: 'INV-2026-003',
    customerName: 'Budi Santoso',
    date: '2026-05-10',
    dueDate: '2026-06-10',
    status: 'Jatuh Tempo',
    items: [
      { productId: 'P004', productName: 'Mouse Logitech MX Master 3S', quantity: 1, price: 1890000 },
    ],
    discount: 0,
    taxRate: 11,
    notes: 'Mohon segera dilunasi invoice yang telah melewati tanggal jatuh tempo.',
    subtotal: 1890000,
    tax: 207900,
    total: 2097900,
  },
];

export const initialExpenses = [
  { id: 'EXP-001', category: 'Biaya Sewa', description: 'Sewa Ruko Kantor Cabang Bandung', date: '2026-06-01', amount: 5000000, account: '5-501 (Beban Sewa)' },
  { id: 'EXP-002', category: 'Utilitas', description: 'Listrik & Wifi Kantor Utama Juni', date: '2026-06-05', amount: 1250000, account: '5-502 (Beban Air, Listrik & Telepon)' },
  { id: 'EXP-003', category: 'Gaji Karyawan', description: 'Payroll Staff Bulan Mei 2026', date: '2026-05-30', amount: 15400000, account: '5-503 (Beban Gaji & Tunjangan)' },
  { id: 'EXP-004', category: 'Pemasaran', description: 'Facebook Ads & Google Ads Campaign', date: '2026-06-12', amount: 3000000, account: '5-504 (Beban Pemasaran & Iklan)' },
  { id: 'EXP-005', category: 'Administrasi', description: 'Pembelian ATK & Snack Dapur Kantor', date: '2026-06-14', amount: 450000, account: '5-505 (Beban Administrasi Kantor)' },
];

export const initialBankAccounts = [
  { id: 'ACC-01', name: 'Kas Utama (Rupiah)', type: 'Kas', number: 'CASH-01', balance: 12500000 },
  { id: 'ACC-02', name: 'Bank BCA Utama', type: 'Bank', number: '802-9988-771', balance: 145800000 },
  { id: 'ACC-03', name: 'Bank Mandiri Bisnis', type: 'Bank', number: '122-000-888-221', balance: 85200000 },
  { id: 'ACC-04', name: 'Petty Cash / Kas Kecil', type: 'Kas', number: 'CASH-02', balance: 2500000 },
];

export const initialChartOfAccounts = [
  { code: '1-101', name: 'Kas Utama', type: 'Harta (Aktiva Lancar)', balance: 12500000 },
  { code: '1-102', name: 'Bank BCA', type: 'Harta (Aktiva Lancar)', balance: 145800000 },
  { code: '1-103', name: 'Bank Mandiri', type: 'Harta (Aktiva Lancar)', balance: 85200000 },
  { code: '1-104', name: 'Piutang Usaha', type: 'Harta (Aktiva Lancar)', balance: 21300900 },
  { code: '1-201', name: 'Aset Tetap - Kendaraan', type: 'Harta (Aktiva Tetap)', balance: 180000000 },
  { code: '1-202', name: 'Aset Tetap - Peralatan Kantor', type: 'Harta (Aktiva Tetap)', balance: 45000000 },
  { code: '2-101', name: 'Hutang Usaha', type: 'Kewajiban (Liabilitas)', balance: 12000000 },
  { code: '2-102', name: 'Hutang Pajak PPN', type: 'Kewajiban (Liabilitas)', balance: 5053400 },
  { code: '3-101', name: 'Modal Pemilik', type: 'Modal (Ekuitas)', balance: 200000000 },
  { code: '3-102', name: 'Laba Ditahan', type: 'Modal (Ekuitas)', balance: 67747500 },
  { code: '4-101', name: 'Pendapatan Penjualan', type: 'Pendapatan', balance: 48892500 },
  { code: '5-501', name: 'Beban Sewa', type: 'Beban (Pengeluaran)', balance: 5000000 },
  { code: '5-502', name: 'Beban Listrik, Air & Wifi', type: 'Beban (Pengeluaran)', balance: 1250000 },
  { code: '5-503', name: 'Beban Gaji Karyawan', type: 'Beban (Pengeluaran)', balance: 15400000 },
  { code: '5-504', name: 'Beban Pemasaran', type: 'Beban (Pengeluaran)', balance: 3000000 },
  { code: '5-505', name: 'Beban Administrasi', type: 'Beban (Pengeluaran)', balance: 450000 },
];

export const initialFixedAssets = [
  { id: 'AST-001', name: 'Mobil Box Pengiriman (Gran Max)', category: 'Kendaraan', purchaseDate: '2025-01-15', cost: 180000000, lifespan: 8, salvageValue: 20000000, depreciationMethod: 'Garis Lurus' },
  { id: 'AST-002', name: 'Laptop Developer ASUS ROG', category: 'Peralatan Kantor', purchaseDate: '2025-08-10', cost: 25000000, lifespan: 4, salvageValue: 5000000, depreciationMethod: 'Garis Lurus' },
  { id: 'AST-003', name: 'AC Daikin 2 PK (3 Unit)', category: 'Peralatan Kantor', purchaseDate: '2026-02-20', cost: 20000000, lifespan: 5, salvageValue: 2000000, depreciationMethod: 'Garis Lurus' },
];

export const initialEmployees = [
  { id: 'EMP-001', name: 'Andi Wijaya', position: 'Manager Operasional', basicSalary: 8500000, allowance: 1500000, bpjsDeduction: 250000, taxRate: 5 },
  { id: 'EMP-002', name: 'Siti Rahma', position: 'Akuntan Senior', basicSalary: 7000000, allowance: 1000000, bpjsDeduction: 200000, taxRate: 5 },
  { id: 'EMP-003', name: 'Rian Kurnia', position: 'Staff Gudang & Logistik', basicSalary: 4800000, allowance: 500000, bpjsDeduction: 150000, taxRate: 0 },
  { id: 'EMP-004', name: 'Dewi Lestari', position: 'Customer Relationship Exec.', basicSalary: 5200000, allowance: 800000, bpjsDeduction: 170000, taxRate: 0 },
];

export const initialLeads = [
  { id: 'LD-001', name: 'PT Angin Ribut', contactPerson: 'Hendra', email: 'hendra@anginribut.co.id', phone: '08122334455', status: 'Lead', value: 15000000, notes: 'Butuh kustomisasi meja kerja sebanyak 20 unit.' },
  { id: 'LD-002', name: 'CV Sinar Baru', contactPerson: 'Ratna', email: 'ratna@sinarbaru.com', phone: '08134455667', status: 'Dihubungi', value: 8000000, notes: 'Tertarik membeli 4 unit Laptop ASUS VivoBook.' },
  { id: 'LD-003', name: 'PT Globalindo Perkasa', contactPerson: 'Yusuf', email: 'yusuf@globalindo.id', phone: '08987766554', status: 'Negosiasi', value: 45000000, notes: 'Sedang mencocokkan harga monitor dan kursi kantor.' },
  { id: 'LD-004', name: 'Bapak Rudi Pratama', contactPerson: 'Rudi', email: 'rudi.p@yahoo.com', phone: '08527788991', status: 'Proposal', value: 3500000, notes: 'Sudah dikirimkan invoice penawaran untuk kursi kantor.' },
  { id: 'LD-005', name: 'PT Berkah Sentosa', contactPerson: 'Agus', email: 'agus@berkahsentosa.co.id', phone: '08119900887', status: 'Deal', value: 27500000, notes: 'Penawaran disetujui. Siap kirim tagihan DP.' },
];

export const initialEMeteraiLogs = [
  { id: 'EMT-001', docName: 'INV-2026-001_Signed.pdf', docType: 'Invoice Penjualan', date: '2026-06-02 10:15', stampSerial: '992837182938192-MTR10K', status: 'Sukses' },
  { id: 'EMT-002', docName: 'PO_Distributor_IT_026.pdf', docType: 'Purchase Order', date: '2026-06-11 14:30', stampSerial: '991029384756102-MTR10K', status: 'Sukses' },
];

export const initialReferrals = [
  { id: 'REF-001', name: 'CV Harapan Bangsa', dateJoined: '2026-05-12', planSelected: 'Professional Plan', bonusEarned: 250000, status: 'Sudah Cair' },
  { id: 'REF-002', name: 'Toko Kelontong Berkah', dateJoined: '2026-06-02', planSelected: 'Starter Plan', bonusEarned: 100000, status: 'Menunggu Verifikasi' },
];
