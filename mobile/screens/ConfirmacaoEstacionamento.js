
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Alert, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../constants/api';

export default function ConfirmacaoEstacionamento() {
  const route = useRoute();
  const navigation = useNavigation();
  const { vaga, tempo, valor } = route.params || {};

  const handleConcluir = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.post(`${API_BASE_URL}/ocupacoes/iniciar`, {
        sensor_id: vaga.sensor_id,
        id_sensor: vaga.id_sensor,
        tempo_maximo: tempo,
        tipo_pagamento: 'pre-pago',
        valor_a_pagar: parseFloat(valor),
        matricula: 'ST-00-XX' // ou obter de AsyncStorage/campo futuro
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('✅ Ocupação iniciada:', response.data.ocupacao);

      Alert.alert('Sucesso', 'Estacionamento iniciado com sucesso.');
      navigation.navigate('Mapa');

    } catch (erro) {
      console.error('❌ Erro ao iniciar ocupação:', erro);
      Alert.alert('Erro', 'Não foi possível iniciar o estacionamento.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F2F5" />
      {vaga ? (
        <View style={styles.contentWrapper}>
          <View style={styles.iconContainer}>
            <Text style={styles.confirmationIcon}>✅</Text>
          </View>
          <Text style={styles.titulo}>Estacionamento Confirmado!</Text>
          <Text style={styles.subTitulo}>Seu veículo está agora estacionado.</Text>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📍 Vaga ID:</Text>
              <Text style={styles.detailValue}>{vaga.id_sensor}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🕒 Duração:</Text>
              <Text style={styles.detailValue}>{tempo} minutos</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>💰 Valor Pago:</Text>
              <Text style={styles.detailValue}>{valor} $</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.botaoConcluir} onPress={handleConcluir}>
            <Text style={styles.textoBotao}>Concluir e Voltar ao Mapa</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            ❌ Ops! Nenhuma vaga foi selecionada para confirmação.
          </Text>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => navigation.navigate('Mapa')}
          >
            <Text style={styles.textoBotarVoltar}>Voltar ao Mapa</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5', // Soft background color
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  contentWrapper: {
    padding: 25,
    width: '90%', // Make it responsive
    maxWidth: 400, // Limit width on larger screens
    backgroundColor: '#FFFFFF', // White background for the main content area
    borderRadius: 15, // More rounded corners
    shadowColor: '#000', // Subtle shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8, // Android elevation
    alignItems: 'center', // Center content within the wrapper
  },
  iconContainer: {
    backgroundColor: '#D4EDDA', // Light green background for the checkmark
    borderRadius: 50, // Makes it a circle
    padding: 20,
    marginBottom: 20,
    marginTop: -50, // Slightly lift it above the card for visual interest
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50', // Shadow matching the success theme
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  confirmationIcon: {
    fontSize: 48, // Larger icon
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50', // Darker, more professional text color
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitulo: {
    fontSize: 16,
    color: '#7F8C8D', // Muted text for secondary info
    marginBottom: 25,
    textAlign: 'center',
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#F8F9FA', // Slightly different background for details
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    borderLeftWidth: 5, // A subtle left border as an accent
    borderLeftColor: '#4CAF50', // Green accent color
  },
  detailRow: {
    flexDirection: 'row', // Align label and value horizontally
    justifyContent: 'space-between', // Space them out
    marginBottom: 8,
    paddingVertical: 3,
  },
  detailLabel: {
    fontSize: 16,
    color: '#34495E',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  botaoConcluir: {
    backgroundColor: '#0D6EFD', // Primary blue button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#0D6EFD', // Shadow for button
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 7,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F2F5',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  botaoVoltar: {
    backgroundColor: '#6C757D', // Muted gray for back button
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: '#6C757D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  textoBotarVoltar: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// export default function ConfirmacaoEstacionamento() {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { vaga, tempo, valor } = route.params || {};

//   const confirmarEstacionamento = () => {
//     Alert.alert('✅ Estacionamento iniciado', `Vaga: ${vaga?.id_sensor}\nTempo: ${tempo} min\nValor: ${valor}$00`);
//     navigation.navigate('Mapa'); // Volta ao mapa
//   };

//   return (
//     <View style={styles.container}>
//       {vaga ? (
//         <>
//           <Text style={styles.titulo}>🚗 Estacionamento Confirmado</Text>
//           <Text style={styles.info}>📍 Vaga: {vaga.id_sensor}</Text>
//           <Text style={styles.info}>🕒 Duração: {tempo} minutos</Text>
//           <Text style={styles.info}>💰 Valor pago: {valor}$00</Text>

//           <TouchableOpacity style={styles.botao} onPress={confirmarEstacionamento}>
//             <Text style={styles.textoBotao}>Concluir</Text>
//           </TouchableOpacity>
//         </>
//       ) : (
//         <Text style={styles.info}>❌ Nenhuma vaga foi selecionada.</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9'
//   },
//   titulo: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center'
//   },
//   info: {
//     fontSize: 16,
//     marginBottom: 10,
//     textAlign: 'center'
//   },
//   botao: {
//     marginTop: 30,
//     backgroundColor: '#0d6efd',
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     borderRadius: 10
//   },
//   textoBotao: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16
//   }
// });
