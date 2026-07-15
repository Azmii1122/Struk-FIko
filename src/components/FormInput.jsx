import React from 'react';
import { Plus, Trash2, User, Car, Hash, Calendar, FileText } from 'lucide-react';
import { formatNumberWithSeparator, parseRawNumber } from '../utils/helpers';

export default function FormInput({
  form,
  onChange,
  onAddItem,
  onRemoveItem,
  onItemChange
}) {
  const handleNopolChange = (e) => {
    // Automatically convert to uppercase
    const val = e.target.value.toUpperCase();
    onChange('nopol', val);
  };

  const handleTahunChange = (e) => {
    // Restrict to 4 digits
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    onChange('tahunKendaraan', val);
  };

  return (
    <div className="space-y-6">
      {/* SECTION: Metadata Struk (Read-Only) */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-zinc-500" />
          Detail Struk Perbaikan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
              ID Struk
            </label>
            <div className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 font-mono select-all">
              {form.idStruk}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
              Tanggal Servis
            </label>
            <div className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 font-medium">
              {form.tanggalServis}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Identitas Pelanggan & Kendaraan */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
          <User className="w-4 h-4 text-zinc-500" />
          Identitas Pelanggan & Kendaraan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nama Customer */}
          <div className="sm:col-span-2">
            <label htmlFor="namaCustomer" className="block text-xs font-semibold text-zinc-600 mb-1.5">
              Nama Customer
            </label>
            <div className="relative">
              <input
                type="text"
                id="namaCustomer"
                value={form.namaCustomer}
                onChange={(e) => onChange('namaCustomer', e.target.value)}
                placeholder="Masukkan nama pelanggan"
                className="w-full border border-zinc-300 rounded-lg pl-3 pr-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
              />
            </div>
          </div>

          {/* Jenis Kendaraan */}
          <div>
            <label htmlFor="jenisKendaraan" className="block text-xs font-semibold text-zinc-600 mb-1.5">
              Jenis Kendaraan
            </label>
            <select
              id="jenisKendaraan"
              value={form.jenisKendaraan}
              onChange={(e) => onChange('jenisKendaraan', e.target.value)}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-800 bg-white focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
            >
              <option value="Motor">Motor</option>
              <option value="Mobil">Mobil</option>
            </select>
          </div>

          {/* Model/Nama Kendaraan */}
          <div>
            <label htmlFor="modelKendaraan" className="block text-xs font-semibold text-zinc-600 mb-1.5">
              Nama / Model Kendaraan
            </label>
            <div className="relative">
              <input
                type="text"
                id="modelKendaraan"
                value={form.modelKendaraan}
                onChange={(e) => onChange('modelKendaraan', e.target.value)}
                placeholder="Contoh: NMAX 155"
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
              />
            </div>
          </div>

          {/* Nopol */}
          <div>
            <label htmlFor="nopol" className="block text-xs font-semibold text-zinc-600 mb-1.5">
              Nomor Polisi (Nopol)
            </label>
            <input
              type="text"
              id="nopol"
              value={form.nopol}
              onChange={handleNopolChange}
              placeholder="Contoh: BK 1234 ABC"
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 font-medium tracking-wide transition-colors"
            />
          </div>

          {/* Tahun Kendaraan */}
          <div>
            <label htmlFor="tahunKendaraan" className="block text-xs font-semibold text-zinc-600 mb-1.5">
              Tahun Kendaraan
            </label>
            <input
              type="text"
              id="tahunKendaraan"
              value={form.tahunKendaraan}
              onChange={handleTahunChange}
              placeholder="Contoh: 2024"
              maxLength={4}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* SECTION: Daftar Item / Jasa */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <Car className="w-4 h-4 text-zinc-500" />
            Daftar Pekerjaan / Suku Cadang
          </h3>
          <button
            type="button"
            onClick={onAddItem}
            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-950 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Baris
          </button>
        </div>

        {/* Desktop Table view for items */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                <th className="py-2.5 px-2">Item / Jasa</th>
                <th className="py-2.5 px-2 w-[160px]">Harga Satuan</th>
                <th className="py-2.5 px-2 w-[85px] text-center">QTY</th>
                <th className="py-2.5 px-2 w-[140px] text-right">Total</th>
                <th className="py-2.5 px-2 w-[50px] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {form.items.map((item, index) => (
                <tr key={item.id} className="hover:bg-zinc-50/55 transition-colors">
                  <td className="py-3 px-2">
                    <input
                      type="text"
                      value={item.nama}
                      onChange={(e) => onItemChange(item.id, 'nama', e.target.value)}
                      placeholder="Nama jasa perbaikan / sparepart"
                      className="w-full border-b border-transparent focus:border-zinc-300 py-1 text-zinc-800 placeholder-zinc-400 focus:outline-none text-sm"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <div className="relative flex items-center">
                      <span className="text-zinc-400 text-xs font-semibold absolute left-1">Rp</span>
                      <input
                        type="text"
                        value={formatNumberWithSeparator(item.harga)}
                        onChange={(e) => onItemChange(item.id, 'harga', parseRawNumber(e.target.value))}
                        placeholder="0"
                        className="w-full border-b border-transparent focus:border-zinc-300 pl-6 pr-1 py-1 text-zinc-800 font-medium placeholder-zinc-400 focus:outline-none text-sm text-right sm:text-left"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => onItemChange(item.id, 'qty', Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full border border-zinc-200 rounded-md py-1 text-center text-zinc-800 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 text-sm"
                    />
                  </td>
                  <td className="py-3 px-2 text-right text-zinc-900 font-semibold text-sm">
                    Rp {formatNumberWithSeparator(item.harga * item.qty) || '0'}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <button
                      type="button"
                      disabled={form.items.length <= 1}
                      onClick={() => onRemoveItem(item.id)}
                      className={`text-zinc-400 hover:text-zinc-950 p-1.5 rounded-md hover:bg-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List view for items */}
        <div className="md:hidden space-y-4">
          {form.items.map((item, index) => (
            <div key={item.id} className="border border-zinc-100 rounded-xl p-4 bg-zinc-50/50 space-y-3 relative">
              <div className="absolute top-3 right-3">
                <button
                  type="button"
                  disabled={form.items.length <= 1}
                  onClick={() => onRemoveItem(item.id)}
                  className="text-zinc-400 hover:text-zinc-950 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Item #{index + 1}</span>
                <input
                  type="text"
                  value={item.nama}
                  onChange={(e) => onItemChange(item.id, 'nama', e.target.value)}
                  placeholder="Nama jasa / sparepart"
                  className="w-full bg-transparent border-b border-zinc-200 focus:border-zinc-900 py-1.5 text-zinc-800 font-medium focus:outline-none text-sm placeholder-zinc-400 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Harga Satuan</label>
                  <div className="relative flex items-center">
                    <span className="text-zinc-400 text-xs font-semibold absolute left-2">Rp</span>
                    <input
                      type="text"
                      value={formatNumberWithSeparator(item.harga)}
                      onChange={(e) => onItemChange(item.id, 'harga', parseRawNumber(e.target.value))}
                      placeholder="0"
                      className="w-full bg-white border border-zinc-300 rounded-lg pl-7 pr-2 py-1.5 text-zinc-800 font-medium placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">QTY</label>
                  <input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) => onItemChange(item.id, 'qty', Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full bg-white border border-zinc-300 rounded-lg py-1.5 text-center text-zinc-800 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-zinc-150/60 pt-2.5">
                <span className="text-xs font-semibold text-zinc-500">Subtotal</span>
                <span className="text-sm font-bold text-zinc-900">
                  Rp {formatNumberWithSeparator(item.harga * item.qty) || '0'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
