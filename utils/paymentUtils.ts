const crc16 = (str: string): string => {
  let crc = 0xFFFF;
  const strlen = str.length;
  for (let c = 0; c < strlen; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  const hex = (crc & 0xFFFF).toString(16).toUpperCase();
  return hex.padStart(4, '0');
};

const generateUniqueCode = (): string => {
  const now = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return String(random).padStart(3, '0');
};

export const generateDynamicQrisFromStatic = (
  staticQris: string,
  amount: number
): string => {
  if (staticQris.length < 4) {
    throw new Error('Invalid static QRIS data.');
  }

  const uniqueCode = generateUniqueCode();
  const finalAmount = amount + parseInt(uniqueCode);

  const qrisWithoutCrc = staticQris.substring(0, staticQris.length - 4);
  const step1 = qrisWithoutCrc.replace("010211", "010212");

  const parts = step1.split("5802ID");
  if (parts.length !== 2) {
    throw new Error("QRIS data is not in the expected format (missing '5802ID').");
  }

  const amountStr = String(finalAmount);
  const amountTag = "54" + String(amountStr.length).padStart(2, '0') + amountStr;

  const payload = [parts[0], amountTag, "5802ID", parts[1]].join('');

  const finalCrc = crc16(payload);
  return payload + finalCrc;
};

export const generateTransactionId = (): string => {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const loadQrisFromUrl = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { willReadFrequently: true });

      if (!context) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);

      const imageData = context.getImageData(0, 0, img.width, img.height);

      if (typeof (window as any).jsQR === 'function') {
        const code = (window as any).jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
          resolve(code.data);
        } else {
          reject(new Error('Could not find QR code in image'));
        }
      } else {
        reject(new Error('jsQR library not loaded'));
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
};