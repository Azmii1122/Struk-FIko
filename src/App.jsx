import { useState, useEffect } from 'react';
import { Wrench, Download, RotateCcw, CheckCircle2 } from 'lucide-react';
import FormInput from './components/FormInput';
import SummaryPreview from './components/SummaryPreview';
import { generateReceiptId, formatIndonesianDate } from './utils/helpers';
import { downloadReceiptPDF } from './utils/pdfGenerator';

const initialFormState = () => {
  const newDate = new Date();
  return {
    idStruk: generateReceiptId(newDate),
    tanggalServis: formatIndonesianDate(newDate),
    namaCustomer: '',
    jenisKendaraan: 'Motor',
    modelKendaraan: '',
    nopol: '',
    tahunKendaraan: '',
    items: [
      { id: 'initial-1', nama: '', harga: 0, qty: 1 }
    ]
  };
};

export default function App() {
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem('fiko_draft_struk');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Make sure it has at least one item
        if (parsed.items && parsed.items.length === 0) {
          parsed.items = [{ id: 'initial-1', nama: '', harga: 0, qty: 1 }];
        }
        return parsed;
      } catch (e) {
        console.error("Failed to parse localStorage draft, fallback to new form.", e);
      }
    }
    return initialFormState();
  });

  const [notification, setNotification] = useState(null);

  // Sync state to localStorage on modification
  useEffect(() => {
    localStorage.setItem('fiko_draft_struk', JSON.stringify(form));
  }, [form]);

  // Show auto-fading notification helper
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleFormChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      nama: '',
      harga: 0,
      qty: 1
    };
    setForm(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const handleRemoveItem = (id) => {
    setForm(prev => {
      // Ensure we don't delete the last row
      if (prev.items.length <= 1) return prev;
      return {
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      };
    });
  };

  const handleItemChange = (id, field, value) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleDownloadPDF = () => {
    // Generate PDF
    downloadReceiptPDF(form);

    // Clear local storage and show success
    localStorage.removeItem('fiko_draft_struk');
    showNotification("Struk PDF Berhasil Diunduh & Draf Dihapus!");

    // Reset to brand new form state (gets new ID Struk and current Date)
    setForm(initialFormState());
  };

  const handleResetForm = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus seluruh draf form ini?")) {
      localStorage.removeItem('fiko_draft_struk');
      setForm(initialFormState());
      showNotification("Draf struk berhasil dikosongkan.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col relative pb-24 lg:pb-8">
      {/* BACKGROUND GRAPHIC ACCENTS */}
      <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none"></div>

      {/* HEADER SECTION */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-zinc-200/80 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-zinc-950 rounded-xl flex items-center justify-center text-white shadow-sm shadow-zinc-900/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-zinc-900 tracking-tight leading-none">
                Fiko Modifikasi
              </h1>
              <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-1">
                Panel Struk Digital
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700 uppercase">
              Offline-Ready
            </span>
          </div>
        </div>
      </header>

      {/* NOTIFICATION FLOATER */}
      {notification && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-zinc-900 text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto w-full px-4 py-6 sm:py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 relative">
        {/* LEFT COLUMN: Input Form */}
        <section className="lg:col-span-7 space-y-6">
          <div className="mb-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">Cetak Struk Bengkel</h2>
            <p className="text-sm text-zinc-500 mt-1">
              Masukkan detail identitas kendaraan dan rincian perbaikan di bawah.
            </p>
          </div>

          <FormInput
            form={form}
            onChange={handleFormChange}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onItemChange={handleItemChange}
          />
        </section>

        {/* RIGHT COLUMN: Live Summary Receipt Preview */}
        <section className="lg:col-span-5 space-y-6">
          <div className="mb-2 hidden lg:block">
            <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Pratinjau Struk (A5)</h2>
            <p className="text-sm text-zinc-500 mt-1">
              Tampilan struk fisik yang akan dicetak ke berkas PDF.
            </p>
          </div>

          <SummaryPreview
            form={form}
            onDownloadPDF={handleDownloadPDF}
            onReset={handleResetForm}
          />
        </section>
      </main>

      {/* MOBILE FLOATING ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-zinc-200 px-4 py-3 flex items-center justify-between gap-3 z-50 shadow-xl">
        <button
          type="button"
          onClick={handleResetForm}
          className="flex-1 inline-flex items-center justify-center gap-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold text-xs py-3 px-4 rounded-xl border border-zinc-200/50 cursor-pointer active:scale-95 transition-transform"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Form
        </button>
        
        <button
          type="button"
          onClick={handleDownloadPDF}
          className="flex-[2] inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-900 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md cursor-pointer active:scale-95 transition-transform"
        >
          <Download className="w-4 h-4" />
          Unduh PDF
        </button>
      </div>
    </div>
  );
}
