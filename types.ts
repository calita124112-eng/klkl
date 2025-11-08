export interface DynamicQrisFormData {
  paymentAmount: string;
  transactionFeeType: 'Persentase' | 'Rupiah';
  transactionFeeValue: string;
}

export interface PaymentData {
    qrString: string;
    amount: string;
    merchantName: string;
}

export interface SavedQrisItem {
  merchantName: string;
  qrisString: string;
}

export interface Resident {
  id: string;
  name: string;
  address: string;
  billAmount: number;
}

export interface PaymentTransaction {
  id: string;
  residentId: string;
  amount: number;
  payload: string;
}