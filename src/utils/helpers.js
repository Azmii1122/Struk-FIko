/**
 * Generates a receipt ID in the format FIKO-DDMMYY-HHMM.
 * @param {Date} date 
 * @returns {string}
 */
export const generateReceiptId = (date = new Date()) => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `FIKO-${dd}${mm}${yy}-${hh}${min}`;
};

/**
 * Formats a date into local Indonesian format (e.g. 15 Juli 2026).
 * @param {Date} date 
 * @returns {string}
 */
export const formatIndonesianDate = (date = new Date()) => {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Formats a number to Rupiah currency format.
 * @param {number|string} value 
 * @returns {string}
 */
export const formatRupiah = (value) => {
  if (value === undefined || value === null || value === '') return 'Rp 0';
  const number = Number(value);
  if (isNaN(number)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
};

/**
 * Formats a number with thousands separators (Indonesian style, e.g. 15.000).
 * @param {number|string} value 
 * @returns {string}
 */
export const formatNumberWithSeparator = (value) => {
  if (value === undefined || value === null || value === '' || value === 0) return '';
  const number = Number(value);
  if (isNaN(number)) return '';
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
};

/**
 * Strips all non-digit characters and returns an integer.
 * @param {string} rawValue 
 * @returns {number}
 */
export const parseRawNumber = (rawValue) => {
  const digitsOnly = rawValue.replace(/\D/g, '');
  return digitsOnly === '' ? 0 : parseInt(digitsOnly, 10);
};
