import React, { useEffect, useRef, useState } from 'react';
import type { Resident } from '../types';
import { makeDemoPayload, generateTransactionId } from '../utils/paymentUtils';

// Make qrcode available from the global scope (window)
declare var QRCode: any;

interface PaymentModalProps {
  resident: Resident | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const PaymentModal: React.FC<PaymentModalProps> = ({ resident, isOpen, onClose }) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [transactionId, setTransactionId] = useState<string>('');
  const [payload, setPayload] = useState<string>('');
  const [qrCodeInstance, setQrCodeInstance] = useState<any>(null);

  useEffect(() => {
    if (isOpen && resident) {
      const txnId = generateTransactionId();
      const qrisPayload = makeDemoPayload(resident.id, resident.billAmount);
      
      setTransactionId(txnId);
      setPayload(qrisPayload);
      
      // Generate QR Code
      if (qrCodeRef.current) {
        // Clear previous QR code
        qrCodeRef.current.innerHTML = '';
        
        try {
          const qr = new QRCode(qrCodeRef.current, {
            text: qrisPayload,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
          });
          setQrCodeInstance(qr);
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    }
  }, [isOpen, resident]);

  const handleDownloadQR = () => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = `qr-payment-${resident?.name.replace(/\s+/g, '-')}-${transactionId}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    }
  };

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      // You could add a toast notification here
      alert('Payload berhasil disalin!');
    } catch (error) {
      console.error('Failed to copy payload:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = payload;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Payload berhasil disalin!');
    }
  };

  if (!isOpen || !resident) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <h2 className="text-xl font-bold text-zinc-800">Pembayaran QRIS</h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <i className="fa-solid fa-times text-lg"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Resident Info */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-600">Nama Warga</label>
              <p className="text-lg font-semibold text-zinc-900">{resident.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-600">Alamat</label>
              <p className="text-sm text-zinc-700 leading-relaxed">{resident.address}</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <label className="block text-sm font-medium text-zinc-600">Nominal Tagihan</label>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(resident.billAmount)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-600">ID Transaksi</label>
                <p className="text-sm font-mono text-zinc-800 bg-zinc-100 px-2 py-1 rounded">
                  {transactionId}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white border-2 border-zinc-200 rounded-xl">
              <div ref={qrCodeRef} className="flex items-center justify-center">
                {/* QR Code will be generated here */}
              </div>
            </div>
            
            <p className="text-xs text-zinc-500 text-center">
              Scan QR code di atas dengan aplikasi e-wallet untuk melakukan pembayaran
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleDownloadQR}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              <i className="fa-solid fa-download"></i>
              <span>Download QR</span>
            </button>
            
            <button
              onClick={handleCopyPayload}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <i className="fa-solid fa-copy"></i>
              <span>Salin Payload</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};