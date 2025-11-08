import React from 'react';
import type { Resident } from '../types';

interface ResidentTableProps {
  residents: Resident[];
  onShowQR: (resident: Resident) => void;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const ResidentTable: React.FC<ResidentTableProps> = ({ residents, onShowQR }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg shadow-sm">
        <thead className="bg-zinc-50 border-b border-zinc-200">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-800">Nama</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-800">Alamat</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-zinc-800">Tagihan</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-zinc-800">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {residents.map((resident) => (
            <tr key={resident.id} className="hover:bg-zinc-50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-zinc-900">
                {resident.name}
              </td>
              <td 
                className="px-4 py-3 text-sm text-zinc-600 cursor-pointer hover:text-blue-600 hover:underline max-w-xs truncate"
                onClick={() => onShowQR(resident)}
                title={resident.address}
              >
                {resident.address}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-zinc-900 text-right">
                {formatCurrency(resident.billAmount)}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onShowQR(resident)}
                  className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                >
                  Tampilkan QR
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};