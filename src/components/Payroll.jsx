import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Printer, ShieldAlert, Award, FileText, ChevronRight } from 'lucide-react';

export default function Payroll() {
  const { employees, companyProfile } = useContext(AppContext);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  // Custom salary slip form states (overriding employee defaults for simulation)
  const [basicSalary, setBasicSalary] = useState('');
  const [allowance, setAllowance] = useState('');
  const [bpjsDeduction, setBpjsDeduction] = useState('');
  const [taxRate, setTaxRate] = useState('5');
  const [viewMode, setViewMode] = useState('list'); // list, slip

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleSelectEmployee = (emp) => {
    setSelectedEmployee(emp);
    setBasicSalary(emp.basicSalary.toString());
    setAllowance(emp.allowance.toString());
    setBpjsDeduction(emp.bpjsDeduction.toString());
    setTaxRate(emp.taxRate.toString());
    setViewMode('slip');
  };

  const getSlipCalculations = () => {
    if (!selectedEmployee) return {};
    const base = parseFloat(basicSalary) || 0;
    const allow = parseFloat(allowance) || 0;
    const bpjs = parseFloat(bpjsDeduction) || 0;
    const taxPct = parseFloat(taxRate) || 0;

    const grossSalary = base + allow;
    const taxDeduction = Math.round((grossSalary - bpjs) * (taxPct / 100));
    const totalDeductions = bpjs + taxDeduction;
    const takeHomePay = grossSalary - totalDeductions;

    return {
      grossSalary,
      taxDeduction,
      totalDeductions,
      takeHomePay
    };
  };

  const calc = getSlipCalculations();

  return (
    <div className="module-container animate-fade-in">
      {viewMode === 'list' ? (
        <div>
          <div className="module-header-actions">
            <div>
              <h2 className="module-title">Sistem Penggajian & Payroll</h2>
              <p className="module-subtitle">Kelola struktur gaji pokok staf, hitung tunjangan, potongan BPJS/Pajak PPh 21, dan cetak slip gaji karyawan</p>
            </div>
          </div>

          <div className="card max-w-4xl mx-auto">
            <h4>Daftar Staf Aktif</h4>
            <p className="text-muted text-sm mb-4">Pilih karyawan di bawah ini untuk melihat detail rincian upah dan menerbitkan slip gaji bulanan.</p>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID Staff</th>
                    <th>Nama Lengkap</th>
                    <th>Jabatan Kerja</th>
                    <th>Gaji Pokok</th>
                    <th>Tunjangan Jabatan</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id} className="hoverable-row" onClick={() => handleSelectEmployee(emp)}>
                      <td className="font-semibold text-sm">{emp.id}</td>
                      <td>{emp.name}</td>
                      <td>
                        <span className="badge badge-neutral">{emp.position}</span>
                      </td>
                      <td className="font-semibold">{formatIDR(emp.basicSalary)}</td>
                      <td>{formatIDR(emp.allowance)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-xs btn-primary flex-row align-center gap-1">
                          <span>Proses Slip</span>
                          <ChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Slip Generator Mode */
        selectedEmployee && (
          <div className="max-w-4xl mx-auto">
            <div className="no-print mb-4 flex-row justify-between align-center">
              <button className="btn btn-secondary" onClick={() => setViewMode('list')}>
                Kembali ke Daftar Karyawan
              </button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <Printer size={16} />
                <span>Cetak Slip Gaji</span>
              </button>
            </div>

            <div className="grid-split-layout">
              {/* Slip Editor Form */}
              <div className="card no-print">
                <h4>Kustomisasi Gaji Karyawan</h4>
                <div className="mt-4">
                  <div className="form-group">
                    <label>Gaji Pokok (Rp)</label>
                    <input type="number" value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Tunjangan Transport & Makan (Rp)</label>
                    <input type="number" value={allowance} onChange={(e) => setAllowance(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Potongan BPJS Ketenagakerjaan (Rp)</label>
                    <input type="number" value={bpjsDeduction} onChange={(e) => setBpjsDeduction(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Persentase PPh 21 (%)</label>
                    <select value={taxRate} onChange={(e) => setTaxRate(e.target.value)}>
                      <option value="0">0% (PTKP / Gaji Kecil)</option>
                      <option value="5">5% (Tarif Lapisan I)</option>
                      <option value="15">15% (Tarif Lapisan II)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Official Slip Gaji Sheet */}
              <div className="invoice-paper card col-span-2 relative" id="print-area">
                <div className="text-center">
                  <h2 className="company-title">{companyProfile.name}</h2>
                  <h3 className="module-title" style={{ letterSpacing: '2px', fontSize: '18px', marginTop: '4px' }}>SLIP GAJI KARYAWAN</h3>
                  <p className="text-sm text-muted">Periode Kerja: Juni 2026</p>
                  <hr className="report-divider" />
                </div>

                <div className="grid-2-cols mb-6">
                  <div className="emp-slip-details">
                    <div><span>ID Karyawan:</span> <strong>{selectedEmployee.id}</strong></div>
                    <div><span>Nama Lengkap:</span> <strong>{selectedEmployee.name}</strong></div>
                    <div><span>Jabatan Kerja:</span> <span>{selectedEmployee.position}</span></div>
                  </div>
                  <div className="text-right">
                    <div><span>Tanggal Cetak:</span> <span>25 Juni 2026</span></div>
                    <div><span>Metode Transfer:</span> <span>Bank Payroll Otomatis</span></div>
                  </div>
                </div>

                <div className="grid-2-cols gap-8 border-top pt-4">
                  {/* Earnings */}
                  <div>
                    <h5 className="sub-section-title font-bold text-success">I. PENERIMAAN (EARNINGS)</h5>
                    <div className="report-row indentation-1 mt-2">
                      <span>Gaji Pokok (Basic Salary)</span>
                      <span>{formatIDR(basicSalary)}</span>
                    </div>
                    <div className="report-row indentation-1">
                      <span>Tunjangan Makan & Transport</span>
                      <span>{formatIDR(allowance)}</span>
                    </div>
                    <div className="report-row total-row mt-4 border-top">
                      <span>Total Penerimaan Kotor:</span>
                      <span className="font-semibold">{formatIDR(calc.grossSalary)}</span>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div>
                    <h5 className="sub-section-title font-bold text-danger">II. POTONGAN (DEDUCTIONS)</h5>
                    <div className="report-row indentation-1 mt-2">
                      <span>Potongan BPJS Kesehatan/Ketenagakerjaan</span>
                      <span className="text-danger">-{formatIDR(bpjsDeduction)}</span>
                    </div>
                    <div className="report-row indentation-1">
                      <span>Potongan Pajak PPh Pasal 21 ({taxRate}%)</span>
                      <span className="text-danger">-{formatIDR(calc.taxDeduction)}</span>
                    </div>
                    <div className="report-row total-row mt-4 border-top">
                      <span>Total Potongan Gaji:</span>
                      <span className="text-danger font-semibold">-{formatIDR(calc.totalDeductions)}</span>
                    </div>
                  </div>
                </div>

                <div className="take-home-pay-card mt-8 p-4 bg-light text-center border-radius-sm border">
                  <span className="section-label">GAJI BERSIH DITERIMA (TAKE HOME PAY)</span>
                  <h2 className="text-success font-bold mt-2" style={{ fontSize: '26px' }}>
                    {formatIDR(calc.takeHomePay)}
                  </h2>
                </div>

                <div className="invoice-paper-footer mt-12">
                  <div className="signature-col">
                    <p>Disetujui Oleh,</p>
                    <div className="signature-line" style={{ marginTop: '50px' }}></div>
                    <span>Manager HRD</span>
                  </div>
                  <div className="signature-col text-right">
                    <p>Diterima Oleh,</p>
                    <div className="signature-line" style={{ marginTop: '50px' }}></div>
                    <span>{selectedEmployee.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
