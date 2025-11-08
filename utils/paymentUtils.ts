// Demo function to generate payment payload
// This will be replaced with server-side logic later
export const makeDemoPayload = (residentId: string, amount: number): string => {
  const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // This is a simplified QRIS payload structure for demo purposes
  // In production, this should be generated server-side with proper QRIS format
  const payload = `00020101021226580014ID.CO.QRIS.WWW0215ID${residentId}0303UMI51440014ID.LINKAJA.WWW0215${transactionId}5204539953033605802ID5914BILLING SYSTEM6007JAKARTA61051234062070703A0163044B7A`;
  
  return payload;
};

export const generateTransactionId = (): string => {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};