// screens/DashboardAdmin.js
import { StyleSheet, Text, View } from 'react-native';

export default function DashboardAdmin() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel Administrativo</Text>
      <Text style={styles.subtitle}>Bem-vindo ao painel da EMEP.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 8, color: 'gray' },
});
