
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


  const [matricula, setMatricula] = '';
useEffect(() => {
  // Recupera matrícula salva anteriormente (se existir)
  AsyncStorage.getItem('matricula').then((valor) => {
    if (valor) setMatricula(valor);
  });
}, []);
export default function EstacionarConfirmarScreen() {

  const route = useRoute();
  const navigation = useNavigation();
  const { vaga } = route.params || {};
console.log('📍 Vaga recebida:', vaga);
  const [duracaoSelecionada, setDuracaoSelecionada] = useState(null);
  const [duracaoManual, setDuracaoManual] = useState('');
  const precoPorMinuto = 1.33;

  const valoresPredefinidos = [15, 30, 60, 90, 120];

  useEffect(() => {
    if (duracaoSelecionada !== null) {
      setDuracaoManual('');
    }
  }, [duracaoSelecionada]);

  useEffect(() => {
    if (duracaoManual !== '') {
      setDuracaoSelecionada(null);
    }
  }, [duracaoManual]);

  const calcularValorTotal = useMemo(() => {
    const tempo = duracaoManual ? parseInt(duracaoManual) : duracaoSelecionada;
    if (isNaN(tempo) || tempo <= 0) {
      return 0;
    }
    return (tempo * precoPorMinuto).toFixed(2);
  }, [duracaoManual, duracaoSelecionada, precoPorMinuto]);

  const handleConfirmar = () => {
    const tempo = duracaoManual ? parseInt(duracaoManual) : duracaoSelecionada;

    if (!tempo || isNaN(tempo) || tempo <= 0) {
      Alert.alert('Erro', 'Por favor, selecione ou insira uma duração válida para o estacionamento.');
      return;
    }

    const valorFinal = calcularValorTotal;

    console.log('Navegando para ConfirmacaoEstacionamento com:', {
      vaga,
      tempo,
      valor: valorFinal,
    });

    navigation.navigate('ConfirmacaoEstacionamento', {
      vaga,
      tempo,
      valor: valorFinal,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          // ✨ Adiciona bounces={false} para iOS para evitar o "bounce" que revela o fundo
          bounces={Platform.OS === 'ios' ? false : true}
          // ✨ Adiciona alwaysBounceVertical={false} também para iOS
          alwaysBounceVertical={false}
          // ✨ Garante que o scroll indicador não se estenda para a área "vazia"
          showsVerticalScrollIndicator={true}
        >
          {vaga ? (
            <>
              <View style={styles.header}>
                <Text style={styles.titulo}>🅿️ Confirmar Estacionamento</Text>
                <Text style={styles.descricao}>Detalhes da Vaga:</Text>
                <View style={styles.detalhesVaga}>
                  <Text style={styles.labelVaga}>Vaga ID: <Text style={styles.valorVaga}>{vaga.id_sensor}</Text></Text>
                  <Text style={styles.labelVaga}>Localização: <Text style={styles.valorVaga}>{vaga.lat}, {vaga.lng}</Text></Text>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.subtitulo}>Selecione a Duração:</Text>
                <View style={styles.botoesContainer}>
                  {valoresPredefinidos.map((min) => (
                    <TouchableOpacity
                      key={min}
                      style={[
                        styles.botaoTempo,
                        duracaoSelecionada === min && styles.botaoTempoAtivo,
                      ]}
                      onPress={() => setDuracaoSelecionada(min)}
                    >
                      <Text style={[
                        styles.textoBotao,
                        duracaoSelecionada === min && styles.textoBotaoAtivo
                      ]}>
                        {min} min
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.separator} />

                <Text style={styles.ou}>Ou insira o tempo manualmente:</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Ex: 45 (minutos)"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={duracaoManual}
                  onChangeText={(text) => {
                    const numericText = text.replace(/[^0-9]/g, '');
                    setDuracaoManual(numericText);
                  }}
                />
              </View>

              <View style={styles.resumoPagamento}>
                <Text style={styles.totalLabel}>Total Estimado:</Text>
                <Text style={styles.totalValor}>{calcularValorTotal}$</Text>
                <Text style={styles.precoInfo}>({precoPorMinuto.toFixed(2)}$ por minuto)</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.botaoConfirmar,
                  (!duracaoSelecionada && !duracaoManual) && styles.botaoConfirmarDisabled,
                  // ✨ Adiciona um padding extra no fundo do botão para garantir que ele não fique colado
                  // Opcional, dependendo de como o layout se comporta com o teclado
                  // styles.botaoConfirmarBottomPadding
                ]}
                onPress={handleConfirmar}
                disabled={!duracaoSelecionada && !duracaoManual}
              >
                <Text style={styles.textoConfirmar}>Confirmar Pagamento</Text>
              </TouchableOpacity>
              {/* ✨ Adiciona um View vazio para preenchimento inferior */}
              <View style={styles.bottomSpacer} />
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhuma vaga foi selecionada.</Text>
              <TouchableOpacity
                style={styles.botaoVoltar}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.textoVoltar}>Voltar e Selecionar Vaga</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5', // Light gray background
  },
  scrollContent: {
    flexGrow: 1, // ✨ Permite que o conteúdo cresça e preencha o espaço
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    // Remover `justifyContent: 'center'` daqui se você quiser que o conteúdo
    // comece do topo e o espaçamento seja no final do scroll
    // justifyContent: 'center', // Pode remover ou manter dependendo do layout desejado
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50', // Darker text
    marginBottom: 10,
    textAlign: 'center',
  },
  descricao: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  detalhesVaga: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  labelVaga: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 5,
  },
  valorVaga: {
    fontWeight: 'bold',
    color: '#0D6EFD', // Primary blue
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 15,
    textAlign: 'center',
  },
  botoesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 8, // Using gap for spacing
  },
  botaoTempo: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#EAECEE', // Lighter gray for inactive
    borderRadius: 25, // More rounded for modern look
    borderWidth: 1,
    borderColor: '#D4D7DA',
    minWidth: 90, // Ensure buttons have a minimum width
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoTempoAtivo: {
    backgroundColor: '#0D6EFD', // Primary blue
    borderColor: '#0D6EFD',
    shadowColor: '#0D6EFD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  textoBotao: {
    color: '#34495E', // Darker text for inactive
    fontWeight: '600',
    fontSize: 15,
  },
  textoBotaoAtivo: {
    color: '#FFFFFF', // White text for active
  },
  separator: {
    height: 1,
    backgroundColor: '#EAECEE',
    marginVertical: 20,
  },
  ou: {
    textAlign: 'center',
    marginBottom: 15,
    color: '#7F8C8D', // Muted gray
    fontSize: 15,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D4D7DA',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    color: '#34495E',
  },
  resumoPagamento: {
    backgroundColor: '#E8F5E9', // Light green for summary
    borderRadius: 12,
    padding: 20,
    marginBottom: 30, // ✨ Mantém um bom espaçamento antes do botão
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50', // Green border for emphasis
  },
  totalLabel: {
    fontSize: 18,
    color: '#28B463', // Darker green
    marginBottom: 5,
    fontWeight: 'bold',
  },
  totalValor: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#28B463',
    marginBottom: 5,
  },
  precoInfo: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  botaoConfirmar: {
    backgroundColor: '#0D6EFD', // Primary blue
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0D6EFD',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    // marginBottom: 20, // ✨ Removido para usar o bottomSpacer
  },
  textoConfirmar: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Disabled state for the confirm button
  botaoConfirmarDisabled: {
    backgroundColor: '#AAB7B8', // Grey out when disabled
    shadowColor: 'transparent',
    elevation: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  botaoVoltar: {
    backgroundColor: '#0D6EFD', // Muted gray for back button
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  textoVoltar: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // ✨ Novo estilo para o espaçador inferior
  bottomSpacer: {
    height: 50, // Ajuste este valor conforme necessário para o espaço desejado
    backgroundColor: 'transparent', // Para que o fundo da ScrollView seja visível
  },
});
// // 📁 /screens/EstacionarConfirmarScreen.js
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { useState } from 'react';
// import {
//   Alert,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function EstacionarConfirmarScreen() {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { vaga } = route.params || {};

//   const [duracao, setDuracao] = useState(null); // minutos
//   const [manual, setManual] = useState('');
//   const precoPorMinuto = 1.33;

//   const valoresPredefinidos = [15, 30, 60, 90, 120];

//   const selecionarDuracao = (min) => {
//     setDuracao(min);
//     setManual('');
//   };

//   const confirmar = () => {
//     const tempo = manual ? parseInt(manual) : duracao;

//     if (!tempo || isNaN(tempo) || tempo <= 0) {
//       Alert.alert('Erro', 'Por favor, selecione ou insira uma duração válida.');
//       return;
//     }

//     const valor = (tempo * precoPorMinuto).toFixed(2);

//     Alert.alert(
//       'Pagamento Simulado',
//       `✅ Estacionamento de ${tempo} minutos\n💵 Total: ${valor}$00`
//     );

//     // Navega para tela de confirmação final
//     navigation.navigate('ConfirmacaoEstacionamento', {
//       vaga, tempo, valor
//     });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {vaga ? (
//         <>
//           <Text style={styles.titulo}>🅿️ Confirmar Estacionamento</Text>
//           <Text style={styles.label}>Vaga: {vaga.id_sensor}</Text>
//           <Text style={styles.label}>Localização: {vaga.lat}, {vaga.lng}</Text>

//           <Text style={styles.subtitulo}>Escolher duração:</Text>
//           <View style={styles.botoes}>
//             {valoresPredefinidos.map((min) => (
//               <TouchableOpacity
//                 key={min}
//                 style={[styles.botaoTempo, duracao === min && styles.botaoAtivo]}
//                 onPress={() => selecionarDuracao(min)}
//               >
//                 <Text style={styles.textoBotao}>{min} min</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <Text style={styles.ou}>ou</Text>

//           <TextInput
//             style={styles.input}
//             placeholder="Tempo personalizado (min)"
//             keyboardType="numeric"
//             value={manual}
//             onChangeText={(text) => {
//               setManual(text);
//               setDuracao(null); // desativa seleção automática
//             }}
//           />

//           <Text style={styles.total}>
//             Total: {((manual ? manual : duracao) * precoPorMinuto || 0).toFixed(2)}$00
//           </Text>

//           <TouchableOpacity style={styles.botaoConfirmar} onPress={confirmar}>
//             <Text style={styles.textoConfirmar}>Confirmar Pagamento</Text>
//           </TouchableOpacity>
//         </>
//       ) : (
//         <Text style={styles.label}>Nenhuma vaga selecionada.</Text>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     paddingTop: Platform.OS === 'android' ? 30 : 0,
//     backgroundColor: '#f9f9f9',
//     justifyContent: 'center'
//   },
//   titulo: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center'
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 10,
//     textAlign: 'center'
//   },
//   subtitulo: {
//     fontSize: 18,
//     fontWeight: '500',
//     marginBottom: 10
//   },
//   botoes: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     gap: 10,
//     marginBottom: 15
//   },
//   botaoTempo: {
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 10,
//     margin: 5
//   },
//   botaoAtivo: {
//     backgroundColor: '#0d6efd'
//   },
//   textoBotao: {
//     color: 'white',
//     fontWeight: 'bold'
//   },
//   ou: {
//     textAlign: 'center',
//     marginVertical: 10,
//     color: '#555'
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 10,
//     fontSize: 16,
//     backgroundColor: 'white',
//     textAlign: 'center'
//   },
//   total: {
//     marginTop: 20,
//     fontSize: 18,
//     textAlign: 'center',
//     fontWeight: 'bold',
//     color: '#1e88e5'
//   },
//   botaoConfirmar: {
//     marginTop: 30,
//     backgroundColor: '#062863',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center'
//   },
//   textoConfirmar: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold'
//   }
// });
