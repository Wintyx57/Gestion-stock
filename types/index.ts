export interface Product {
  id: number;
  supplier: string;
  ean: string;
  name: string;
  reference?: string;
  description?: string;
  price?: number;
  quantity?: string;
  unit?: string;
  category?: string;
  animal?: string;
  brand?: string;
  location?: string;
  currentStock: number;
  alertThreshold: number;
  movements: StockMovement[];
  stockInitialized: boolean;
  createdAt: string;
}

export interface StockMovement {
  date: string;
  change: number;
  newStock: number;
  reason: string;
}

export interface Alert {
  type: 'low' | 'out';
  productId: number;
  message: string;
}

export interface AppSettings {
  userEmail: string;
  companyName: string;
  autoExportThreshold: number;
  enableBarcodeScanner: boolean;
  lowStockColor: string;
  outOfStockColor: string;
  emailNotifications: string;
}

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface ImportData {
  headers: string[];
  rows: string[][];
}

export interface ColumnMapping {
  [key: string]: number | undefined;
}
