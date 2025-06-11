import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Picker } from '@react-native-picker/picker';
import { useApp } from '@/contexts/AppContext';
import { ImportData, ColumnMapping, Product } from '@/types';

const fields = [
  { key: 'ean', label: 'EAN' },
  { key: 'name', label: 'Nom' },
  { key: 'supplier', label: 'Fournisseur' },
  { key: 'price', label: 'Prix' },
  { key: 'quantity', label: 'Quantité' },
  { key: 'unit', label: 'Unité' },
  { key: 'category', label: 'Catégorie' },
  { key: 'animal', label: 'Animal' },
  { key: 'brand', label: 'Marque' },
  { key: 'location', label: 'Emplacement' },
  { key: 'reference', label: 'Référence' },
  { key: 'description', label: 'Description' },
];

const parseCSV = (content: string): ImportData => {
  const lines = content.trim().split(/\r?\n/);
  const delimiter = lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(delimiter).map(h => h.trim());
  const rows = lines.slice(1).map(line => line.split(delimiter).map(cell => cell.trim()));
  return { headers, rows };
};

export default function ImportScreen() {
  const { addProducts, showToast } = useApp();
  const [data, setData] = useState<ImportData | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping>({});

  const selectFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
    if (result.canceled || !result.assets?.length) return;
    const fileUri = result.assets[0].uri;
    const content = await FileSystem.readAsStringAsync(fileUri, { encoding: 'utf8' });
    const parsed = parseCSV(content);
    setData(parsed);
    setMapping({});
  };

  const getValue = (key: string, row: string[]) => {
    const index = mapping[key];
    return index !== undefined ? row[index] : '';
  };

  const getNumber = (key: string, row: string[]) => {
    const value = getValue(key, row);
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  };

  const handleImport = () => {
    if (!data) return;
    const products: Product[] = data.rows.map((row, idx) => ({
      id: Date.now() + idx,
      supplier: getValue('supplier', row) || 'Autre',
      ean: getValue('ean', row) || '',
      name: getValue('name', row) || '',
      reference: getValue('reference', row) || undefined,
      description: getValue('description', row) || undefined,
      price: getNumber('price', row),
      quantity: getValue('quantity', row) || undefined,
      unit: getValue('unit', row) || undefined,
      category: getValue('category', row) || undefined,
      animal: getValue('animal', row) || undefined,
      brand: getValue('brand', row) || undefined,
      location: getValue('location', row) || undefined,
      currentStock: 0,
      alertThreshold: 5,
      movements: [],
      stockInitialized: false,
      createdAt: new Date().toISOString(),
    }));
    addProducts(products);
    showToast(`✅ ${products.length} produits importés !`, 'success');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Importer un fichier CSV</Text>
      <TouchableOpacity style={styles.button} onPress={selectFile}>
        <Text style={styles.buttonText}>Sélectionner un fichier</Text>
      </TouchableOpacity>

      {data && (
        <>
          <Text style={styles.subtitle}>Associer les colonnes</Text>
          {fields.map(field => (
            <View key={field.key} style={styles.mappingRow}>
              <Text style={styles.mappingLabel}>{field.label}</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={mapping[field.key]}
                  onValueChange={value => setMapping(prev => ({ ...prev, [field.key]: value }))}
                >
                  <Picker.Item label="--" value={undefined} />
                  {data.headers.map((h, i) => (
                    <Picker.Item key={i} label={h} value={i} />
                  ))}
                </Picker>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.importButton} onPress={handleImport}>
            <Text style={styles.importButtonText}>Importer</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1F2937', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginVertical: 12 },
  button: { backgroundColor: '#3B82F6', padding: 12, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  mappingRow: { marginBottom: 12 },
  mappingLabel: { marginBottom: 4, color: '#374151', fontSize: 14 },
  pickerWrapper: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, backgroundColor: '#FFFFFF' },
  importButton: { marginTop: 20, backgroundColor: '#10B981', padding: 12, borderRadius: 12, alignItems: 'center' },
  importButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

