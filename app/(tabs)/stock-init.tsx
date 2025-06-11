import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Search, CheckCircle } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Product } from '@/types';
import { router } from 'expo-router';

export default function StockInitScreen() {
  const { products, setInitialStock, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.ean.includes(searchTerm)
  );

  const handleStockChange = (productId: number, value: string, threshold: number) => {
    const quantity = parseInt(value) || 0;
    if (quantity >= 0) {
      setInitialStock(productId, quantity, threshold);
    }
  };

  const handleThresholdChange = (productId: number, value: string, currentStock: number) => {
    const threshold = parseInt(value) || 5;
    if (threshold > 0) {
      setInitialStock(productId, currentStock, threshold);
    }
  };

  const initializedCount = products.filter(p => p.stockInitialized).length;

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={[styles.productCard, item.stockInitialized && styles.productCardInitialized]}>
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          {item.stockInitialized && (
            <View style={styles.initializedBadge}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.initializedText}>Saisi</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.productEan}>{item.ean}</Text>
        
        {item.description && (
          <Text style={styles.productDescription}>{item.description}</Text>
        )}
        
        <View style={styles.productTags}>
          {item.quantity && item.unit && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{item.quantity} {item.unit}</Text>
            </View>
          )}
          {item.price && (
            <View style={[styles.tag, styles.priceTag]}>
              <Text style={styles.tagText}>{item.price}€</Text>
            </View>
          )}
          {item.location && (
            <View style={[styles.tag, styles.locationTag]}>
              <Text style={styles.tagText}>{item.location}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.inputSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Stock</Text>
          <TextInput
            style={styles.stockInput}
            value={item.stockInitialized ? item.currentStock.toString() : ''}
            onChangeText={(value) => handleStockChange(item.id, value, item.alertThreshold || 5)}
            placeholder="0"
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.inputUnit}>unités</Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Seuil</Text>
          <TextInput
            style={styles.thresholdInput}
            value={(item.alertThreshold || 5).toString()}
            onChangeText={(value) => handleThresholdChange(item.id, value, item.currentStock)}
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saisie des Stocks</Text>
        <Text style={styles.subtitle}>
          <Text style={styles.progressNumber}>{initializedCount}</Text>
          <Text style={styles.progressTotal}> / {products.length} produits saisis</Text>
        </Text>
      </View>

      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>📋 Instructions</Text>
        <View style={styles.instructionsContent}>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionIcon}>🎯</Text>
            <Text style={styles.instructionText}>Entrez les quantités réelles en magasin</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionIcon}>⚠️</Text>
            <Text style={styles.instructionText}>Configurez les seuils selon la rotation</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {products.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Aucun produit importé</Text>
          <Text style={styles.emptyDescription}>
            Importez votre catalogue pour commencer la saisie
          </Text>
          <TouchableOpacity 
            style={styles.importButton}
            onPress={() => router.push('/import')}
          >
            <Text style={styles.importButtonText}>📁 Importer Catalogue</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
          
          {initializedCount === products.length && products.length > 0 && (
            <View style={styles.completionCard}>
              <Text style={styles.completionText}>
                🎉 Tous les stocks ont été saisis !
              </Text>
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => {
                  showToast('✅ Configuration terminée !', 'success');
                  router.push('/(tabs)/products');
                }}
              >
                <Text style={styles.completeButtonText}>✅ Terminer la configuration</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  progressNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  progressTotal: {
    fontSize: 16,
    color: '#6B7280',
  },
  instructionsCard: {
    margin: 20,
    backgroundColor: '#F3E8FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 12,
  },
  instructionsContent: {
    gap: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  instructionIcon: {
    fontSize: 16,
  },
  instructionText: {
    fontSize: 14,
    color: '#5B21B6',
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productCardInitialized: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  productInfo: {
    marginBottom: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  initializedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  initializedText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '600',
  },
  productEan: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  productTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priceTag: {
    backgroundColor: '#DCFCE7',
  },
  locationTag: {
    backgroundColor: '#F3E8FF',
  },
  tagText: {
    fontSize: 10,
    color: '#374151',
    fontWeight: '500',
  },
  inputSection: {
    flexDirection: 'row',
    gap: 16,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  stockInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    textAlign: 'center',
    color: '#1F2937',
  },
  thresholdInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    textAlign: 'center',
    color: '#1F2937',
  },
  inputUnit: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  importButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  importButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  completionCard: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
  },
  completionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  completeButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});