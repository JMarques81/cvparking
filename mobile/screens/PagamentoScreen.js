import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { API_BASE_URL } from '../constants/api';

export default function PagamentoScreen() {
  const [ocupacoesPorData, setOcupacoesPorData] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarOcupacoesPendentes();
  }, []);

  const agruparPorData = (ocupacoes) => {
    const hoje = moment().startOf('day');
    const ontem = moment().subtract(1, 'days').startOf('day');

    const grupos = {
      Hoje: [],
      Ontem: [],
      'Últimos 7 dias': [],
      'Mais antigos': []
    };

    ocupacoes.forEach((o) => {
      const inicio = moment(o.inicio_ocupacao);

      if (inicio.isSame(hoje, 'day')) {
        grupos.Hoje.push(o);
      } else if (inicio.isSame(ontem, 'day')) {
        grupos.Ontem.push(o);
      } else if (inicio.isAfter(moment().subtract(7, 'days'))) {
        grupos['Últimos 7 dias'].push(o);
      } else {
        grupos['Mais antigos'].push(o);
      }
    });

    const resultado = Object.entries(grupos)
      .filter(([_, items]) => items.length > 0)
      .map(([titulo, data]) => ({ titulo, data }));

    return resultado;
  };

  const buscarOcupacoesPendentes = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/ocupacoes/utilizador`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const pendentes = res.data.filter(o => !o.pagamento_realizado);
      const agrupadas = agruparPorData(pendentes);
      setOcupacoesPorData(agrupadas);
    } catch (err) {
      console.error('Erro ao buscar ocupações:', err.message);
    } finally {
      setCarregando(false);
    }
  };

  const confirmarPagamento = (id) => {
    Alert.alert(
      'Confirmar Pagamento',
      'Deseja efetuar o pagamento desta ocupação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Pagar', onPress: () => pagarOcupacao(id) }
      ]
    );
  };

  const pagarOcupacao = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/ocupacoes/${id}/pagar`, {
        metodo_pagamento: 'app'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('✅ Pagamento concluído');
      buscarOcupacoesPendentes();
    } catch (err) {
      console.error('Erro ao pagar:', err.message);
      Alert.alert('Erro ao processar pagamento');
    }
  };

  const renderItem = ({ item }) => {
    const inicio = new Date(item.inicio_ocupacao).toLocaleString();
    return (
      <View style={styles.card}>
        <Text style={styles.label}>Vaga: <Text style={styles.valor}>Vaga {item.id_sensor.replace('sensor_', '').padStart(2, '0')}</Text></Text>
        <Text style={styles.label}>Início: <Text style={styles.valor}>{inicio}</Text></Text>
        <Text style={styles.label}>Total a pagar: <Text style={styles.valor}>{item.valor_a_pagar} CVE</Text></Text>

        <TouchableOpacity style={styles.botao} onPress={() => confirmarPagamento(item._id)}>
          <Text style={styles.textoBotao}>Pagar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSecao = ({ item }) => (
    <View>
      <Text style={styles.secaoTitulo}>{item.titulo}</Text>
      <FlatList
        data={item.data}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </View>
  );

  if (carregando) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#0D6EFD" />;
  }

   return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0D6EFD" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pagamentos Pendentes</Text>
      </View>

      <View style={styles.container}>
        {ocupacoesPorData.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#555' }}>
            Nenhum pagamento pendente no momento.
          </Text>
        ) : (
          <FlatList
            data={ocupacoesPorData}
            keyExtractor={(item) => item.titulo}
            renderItem={renderSecao}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D6EFD',
  },
 header: {
    backgroundColor: '#0D6EFD',
    paddingTop: 50, // para alinhar bem abaixo da hora/rede
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F2F4F8',
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 34,
    marginBottom: 8,
    color: '#0D6EFD'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    elevation: 3,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  valor: {
    fontWeight: 'normal',
    color: '#444',
  },
  botao: {
    marginTop: 12,
    backgroundColor: '#0D6EFD',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});




// // 📁 /screens/PagamentoScreen.js
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert, FlatList, StyleSheet, Text, TouchableOpacity, View
// } from 'react-native';
// import { API_BASE_URL } from '../constants/api';

// export default function PagamentoScreen() {
//   const [ocupacoes, setOcupacoes] = useState([]);
//   const [carregando, setCarregando] = useState(true);

//   useEffect(() => {
//     buscarOcupacoesPendentes();
//   }, []);

//   const buscarOcupacoesPendentes = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const res = await axios.get(`${API_BASE_URL}/ocupacoes/utilizador`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const pendentes = res.data.filter(o => !o.pagamento_realizado);
//       setOcupacoes(pendentes);
//     } catch (err) {
//       console.error('Erro ao buscar ocupações:', err.message);
//     } finally {
//       setCarregando(false);
//     }
//   };

//   const confirmarPagamento = (id) => {
//     Alert.alert(
//       'Confirmar Pagamento',
//       'Deseja efetuar o pagamento desta ocupação?',
//       [
//         { text: 'Cancelar', style: 'cancel' },
//         { text: 'Pagar', onPress: () => pagarOcupacao(id) }
//       ]
//     );
//   };

//   const pagarOcupacao = async (id) => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       await axios.post(`${API_BASE_URL}/ocupacoes/${id}/pagar`, {
//         metodo_pagamento: 'app'
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       Alert.alert('✅ Pagamento concluído');
//       buscarOcupacoesPendentes(); // Atualiza lista
//     } catch (err) {
//       console.error('Erro ao pagar:', err.message);
//       Alert.alert('Erro ao processar pagamento');
//     }
//   };

//   const renderItem = ({ item }) => {
//     const inicio = new Date(item.inicio_ocupacao).toLocaleString();
//     return (
//       <View style={styles.card}>
//         <Text style={styles.label}>Vaga: <Text style={styles.valor}>{item.id_sensor}</Text></Text>
//         <Text style={styles.label}>Início: <Text style={styles.valor}>{inicio}</Text></Text>
//         <Text style={styles.label}>Total a pagar: <Text style={styles.valor}>{item.valor_a_pagar} CVE</Text></Text>

//         <TouchableOpacity style={styles.botao} onPress={() => confirmarPagamento(item._id)}>
//           <Text style={styles.textoBotao}>Pagar</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   if (carregando) {
//     return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#0D6EFD" />;
//   }

//   return (
//     <View style={styles.container}>
//       {ocupacoes.length === 0 ? (
//         <Text style={{ textAlign: 'center', marginTop: 20, color: '#555' }}>
//           Nenhum pagamento pendente no momento.
//         </Text>
//       ) : (
//         <FlatList
//           data={ocupacoes}
//           keyExtractor={(item) => item._id}
//           renderItem={renderItem}
//           contentContainerStyle={{ paddingBottom: 20 }}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#F2F4F8',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 14,
//     marginBottom: 16,
//     elevation: 3,
//   },
//   label: {
//     fontWeight: 'bold',
//     fontSize: 14,
//     marginBottom: 4,
//     color: '#333',
//   },
//   valor: {
//     fontWeight: 'normal',
//     color: '#444',
//   },
//   botao: {
//     marginTop: 12,
//     backgroundColor: '#0D6EFD',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   textoBotao: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 15,
//   },
// });



//2
// // 📁 screens/PagamentoScreen.js

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator, FlatList, StyleSheet,
//   Text, TouchableOpacity, View, Alert
// } from 'react-native';
// import { API_BASE_URL } from '../constants/api';

// export default function PagamentoScreen() {
//   const [ocupacoes, setOcupacoes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     buscarOcupacoes();
//   }, []);

//   const buscarOcupacoes = async () => {
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const res = await axios.get(`${API_BASE_URL}/ocupacoes/utilizador`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const ocupacoesNaoPagas = res.data.filter(o => !o.pagamento_realizado && o.fim_ocupacao);
//       setOcupacoes(ocupacoesNaoPagas);
//     } catch (err) {
//       console.error('Erro ao buscar ocupações para pagamento:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const pagarOcupacao = async (ocupacaoId) => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       await axios.put(`${API_BASE_URL}/ocupacoes/${ocupacaoId}/pagar`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       Alert.alert('✅ Sucesso', 'Pagamento efetuado com sucesso.');
//       buscarOcupacoes(); // atualiza a lista
//     } catch (err) {
//       console.error('Erro ao pagar:', err);
//       Alert.alert('Erro', 'Não foi possível efetuar o pagamento.');
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Text style={styles.label}>Sensor: {item.id_sensor}</Text>
//       <Text style={styles.label}>Valor: {item.valor_a_pagar} CVE</Text>
//       <TouchableOpacity
//         style={styles.botao}
//         onPress={() => pagarOcupacao(item._id)}
//       >
//         <Text style={styles.textoBotao}>Pagar</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0D6EFD" style={{ flex: 1 }} />;
//   }

//   if (ocupacoes.length === 0) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.label}>🎉 Sem pagamentos pendentes.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={ocupacoes}
//         keyExtractor={(item) => item._id}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#F8F9FB' },
//   card: {
//     backgroundColor: '#fff',
//     padding: 16,
//     marginBottom: 12,
//     borderRadius: 10,
//     elevation: 2
//   },
//   label: {
//     fontSize: 14,
//     marginBottom: 6,
//     color: '#333'
//   },
//   botao: {
//     backgroundColor: '#0D6EFD',
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 10
//   },
//   textoBotao: {
//     color: '#fff',
//     textAlign: 'center',
//     fontWeight: 'bold'
//   }
// });

// import { StyleSheet, Text, View } from 'react-native';

// export default function PagamentoScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.texto}>💳 Pagamento</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   texto: { fontSize: 24, fontWeight: 'bold' }
// });
