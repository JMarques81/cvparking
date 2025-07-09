import { StyleSheet, Text, View } from 'react-native';

export default function MapaFiscalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Mapa Fiscal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  texto: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
