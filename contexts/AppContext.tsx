import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Product, Alert, AppSettings, ToastMessage } from '@/types';

interface AppContextType {
  // Authentication
  isAuthenticated: boolean;
  userEmail: string;
  login: (email: string, password: string) => void;
  logout: () => void;
  
  // Products & Suppliers
  products: Product[];
  suppliers: string[];
  addProducts: (newProducts: Product[]) => void;
  updateProduct: (productId: number, updates: Partial<Product>) => void;
  updateStock: (productId: number, change: number, reason?: string) => void;
  setInitialStock: (productId: number, quantity: number, threshold?: number) => void;
  addSupplier: (name: string) => void;
  removeSupplier: (name: string) => void;
  
  // Alerts
  alerts: Alert[];
  
  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  
  // Toast
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  
  // Utility
  loadSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    userEmail: '',
    companyName: '',
    autoExportThreshold: 5,
    enableBarcodeScanner: true,
    lowStockColor: 'orange',
    outOfStockColor: 'red',
    emailNotifications: 'none'
  });

  // Load data from storage on app start
  useEffect(() => {
    loadStoredData();
  }, []);

  // Save data to storage when it changes
  useEffect(() => {
    if (isAuthenticated) {
      saveDataToStorage();
      syncToCloud();
    }
  }, [products, suppliers, settings, isAuthenticated]);

  // Calculate alerts when products change
  useEffect(() => {
    const initializedProducts = products.filter(p => p.stockInitialized);
    const lowStockProducts = initializedProducts.filter(p => 
      p.currentStock <= p.alertThreshold && p.currentStock > 0
    );
    const outOfStockProducts = initializedProducts.filter(p => p.currentStock === 0);
    
    setAlerts([
      ...lowStockProducts.map(p => ({
        type: 'low' as const,
        productId: p.id,
        message: `Stock faible: ${p.name} (${p.currentStock} restant)`
      })),
      ...outOfStockProducts.map(p => ({
        type: 'out' as const,
        productId: p.id,
        message: `Rupture de stock: ${p.name}`
      }))
    ]);
  }, [products]);

  const loadStoredData = async () => {
    try {
      const storedAuth = await AsyncStorage.getItem('auth');
      const storedToken = await SecureStore.getItemAsync('token');
      const storedProducts = await AsyncStorage.getItem('products');
      const storedSuppliers = await AsyncStorage.getItem('suppliers');
      const storedSettings = await AsyncStorage.getItem('settings');

      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        setIsAuthenticated(authData.isAuthenticated);
        setUserEmail(authData.userEmail);
      }

      if (storedToken) {
        setAuthToken(storedToken);
        if (!storedAuth) {
          setIsAuthenticated(true);
        }
        await fetchRemoteData(storedToken);
      }

      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }

      if (storedSuppliers) {
        setSuppliers(JSON.parse(storedSuppliers));
      }

      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  const saveDataToStorage = async () => {
    try {
      await AsyncStorage.setItem('auth', JSON.stringify({
        isAuthenticated,
        userEmail
      }));
      await AsyncStorage.setItem('products', JSON.stringify(products));
      await AsyncStorage.setItem('suppliers', JSON.stringify(suppliers));
      await AsyncStorage.setItem('settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const fetchRemoteData = async (token: string) => {
    try {
      const res = await fetch('https://example.com/api/data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.products) setProducts(data.products);
      if (data.suppliers) setSuppliers(data.suppliers);
      if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
    } catch (err) {
      console.error('Failed to fetch remote data', err);
    }
  };

  const syncToCloud = async () => {
    if (!authToken) return;
    try {
      await fetch('https://example.com/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ products, suppliers, settings })
      });
    } catch (err) {
      console.error('Sync error', err);
    }
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      showToast('❌ Veuillez remplir tous les champs', 'error');
      return;
    }

    try {
      const res = await fetch('https://example.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) throw new Error('Bad credentials');

      const data = await res.json();
      await SecureStore.setItemAsync('token', data.token);
      setAuthToken(data.token);
      setIsAuthenticated(true);
      setUserEmail(email);
      setSettings(prev => ({ ...prev, userEmail: email }));
      await fetchRemoteData(data.token);
      showToast('✅ Connexion réussie !', 'success');
    } catch (err) {
      console.error('Login error', err);
      showToast('❌ Échec de la connexion', 'error');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setAuthToken(null);
    SecureStore.deleteItemAsync('token');
    AsyncStorage.clear();
    showToast('👋 Déconnexion réussie', 'info');
  };

  const addProducts = (newProducts: Product[]) => {
    setProducts(prev => [...prev, ...newProducts]);
    
    // Add unique suppliers
    const newSuppliers = [...new Set(newProducts.map(p => p.supplier))];
    newSuppliers.forEach(supplier => {
      if (!suppliers.includes(supplier)) {
        setSuppliers(prev => [...prev, supplier]);
      }
    });
  };

  const updateProduct = (productId: number, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, ...updates } : p
    ));
  };

  const updateStock = (productId: number, change: number, reason = '') => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newStock = Math.max(0, p.currentStock + change);
        return {
          ...p,
          currentStock: newStock,
          movements: [
            ...(p.movements || []), 
            {
              date: new Date().toISOString(),
              change,
              newStock,
              reason: reason || (change > 0 ? 'Ajout' : 'Retrait')
            }
          ]
        };
      }
      return p;
    }));
  };

  const setInitialStock = (productId: number, quantity: number, threshold = 5) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          currentStock: quantity,
          alertThreshold: threshold,
          stockInitialized: true,
          movements: [{
            date: new Date().toISOString(),
            change: quantity,
            newStock: quantity,
            reason: 'Stock initial'
          }]
        };
      }
      return p;
    }));
  };

  const addSupplier = (name: string) => {
    if (name && !suppliers.includes(name)) {
      setSuppliers(prev => [...prev, name]);
      showToast(`✅ Fournisseur "${name}" ajouté`, 'success');
    }
  };

  const removeSupplier = (name: string) => {
    setSuppliers(prev => prev.filter(s => s !== name));
    setProducts(prev => prev.map(p => 
      p.supplier === name ? { ...p, supplier: 'Autre' } : p
    ));
    showToast(`✅ Fournisseur "${name}" supprimé`, 'success');
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    showToast('✅ Paramètres mis à jour', 'success');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadSampleData = () => {
    const sampleProducts: Product[] = [
      {
        id: 1, supplier: 'Demo', ean: '5410340221013', name: 'Croquettes Chat Royal Canin 2kg',
        description: 'Alimentation complète pour chat adulte', price: 15.99, quantity: '2', unit: 'kg', 
        category: 'Alimentation', animal: 'Chat', brand: 'Royal Canin', location: 'Rayon A1',
        currentStock: 8, alertThreshold: 5, movements: [
          { date: new Date(Date.now() - 86400000).toISOString(), change: 10, newStock: 10, reason: 'Réapprovisionnement' },
          { date: new Date().toISOString(), change: -2, newStock: 8, reason: 'Vente' }
        ], stockInitialized: true, createdAt: new Date().toISOString()
      },
      {
        id: 2, supplier: 'Demo', ean: '5410340221020', name: 'Croquettes Chien Pro Plan 3kg',
        description: 'Alimentation premium pour chien', price: 22.50, quantity: '3', unit: 'kg',
        category: 'Alimentation', animal: 'Chien', brand: 'Pro Plan', location: 'Rayon B2',
        currentStock: 3, alertThreshold: 8, movements: [
          { date: new Date(Date.now() - 172800000).toISOString(), change: 5, newStock: 5, reason: 'Stock initial' },
          { date: new Date(Date.now() - 86400000).toISOString(), change: -2, newStock: 3, reason: 'Vente' }
        ], stockInitialized: true, createdAt: new Date().toISOString()
      },
      {
        id: 3, supplier: 'Demo', ean: '3456789012345', name: 'Litière Agglomérante 10L',
        description: 'Litière haute absorption', price: 8.90, quantity: '10', unit: 'L',
        category: 'Hygiène', animal: 'Chat', brand: 'Catsan', location: 'Rayon C3',
        currentStock: 0, alertThreshold: 3, movements: [
          { date: new Date(Date.now() - 259200000).toISOString(), change: 5, newStock: 5, reason: 'Stock initial' },
          { date: new Date().toISOString(), change: -5, newStock: 0, reason: 'Vente' }
        ], stockInitialized: true, createdAt: new Date().toISOString()
      },
      {
        id: 4, supplier: 'Demo', ean: '7890123456789', name: 'Jouet Corde Chien',
        description: 'Jouet en corde naturelle', price: 4.99, quantity: '1', unit: 'pièce',
        category: 'Jouets', animal: 'Chien', brand: 'Kong', location: 'Rayon D4',
        currentStock: 12, alertThreshold: 2, movements: [
          { date: new Date().toISOString(), change: 12, newStock: 12, reason: 'Stock initial' }
        ], stockInitialized: true, createdAt: new Date().toISOString()
      }
    ];

    setProducts(sampleProducts);
    if (!suppliers.includes('Demo')) {
      setSuppliers(prev => [...prev, 'Demo']);
    }
    showToast('✅ 4 produits d\'exemple chargés avec succès !', 'success');
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      userEmail,
      login,
      logout,
      products,
      suppliers,
      addProducts,
      updateProduct,
      updateStock,
      setInitialStock,
      addSupplier,
      removeSupplier,
      alerts,
      settings,
      updateSettings,
      toast,
      showToast,
      loadSampleData
    }}>
      {children}
    </AppContext.Provider>
  );
};
