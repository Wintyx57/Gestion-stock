import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Search, Plus, Minus, Eye, BarChart3 } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Product } from '@/types';
import { router } from 'expo-router';

export default function ProductsScreen() {
  const { products, updateStock, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.ean.includes(searchTerm) ||
    (p.location && p.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStockColor = (product: Product) => {
    if (product.currentStock === 0) return '#EF4444';
    if (product.currentStock <= product.alertThreshold) return '#F59E0B';
    return '#10B981';
  };

  const getStockBgColor = (product: Product) => {
    if (product.currentStock === 0) return '#FEF2F2';
    if (product.currentStock <= product.alertThreshold) return '#FFFBEB';
    return '#F0FDF4';
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <TouchableOpacity 
        style={styles.productInfo}
        onPress={() => router.push(`/product-detail/${item.id}`)}
      >
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={[styles.stockBadge, { backgroundColor: getStockBgColor(item) }]}>
            <Text style={[styles.stockText, { color: getStockColor(item) }]}>
              {item.currentStock}
            </Text>
          </View>
        </View>
        
        <Text style={styles.productEan}>{item.ean}</Text>
        
        <View style={styles.productTags}>
          {item.price && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{item.price}€</Text>
            </View>
          )}
          {item.supplier && (
            <View style={[styles.tag, styles.supplierTag]}>
              <Text style={styles.tagText}>{item.supplier}</Text>
            </View>
          )}
          {item.location && (
            <View style={[styles.tag, styles.locationTag]}>
              <Text style={styles.tagText}>{item.location}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      
      <View style={styles.productActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          onPress={() => {
            if (item.currentStock > 0) {
              updateStock(item.id, -1, 'Vente rapide');
              showToast(`✅ Vente ! ${item.name} - Stock: ${item.currentStock - 1}`, 'success');
            }
          }}
          disabled={item.currentStock === 0}
        >
          <Minus size={16} color={item.currentStock === 0 ? '#9CA3AF' : '#EF4444'} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.addButton]}
          onPress={() => {
            updateStock(item.id, 1, 'Ajout rapide');
            showToast(`✅ Ajout ! ${item.name} - Stock: ${item.currentStock + 1}`, 'success');
          }}
        >
          <Plus size={16} color="#10B981" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => router.push(`/product-detail/${item.id}`)}
        >
          <Eye size={16} color="#3B82F6" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Produits</Text>
        <Text style={styles.subtitle}>{products.length} produits</Text>
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
          <BarChart3 size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>Aucun produit</Text>
          <Text style={styles.emptyDescription}>
            Importez votre catalogue pour commencer
          </Text>
          <TouchableOpacity 
            style={styles.importButton}
            onPress={() => router.push('/import')}
          >
            <Text style={styles.importButtonText}>📁 Importer catalogue</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
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
    paddingBottom: 100,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
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
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 32,
    alignItems: 'center',
  },
  stockText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  productEan: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
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
  supplierTag: {
    backgroundColor: '#DBEAFE',
  },
  locationTag: {
    backgroundColor: '#F3E8FF',
  },
  tagText: {
    fontSize: 10,
    color: '#374151',
    fontWeight: '500',
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  removeButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  addButton: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  viewButton: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
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
    marginTop: 16,
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
});