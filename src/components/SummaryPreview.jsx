import React from 'react';
import { Download, Trash2, Receipt } from 'lucide-react';
import { formatRupiah } from '../utils/helpers';

export default function SummaryPreview({
  form,
  onDownloadPDF,
  onReset
}) {
  const grandTotal = form.items.reduce((acc, item) => acc + (item.harga * item.qty), 0);

  return (
    <div className="space-y-6 lg:sticky lg:top-6">
      {/* SECTION: Kertas Struk dengan Kedalaman (Depth) & Shadow */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden flex flex-col">
        
        {/* HEADER BLOCK */}
        <div className="bg-slate-50/80 p-6 sm:px-8 sm:pt-8 sm:pb-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-white shadow-sm rounded-xl border border-slate-100 text-slate-700">
                <Receipt size={24} strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Fiko Modifikasi</h2>
                <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
                  Jln. Menteng VII Gg. Cempaka No. 20<br />Kota Medan
                </p>
              </div>
            </div>
            <div className="sm:text-right bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">ID Struk</span>
              <span className="text-sm font-bold text-slate-900 block">{form.idStruk}</span>
              <span className="text-xs font-medium text-slate-500 block mt-0.5">{form.tanggalServis}</span>
            </div>
          </div>
        </div>

        {/* METADATA PELANGGAN */}
        <div className="p-6 sm:px-8 border-b border-slate-100">
          <div className="grid grid-cols-2 gap-y-5 gap-x-4">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Pelanggan</span>
              <span className="text-sm font-bold text-slate-800 block">
                {form.namaCustomer || <span className="text-slate-300 italic font-medium">Nama Pelanggan</span>}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Kendaraan</span>
              <span className="text-sm font-bold text-slate-800 block">
                {form.jenisKendaraan ? `${form.jenisKendaraan} - ${form.modelKendaraan || 'Model'}` : <span className="text-slate-300 italic font-medium">Jenis & Model</span>}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">No. Polisi</span>
              <span className="text-sm font-bold text-slate-800 block">
                {form.nopol || <span className="text-slate-300 italic font-medium">BK 0000 XX</span>}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Tahun</span>
              <span className="text-sm font-bold text-slate-800 block">
                {form.tahunKendaraan || <span className="text-slate-300 italic font-medium">YYYY</span>}
              </span>
            </div>
          </div>
        </div>

        {/* ITEMS LIST TABLE */}
        <div className="p-6 sm:px-8 flex-1">
          {/* Table Header - Menggunakan Grid agar proporsional dan rata kiri sempurna */}
          <div className="grid grid-cols-12 items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-3 border-b-2 border-slate-100 mb-2">
            <div className="col-span-5">Deskripsi</div>
            <div className="col-span-3 text-center">Harga</div>
            <div className="col-span-2 text-center">QTY</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          
          {/* Table Body */}
          <div className="space-y-1 max-h-[250px] overflow-y-auto custom-scrollbar">
            {form.items.length === 0 && (
              <div className="text-center py-8 text-sm font-medium text-slate-400 italic bg-slate-50/50 rounded-xl border border-dashed border-slate-200 mt-2">
                Belum ada rincian perbaikan
              </div>
            )}
            {form.items.map((item) => {
              const itemTotal = item.harga * item.qty;
              return (
                <div key={item.id} className="grid grid-cols-12 items-center text-sm py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <div className="col-span-5 pr-3 text-slate-900 font-semibold truncate">
                    {item.nama || <span className="text-slate-300 italic font-medium">Jasa/Sparepart</span>}
                  </div>
                  <div className="col-span-3 text-center text-slate-600 font-medium">
                    {formatRupiah(item.harga)}
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <span className="text-slate-700 font-bold bg-white border border-slate-200 py-1 px-3 rounded-md shadow-sm">
                      {item.qty}
                    </span>
                  </div>
                  <div className="col-span-2 text-right font-bold text-slate-900">
                    {formatRupiah(itemTotal)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* GRAND TOTAL BLOCK */}
        <div className="bg-slate-900 p-6 sm:px-8 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">Total Akhir</span>
            <span className="text-2xl font-black text-white tracking-tight">
              {formatRupiah(grandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* ACTIONS BUTTON PANEL */}
      <div className="hidden lg:flex flex-col gap-3.5">
        <button
          type="button"
          onClick={onDownloadPDF}
          className="w-full flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-4 px-4 rounded-2xl shadow-md transition-all tap-press"
        >
          <Download className="w-5 h-5" />
          Unduh PDF Struk
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 font-semibold text-sm py-3.5 px-4 rounded-xl border border-slate-200 hover:border-red-200 transition-all tap-press shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
          Kosongkan Form & Draf
        </button>
      </div>
    </div>
  );
}