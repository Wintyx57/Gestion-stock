import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Package, FileSpreadsheet, AlertTriangle, TrendingUp, Upload, Download } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { router } from 'expo-router';

export default function DashboardScreen() {
  const { products, alerts, settings, loadSampleData, showToast } = useApp();

  const stats = {
    totalProducts: products.length,
    initializedProducts: products.filter(p => p.stockInitialized).length,
    totalValue: products.filter(p => p.stockInitialized).reduce((sum, p) => sum + (p.currentStock * (p.price || 0)), 0),
    lowStock: products.filter(p => p.stockInitialized && p.currentStock <= p.alertThreshold && p.currentStock > 0).length,
    outOfStock: products.filter(p => p.stockInitialized && p.currentStock === 0).length
  };

  const StatCard = ({ title, value, icon: Icon, colors }: { title: string; value: string | number; icon: any; colors: [string, string, ...string[]] }) => (
    <View style={styles.statCard}>
      <LinearGradient colors={colors} style={styles.statGradient}>
        <View style={styles.statContent}>
          <View style={styles.statInfo}>
            <Text style={styles.statTitle}>{title}</Text>
            <Text style={styles.statValue}>{value}</Text>
          </View>
          <View style={styles.statIcon}>
            <Icon size={28} color="#FFFFFF" />
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Tableau de bord</Text>
          <Text style={styles.subtitle}>Vue d'ensemble de votre stock</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Total Produits"
            value={stats.totalProducts}
            icon={Package}
            colors={['#3B82F6', '#1D4ED8']}
          />
          <StatCard
            title="Valeur Stock"
            value={`${stats.totalValue.toFixed(0)}€`}
            icon={FileSpreadsheet}
            colors={['#10B981', '#047857']}
          />
          <StatCard
            title="Stock Faible"
            value={stats.lowStock}
            icon={AlertTriangle}
            colors={['#F59E0B', '#D97706']}
          />
          <StatCard
            title="Ruptures"
            value={stats.outOfStock}
            icon={AlertTriangle}
            colors={['#EF4444', '#DC2626']}
          />
        </View>

        {products.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Package size={64} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>🚀 Démarrez votre gestion !</Text>
            <Text style={styles.emptyDescription}>
              Importez votre catalogue ou testez avec des exemples
            </Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/import')}>
                <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.buttonGradient}>
                  <Upload size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>📁 Importer Catalogue</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryButton} onPress={loadSampleData}>
                <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.buttonGradient}>
                  <FileSpreadsheet size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>🎯 Tester l'App</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {alerts.length > 0 && (
              <View style={styles.alertsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>🚨 Alertes Récentes</Text>
                  <TouchableOpacity onPress={() => router.push('/(tabs)/alerts')}>
                    <Text style={styles.viewAllText}>Voir tout</Text>
                  </TouchableOpacity>
                </View>
                
                {alerts.slice(0, 3).map((alert, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={[styles.alertCard, alert.type === 'out' ? styles.alertOut : styles.alertLow]}
                    onPress={() => router.push('/(tabs)/products')}
                  >
                    <AlertTriangle size={20} color={alert.type === 'out' ? '#EF4444' : '#F59E0B'} />
                    <Text style={[styles.alertText, alert.type === 'out' ? styles.alertTextOut : styles.alertTextLow]}>
                      {alert.message}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.quickActions}>
              <Text style={styles.sectionTitle}>⚡ Actions Rapides</Text>
              <View style={styles.actionsGrid}>
                <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/products')}>
                  <Package size={24} color="#3B82F6" />
                  <Text style={styles.actionText}>Gérer Produits</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/stock-init')}>
                  <TrendingUp size={24} color="#10B981" />
                  <Text style={styles.actionText}>Saisir Stocks</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionCard} onPress={() => showToast('📊 Export en cours...', 'info')}>
                  <Download size={24} color="#8B5CF6" />
                  <Text style={styles.actionText}>Exporter</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/scanner')}>
                  <Package size={24} color="#F59E0B" />
                  <Text style={styles.actionText}>Scanner</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    marginRight: '2%',
  },
  statGradient: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
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
  actionButtons: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  alertsSection: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  alertOut: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
  },
  alertLow: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FED7AA',
    borderWidth: 1,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  alertTextOut: {
    color: '#991B1B',
  },
  alertTextLow: {
    color: '#92400E',
  },
  quickActions: {
    margin: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
});
