import React, { useState } from 'react';
import { ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqData = [
    {
      q: 'Bagaimana cara menambahkan invoice penjualan baru?',
      a: 'Masuk ke menu Penjualan > Daftar Invoice di sidebar kiri, lalu klik tombol "+ Buat Invoice Baru" di sudut kanan atas. Isi informasi pelanggan, tanggal transaksi, produk/item yang ditagihkan, lalu klik "Simpan & Terbitkan".'
    },
    {
      q: 'Bagaimana e-Meterai Rp10.000 diterapkan pada dokumen?',
      a: 'Navigasikan ke menu Layanan & Integrasi > e-Meterai. Pilih file dokumen PDF invoice atau kontrak Anda, pastikan kuota mencukupi, lalu klik "Materaikan Dokumen". Sistem akan menempelkan segel e-Meterai beserta nomor seri unik secara digital.'
    },
    {
      q: 'Bagaimana cara mencatat pengeluaran operasional (biaya) kantor?',
      a: 'Buka menu Biaya di sidebar, klik "+ Catat Pengeluaran Baru". Pilih kategori pengeluaran (Sewa, Gaji, Utilitas), pilih kode Akun Perkiraan (COA) beban, masukkan jumlah nominal, tanggal, dan deskripsi deskriptif, lalu klik Simpan.'
    },
    {
      q: 'Bagaimana status "Jatuh Tempo" dihitung pada Invoice?',
      a: 'Status Jatuh Tempo akan otomatis aktif jika status invoice masih "Pending" dan tanggal hari ini telah melewati tanggal jatuh tempo yang Anda tentukan saat membuat invoice.'
    },
    {
      q: 'Apakah data simulasi ini akan hilang saat browser di-refresh?',
      a: 'Tidak! Seluruh data transaksi, pelanggan, supplier, payroll, dan CRM yang Anda masukkan disimpan di penyimpanan lokal (localStorage) browser Anda. Data hanya akan bersih jika Anda menghapus cache browser atau klik Reset Data.'
    },
    {
      q: 'Bagaimana cara menyambungkan WhatsApp Notification API?',
      a: 'Anda bisa masuk ke Layanan & Integrasi > Integrasi API. Klik sambungkan pada opsi WhatsApp Notification Gateway. Setelah terhubung, sistem akan otomatis mengirimkan draf notifikasi tagihan PDF kepada pelanggan via nomor WA terdaftar.'
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="module-container max-w-3xl mx-auto animate-fade-in">
      <div className="module-header-actions text-center justify-center flex-col">
        <HelpCircle size={40} className="text-primary mb-2" />
        <h2 className="module-title">Pusat Bantuan & FAQ</h2>
        <p className="module-subtitle">Temukan jawaban atas pertanyaan umum seputar fitur aplikasi AkuntanKu</p>
      </div>

      <div className="faq-list mt-6 flex-col gap-4">
        {faqData.map((item, idx) => (
          <div key={idx} className="card faq-item-card" style={{ padding: '0px' }}>
            <div 
              className="faq-question-row p-4 flex-row justify-between align-center" 
              onClick={() => toggleAccordion(idx)}
              style={{ cursor: 'pointer' }}
            >
              <h5 className="font-semibold text-md pr-4">{item.q}</h5>
              {openIndex === idx ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </div>
            {openIndex === idx && (
              <div className="faq-answer-row p-4 border-top bg-light">
                <p className="text-muted text-sm" style={{ lineHeight: '1.6' }}>{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
