import { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';

export default function Index() {
  const { isAuthenticated } = useApp();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)/');
    } else {
      router.replace('/auth/login');
    }
  }, [isAuthenticated]);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});