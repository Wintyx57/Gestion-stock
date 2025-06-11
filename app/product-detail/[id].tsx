import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Minus, Plus } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, updateStock } = useApp();

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Produit introuvable</Text>
      </View>
    );
  }

  const handleAdd = () => updateStock(product.id, 1, 'Ajout rapide');
  const handleRemove = () => {
    if (product.currentStock > 0) {
      updateStock(product.id, -1, 'Vente rapide');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.ean}>{product.ean}</Text>

      {product.description && (
        <Text style={styles.description}>{product.description}</Text>
      )}

      <View style={styles.infoGrid}>
        {product.supplier && (
          <Text style={styles.infoItem}>🏪 {product.supplier}</Text>
        )}
        {product.price !== undefined && (
          <Text style={styles.infoItem}>💰 {product.price}€</Text>
        )}
        {product.location && (
          <Text style={styles.infoItem}>📍 {product.location}</Text>
        )}
        {product.quantity && product.unit && (
          <Text style={styles.infoItem}>📦 {product.quantity} {product.unit}</Text>
        )}
      </View>

      <View style={styles.stockSection}>
        <Text style={styles.stockLabel}>Stock actuel</Text>
        <Text style={styles.stockValue}>{product.currentStock}</Text>
        <View style={styles.stockActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={handleRemove}
            disabled={product.currentStock === 0}
          >
            <Minus size={20} color={product.currentStock === 0 ? '#9CA3AF' : '#EF4444'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.addButton]}
            onPress={handleAdd}
          >
            <Plus size={20} color="#10B981" />
          </TouchableOpacity>
        </View>
      </View>

      {product.movements?.length > 0 && (
        <View style={styles.movementsSection}>
          <Text style={styles.sectionTitle}>Mouvements</Text>
          {product.movements.slice().reverse().map((m, idx) => (
            <View key={idx} style={styles.movementItem}>
              <Text style={styles.movementText}>{new Date(m.date).toLocaleString()} - {m.change > 0 ? '+' : ''}{m.change}</Text>
              <Text style={styles.movementReason}>{m.reason} (stock {m.newStock})</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>⬅️ Retour</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  notFound: { fontSize: 18, color: '#1F2937' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  ean: { fontSize: 12, color: '#6B7280', marginBottom: 12, fontFamily: 'monospace' },
  description: { fontSize: 14, color: '#374151', marginBottom: 12 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  infoItem: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 12, color: '#374151' },
  stockSection: { alignItems: 'center', marginBottom: 20 },
  stockLabel: { fontSize: 16, color: '#6B7280' },
  stockValue: { fontSize: 32, fontWeight: 'bold', color: '#1F2937', marginVertical: 8 },
  stockActions: { flexDirection: 'row', gap: 16 },
  actionButton: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  removeButton: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  addButton: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
  movementsSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  movementItem: { marginBottom: 8 },
  movementText: { fontSize: 12, color: '#374151' },
  movementReason: { fontSize: 12, color: '#6B7280' },
  backButton: { alignSelf: 'center', marginTop: 20, backgroundColor: '#E5E7EB', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  backText: { fontSize: 14, color: '#374151', fontWeight: '600' }
});
