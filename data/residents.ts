import type { Resident } from '../types';

// Dummy resident data - can be easily replaced with server API call
export const dummyResidents: Resident[] = [
  {
    id: 'RES001',
    name: 'Ahmad Wijaya',
    address: 'Jl. Merdeka No. 123, RT 01/RW 05, Kelurahan Sari, Jakarta Pusat',
    billAmount: 150000
  },
  {
    id: 'RES002', 
    name: 'Siti Nurhaliza',
    address: 'Jl. Sudirman No. 456, RT 02/RW 03, Kelurahan Mawar, Jakarta Selatan',
    billAmount: 275000
  },
  {
    id: 'RES003',
    name: 'Budi Santoso',
    address: 'Jl. Gatot Subroto No. 789, RT 03/RW 07, Kelurahan Melati, Jakarta Barat',
    billAmount: 320000
  },
  {
    id: 'RES004',
    name: 'Dewi Lestari',
    address: 'Jl. Thamrin No. 321, RT 04/RW 02, Kelurahan Anggrek, Jakarta Utara',
    billAmount: 180000
  },
  {
    id: 'RES005',
    name: 'Eko Prasetyo',
    address: 'Jl. Kuningan No. 654, RT 05/RW 01, Kelurahan Kenanga, Jakarta Timur',
    billAmount: 225000
  }
];