import React, { useState } from 'react';
import { Modal } from 'react-native';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { useApp } from '@/contexts/AppContext';
import { router } from 'expo-router';

export default function ScannerScreen() {
  const { products, updateStock, showToast } = useApp();

  const handleScanned = (code: string) => {
    const product = products.find(p => p.ean === code);
    
    if (product) {
      if (product.currentStock > 0) {
        updateStock(product.id, -1, 'Vente scannée');
        showToast(`✅ VENDU ! ${product.name} - Stock restant: ${product.currentStock - 1}`, 'success');
      } else {
        showToast(`❌ RUPTURE DE STOCK! ${product.name}`, 'error');
      }
    } else {
      showToast(`❌ PRODUIT NON TROUVÉ - Code EAN: ${code}`, 'error');
    }
    
    // Close scanner after scanning
    setTimeout(() => {
      router.back();
    }, 2000);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      statusBarTranslucent
    >
      <BarcodeScanner
        onClose={handleClose}
        onScanned={handleScanned}
      />
    </Modal>
  );
}
