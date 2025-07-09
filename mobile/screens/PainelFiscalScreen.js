
import { StyleSheet, Text, View } from 'react-native';

export default function PainelFiscal() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Painel do Fiscal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  texto: { fontSize: 24, fontWeight: 'bold' }
});
