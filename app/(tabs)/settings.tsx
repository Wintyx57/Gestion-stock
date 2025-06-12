import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Switch } from 'react-native';
import { Settings as SettingsIcon, LogOut, User, Building, Mail, Bell } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function SettingsScreen() {
  const { settings, updateSettings, logout, userEmail } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Paramètres</Text>
          <Text style={styles.subtitle}>Configuration de l'application</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Profil</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Email</Text>
            <TextInput
              style={[styles.settingInput, styles.readOnlyInput]}
              value={userEmail}
              editable={false}
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.settingNote}>Connecté avec: {userEmail}</Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Nom entreprise</Text>
            <TextInput
              style={styles.settingInput}
              value={settings.companyName}
              onChangeText={(value) => updateSettings({ companyName: value })}
              placeholder="Nom de votre magasin"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SettingsIcon size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>Stock</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Seuil d'alerte par défaut</Text>
            <TextInput
              style={styles.settingInput}
              value={settings.autoExportThreshold.toString()}
              onChangeText={(value) => updateSettings({ autoExportThreshold: parseInt(value) || 5 })}
              keyboardType="numeric"
              placeholder="5"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.settingNote}>Nombre minimum d'unités avant alerte</Text>
          </View>

          <View style={styles.switchItem}>
            <View style={styles.switchContent}>
              <Text style={styles.settingLabel}>Scanner code-barres</Text>
              <Text style={styles.settingNote}>Activer le scanner intégré</Text>
            </View>
            <Switch
              value={settings.enableBarcodeScanner}
              onValueChange={(value) => updateSettings({ enableBarcodeScanner: value })}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor={settings.enableBarcodeScanner ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications email</Text>
            <View style={styles.pickerContainer}>
              {['none', 'daily', 'weekly', 'critical'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.pickerOption,
                    settings.emailNotifications === option && styles.pickerOptionSelected
                  ]}
                  onPress={() => updateSettings({ emailNotifications: option })}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    settings.emailNotifications === option && styles.pickerOptionTextSelected
                  ]}>
                    {option === 'none' && 'Désactivées'}
                    {option === 'daily' && 'Quotidien'}
                    {option === 'weekly' && 'Hebdomadaire'}
                    {option === 'critical' && 'Urgences'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Mail size={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Synchronisation</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>🔄 Synchronisation cloud</Text>
            <Text style={styles.infoText}>
              Vos données sont automatiquement synchronisées entre tous vos appareils connectés avec {userEmail}
            </Text>
            <View style={styles.syncStatus}>
              <View style={styles.syncDot} />
              <Text style={styles.syncText}>Synchronisation active</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.warningCard}>
            <Text style={styles.warningTitle}>📱 Version complète - Fonctionnalités</Text>
            <View style={styles.featureList}>
              <Text style={styles.featureItem}>✅ Synchronisation automatique multi-appareils</Text>
              <Text style={styles.featureItem}>✅ Sauvegarde cloud sécurisée</Text>
              <Text style={styles.featureItem}>✅ Envoi automatique des commandes par email</Text>
              <Text style={styles.featureItem}>✅ Notifications push pour alertes critiques</Text>
              <Text style={styles.featureItem}>✅ Mode hors-ligne avec sync différée</Text>
              <Text style={styles.featureItem}>✅ Rapports et statistiques avancées</Text>
              <Text style={styles.featureItem}>✅ Support prioritaire 7j/7</Text>
            </View>
            <Text style={styles.warningNote}>
              💡 Cette version de démonstration stocke les données localement pendant votre session uniquement.
            </Text>
          </View>
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <LogOut size={20} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
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
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  settingInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1F2937',
  },
  readOnlyInput: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  settingNote: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  switchItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  switchContent: {
    flex: 1,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  pickerOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  pickerOptionTextSelected: {
    color: '#FFFFFF',
  },
  infoCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0369A1',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#0C4A6E',
    marginBottom: 12,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  syncText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  warningCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 12,
  },
  featureList: {
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 12,
    color: '#92400E',
    marginBottom: 4,
  },
  warningNote: {
    fontSize: 12,
    color: '#A16207',
    fontWeight: '500',
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
