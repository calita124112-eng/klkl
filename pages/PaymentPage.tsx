import React, { useEffect, useRef } from 'react';
import type { PaymentData } from '../types';
import { Header } from '../components/Header';
import { CountdownTimer } from '../components/CountdownTimer';

// Make qrcode available from the global scope (window)
declare var qrcode: any;

interface PaymentPageProps {
  paymentData: PaymentData;
  onBack: () => void;
}

const formatCurrency = (amount: string) => {
    const number = parseFloat(amount);
    if (isNaN(number)) return "0.00";
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
};

export const PaymentPage: React.FC<PaymentPageProps> = ({ paymentData, onBack }) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (paymentData.qrString && qrCodeRef.current) {
      qrCodeRef.current.innerHTML = ''; // Clear previous QR code
      try {
        const qr = qrcode(0, 'M'); // type 0, error correction 'M'
        qr.addData(paymentData.qrString);
        qr.make();
        // Use a larger cell size for a higher-res base image, looks better when scaled.
        qrCodeRef.current.innerHTML = qr.createImgTag(8, 4); // (module size, margin)
        
        // Make the injected img responsive
        const img = qrCodeRef.current.querySelector('img');
        if (img) {
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.imageRendering = 'pixelated'; // Keep pixels sharp
            
            // Create canvas version for download
            if (canvasRef.current) {
              const canvas = canvasRef.current;
              const ctx = canvas.getContext('2d');
              canvas.width = 512;
              canvas.height = 512;
              
              if (ctx) {
                // Fill white background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw QR code
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              }
            }
        }
      } catch (e) {
        console.error("Failed to render QR Code image:", e);
      }
    }
  }, [paymentData.qrString]);

  const handleDownloadQR = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      const fileName = `QRIS-${paymentData.merchantName.replace(/\s+/g, '-')}-${formatCurrency(paymentData.amount).replace(/[^\d]/g, '')}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShareQR = async () => {
    if (canvasRef.current) {
      try {
        // Convert canvas to blob
        canvasRef.current.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `QRIS-Payment-${paymentData.merchantName}.png`, { type: 'image/png' });
            
            if (navigator.share && navigator.canShare({ files: [file] })) {
              // Use native share API if available
              await navigator.share({
                title: `Pembayaran QRIS - ${paymentData.merchantName}`,
                text: `Pembayaran sebesar Rp${formatCurrency(paymentData.amount)} kepada ${paymentData.merchantName}`,
                files: [file]
              });
            } else {
              // Fallback: copy to clipboard
              const canvas = canvasRef.current;
              if (canvas) {
                canvas.toBlob(async (blob) => {
                  if (blob && navigator.clipboard && navigator.clipboard.write) {
                    try {
                      await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                      ]);
                      alert('QR Code berhasil disalin ke clipboard!');
                    } catch (err) {
                      console.error('Failed to copy to clipboard:', err);
                      // Final fallback: download
                      handleDownloadQR();
                    }
                  } else {
                    // Final fallback: download
                    handleDownloadQR();
                  }
                });
              }
            }
          }
        });
      } catch (error) {
        console.error('Error sharing QR code:', error);
        // Fallback to download
        handleDownloadQR();
      }
    }
  };

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(paymentData.qrString);
      alert('Payload QRIS berhasil disalin ke clipboard!');
    } catch (error) {
      console.error('Failed to copy payload:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = paymentData.qrString;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Payload QRIS berhasil disalin ke clipboard!');
    }
  };

  return (
    <>
      <Header title="Qris Payment" onBack={onBack} />
      <div className="flex flex-col items-center p-6 text-center space-y-6">
        {/* Merchant Info */}
        <h2 className="text-2xl font-bold text-zinc-800 mb-2 truncate max-w-full px-4">{paymentData.merchantName}</h2>
        <p className="text-zinc-800 text-lg font-semibold mb-4">
          Payment of Rp{formatCurrency(paymentData.amount)}
        </p>

        {/* Countdown Timer */}
        <CountdownTimer />

        {/* QR Code */}
        <div className="w-[280px] aspect-square mb-6">
            <div ref={qrCodeRef} className="w-full h-full flex items-center justify-center bg-white p-2 border border-zinc-200 rounded-lg shadow-sm">
                {/* QR Code is injected here */}
            </div>
        </div>
        
        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={handleDownloadQR}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            <i className="fa-solid fa-download"></i>
            <span>Download QR Code</span>
          </button>
          
          <button
            onClick={handleShareQR}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <i className="fa-solid fa-share-alt"></i>
            <span>Share QR Code</span>
          </button>
          
          <button
            onClick={handleCopyPayload}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-zinc-600 text-white font-semibold rounded-xl hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 transition-colors"
          >
            <i className="fa-solid fa-copy"></i>
            <span>Copy Payload</span>
          </button>
        </div>
        
        <p className="text-zinc-400 text-xs">
          E-Wallet transaction cannot be refunded
        </p>
        
        {/* Hidden canvas for download */}
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </>
  );
};