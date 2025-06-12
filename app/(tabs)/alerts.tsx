import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { AlertTriangle, Download, ArrowRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Alert } from '@/types';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function AlertsScreen() {
  const { alerts, products, showToast } = useApp();

  const handleExportAlerts = async () => {
    showToast('📊 Export des alertes en cours...', 'info');

    try {
      const header = 'Type;Produit;Stock;Seuil;Emplacement;Fournisseur\n';
      const rows = alerts.map(alert => {
        const prod = products.find(p => p.id === alert.productId);
        return [
          alert.type === 'out' ? 'Rupture' : 'Stock faible',
          prod?.name ?? '',
          prod?.currentStock ?? '',
          prod?.alertThreshold ?? '',
          prod?.location ?? '',
          prod?.supplier ?? ''
        ].join(';');
      });
      const csv = header + rows.join('\n');

      const fileUri =
        FileSystem.cacheDirectory + `alerts-${Date.now()}.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
        showToast('✅ Export prêt à être partagé', 'success');
      } else {
        showToast('❌ Partage non disponible sur cette plateforme', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('❌ Erreur lors de l\'export des alertes', 'error');
    }
  };

  const renderAlert = ({ item }: { item: Alert }) => {
    const product = products.find(p => p.id === item.productId);
    
    return (
      <TouchableOpacity
        style={[styles.alertCard, item.type === 'out' ? styles.alertOut : styles.alertLow]}
        onPress={() => router.push(`/product-detail/${item.productId}`)}
      >
        <View style={styles.alertIcon}>
          <AlertTriangle 
            size={24} 
            color={item.type === 'out' ? '#EF4444' : '#F59E0B'} 
          />
        </View>
        
        <View style={styles.alertContent}>
          <Text style={[styles.alertMessage, item.type === 'out' ? styles.alertMessageOut : styles.alertMessageLow]}>
            {item.message}
          </Text>
          
          {product && (
            <View style={styles.alertDetails}>
              {product.location && (
                <Text style={styles.alertDetail}>📍 {product.location}</Text>
              )}
              {product.supplier && (
                <Text style={styles.alertDetail}>🏪 {product.supplier}</Text>
              )}
              {product.price && (
                <Text style={styles.alertDetail}>💰 {product.price}€</Text>
              )}
            </View>
          )}
        </View>
        
        <View style={styles.alertAction}>
          <ArrowRight size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Alertes de Stock</Text>
          <Text style={styles.subtitle}>
            {alerts.length} {alerts.length === 1 ? 'alerte' : 'alertes'} à traiter
          </Text>
        </View>
        
        {alerts.length > 0 && (
          <TouchableOpacity style={styles.exportButton} onPress={handleExportAlerts}>
            <Download size={20} color="#FFFFFF" />
            <Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity>
        )}
      </View>

      {alerts.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <AlertTriangle size={64} color="#10B981" />
          </View>
          <Text style={styles.emptyTitle}>Aucune alerte ! 🎉</Text>
          <Text style={styles.emptyDescription}>
            Tous vos stocks sont au-dessus des seuils configurés
          </Text>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.push('/(tabs)/')}
          >
            <Text style={styles.backButtonText}>📊 Retour au tableau de bord</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.alertsHeader}>
            <View style={styles.alertTypeCount}>
              <View style={styles.countItem}>
                <View style={[styles.countDot, styles.countDotOut]} />
                <Text style={styles.countText}>
                  {alerts.filter(a => a.type === 'out').length} Ruptures
                </Text>
              </View>
              <View style={styles.countItem}>
                <View style={[styles.countDot, styles.countDotLow]} />
                <Text style={styles.countText}>
                  {alerts.filter(a => a.type === 'low').length} Stock faible
                </Text>
              </View>
            </View>
          </View>
          
          <FlatList
            data={alerts}
            renderItem={renderAlert}
            keyExtractor={(item, index) => `${item.productId}-${index}`}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  alertsHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  alertTypeCount: {
    flexDirection: 'row',
    gap: 20,
  },
  countItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  countDotOut: {
    backgroundColor: '#EF4444',
  },
  countDotLow: {
    backgroundColor: '#F59E0B',
  },
  countText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  alertOut: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  alertLow: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FED7AA',
  },
  alertIcon: {
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertMessageOut: {
    color: '#991B1B',
  },
  alertMessageLow: {
    color: '#92400E',
  },
  alertDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  alertDetail: {
    fontSize: 12,
    color: '#6B7280',
  },
  alertAction: {
    marginLeft: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
