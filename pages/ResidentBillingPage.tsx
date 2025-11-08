import React, { useState } from 'react';
import { Header } from '../components/Header';
import { ResidentTable } from '../components/ResidentTable';
import { PaymentModal } from '../components/PaymentModal';
import { dummyResidents } from '../data/residents';
import type { Resident } from '../types';

interface ResidentBillingPageProps {
  onBack: () => void;
}

export const ResidentBillingPage: React.FC<ResidentBillingPageProps> = ({ onBack }) => {
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowQR = (resident: Resident) => {
    setSelectedResident(resident);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResident(null);
  };

  return (
    <>
      <Header title="Tagihan Warga" onBack={onBack} />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-800">Daftar Tagihan</h2>
            <p className="text-sm text-zinc-600 mt-1">
              Klik alamat atau tombol "Tampilkan QR" untuk membuat QR code pembayaran
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-600">Total Warga</p>
            <p className="text-2xl font-bold text-blue-600">{dummyResidents.length}</p>
          </div>
        </div>

        <ResidentTable 
          residents={dummyResidents} 
          onShowQR={handleShowQR}
        />

        <div className="text-center text-xs text-zinc-500 mt-6">
          <p>Data warga dapat diubah melalui pengaturan sistem</p>
        </div>
      </div>

      <PaymentModal
        resident={selectedResident}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};