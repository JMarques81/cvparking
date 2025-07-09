import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { API_BASE_URL } from '../constants/api';

const formatarData = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleString('pt-CV', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Atlantic/Cape_Verde',
  });
};

const agruparPorData = (ocupacoes) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const ontem = new Date(hoje);
  ontem.setDate(hoje.getDate() - 1);

  const seteDiasAtras = new Date(hoje);
  seteDiasAtras.setDate(hoje.getDate() - 6);

  const sortedOcupacoes = [...ocupacoes].sort((a, b) => new Date(b.inicio_ocupacao) - new Date(a.inicio_ocupacao));

  const grupos = {
    'Hoje': [],
    'Ontem': [],
    'Últimos 7 dias': [],
    'Mais antigos': [],
  };

  sortedOcupacoes.forEach((item) => {
    const inicio = new Date(item.inicio_ocupacao);
    inicio.setHours(0, 0, 0, 0);

    if (inicio.getTime() === hoje.getTime()) {
      grupos['Hoje'].push(item);
    } else if (inicio.getTime() === ontem.getTime()) {
      grupos['Ontem'].push(item);
    } else if (inicio >= seteDiasAtras && inicio < ontem) {
      grupos['Últimos 7 dias'].push(item);
    } else {
      grupos['Mais antigos'].push(item);
    }
  });

  const sectionsOrder = ['Hoje', 'Ontem', 'Últimos 7 dias', 'Mais antigos'];
  return sectionsOrder
    .map(title => ({
      title: title,
      data: grupos[title],
    }))
    .filter(section => section.data.length > 0);
};

export default function HistoricoScreen() {
  const [ocupacoes, setOcupacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const buscarHistorico = useCallback(async () => {
    setErro(null);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setErro('Utilizador não autenticado. Faça login para ver o histórico.');
        setOcupacoes([]);
        return;
      }
      const res = await axios.get(`${API_BASE_URL}/ocupacoes/utilizador`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOcupacoes(res.data);
    } catch (err) {
      console.error('Erro ao buscar histórico:', err.response?.data || err.message);
      setErro('Não foi possível carregar o histórico. Verifique sua conexão e tente novamente.');
      setOcupacoes([]);
    } finally {
      setCarregando(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    buscarHistorico();
  }, [buscarHistorico]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    buscarHistorico();
  }, [buscarHistorico]);

  const renderItem = ({ item }) => {
    const inicio = formatarData(item.inicio_ocupacao);
    const fim = item.fim_ocupacao ? formatarData(item.fim_ocupacao) : 'Em andamento';
    const statusColor = item.fim_ocupacao
      ? (item.pagamento_realizado
        ? '#198754'
        : (item.em_infracao ? '#dc3545' : '#ffc107')
      )
      : '#0d6efd';

    const statusText = item.fim_ocupacao
      ? (item.pagamento_realizado
        ? 'Finalizado'
        : (item.em_infracao ? 'Infração' : 'Não Pago')
      )
      : 'Em Curso';

    return (
      <View style={[styles.itemCard, { borderLeftColor: statusColor }]}>
        <View style={styles.cardHeader}>
          <View style={styles.vagaTitleContainer}>
            <FontAwesome5 name="parking" size={20} color="#343A40" style={styles.detailIcon} />
            <Text style={styles.cardTitle}>{item.id_sensor.replace('sensor_', 'Vaga ')}</Text>
          </View>
          <Text style={[styles.statusBadge, { backgroundColor: statusColor }]}>{statusText}</Text>
        </View>

        {item.matricula && (
          <View style={styles.detailRow}>
            <FontAwesome5 name="car" size={14} color="#6c757d" style={styles.detailIcon} />
            <Text style={styles.detailText}>Matrícula: {item.matricula}</Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <FontAwesome5 name="hourglass-start" size={14} color="#6c757d" style={styles.detailIcon} />
          <Text style={styles.detailText}>Início: {inicio}</Text>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome5 name="hourglass-end" size={14} color="#6c757d" style={styles.detailIcon} />
          <Text style={styles.detailText}>Fim: {fim}</Text>
        </View>

        {item.fim_ocupacao && (
          <View style={styles.detailRow}>
            <FontAwesome5 name="stopwatch" size={14} color="#6c757d" style={styles.detailIcon} />
            <Text style={styles.detailText}>Duração: {Math.round((new Date(item.fim_ocupacao) - new Date(item.inicio_ocupacao)) / (1000 * 60))} min</Text>
          </View>
        )}

        {item.valor_a_pagar > 0 && item.pagamento_realizado && (
          <View style={styles.detailRow}>
            <FontAwesome5 name="money-bill-wave" size={14} color="#28a745" style={styles.detailIcon} />
            <Text style={styles.detailText}>Valor Pago: CVE {item.valor_a_pagar.toFixed(2)}</Text>
          </View>
        )}

        {item.valor_a_pagar > 0 && !item.pagamento_realizado && item.tipo_pagamento === 'pos-pago' && (
          <View style={styles.detailRow}>
            <FontAwesome5 name="money-check-alt" size={14} color="#fd7e14" style={styles.detailIcon} />
            <Text style={styles.detailText}>A Pagar: CVE {item.valor_a_pagar.toFixed(2)}</Text>
          </View>
        )}

        {item.coima_aplicada && (
          <View style={styles.fineSection}>
            <FontAwesome5 name="gavel" size={16} color="#dc3545" style={styles.detailIcon} />
            <Text style={styles.fineText}>Coima Aplicada: CVE {item.valor_coima.toFixed(2)}</Text>
            <Text style={styles.fineDetailText}>Motivo: {item.observacoes || 'Tempo máximo excedido'}</Text>
            {item.aplicada_por && (
              <Text style={styles.fineDetailText}>Aplicada por: {item.aplicada_por}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const seções = agruparPorData(ocupacoes);

  if (carregando) {
    return (
      <View style={styles.fullScreenCenter}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando histórico...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.fullScreenCenter}>
        <FontAwesome5 name="exclamation-circle" size={40} color="#dc3545" />
        <Text style={styles.errorText}>{erro}</Text>
        <Text style={styles.pullToRefreshHint}>Puxe para baixo para tentar novamente.</Text>
      </View>
    );
  }

  if (ocupacoes.length === 0) {
    return (
      <View style={styles.fullScreenCenter}>
        <FontAwesome5 name="history" size={50} color="#6c757d" />
        <Text style={styles.emptyText}>Nenhuma sessão de estacionamento encontrada.</Text>
        <Text style={styles.emptyHint}>Quando estacionares, verás as informações aqui!</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F2F2' }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico de Estacionamentos</Text>
      </View>

      <SectionList
        sections={seções}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.sectionHeader, title === 'Hoje' && styles.sectionHeaderToday]}>
            {title}
          </Text>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#0D6EFD"]}
            tintColor="#0D6EFD"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
 
  header: {
    backgroundColor: '#0D6EFD',
    paddingTop: 50, // para alinhar bem abaixo da hora/rede
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // headerTitle: {
  //   color: '#fff',
  //   fontSize: 20,
  //   fontWeight: 'bold',
  // },


  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#343A40',
    textAlign: 'center',
    paddingVertical: 25,
    marginBottom: 5,
    //shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    //shadowRadius: 2,
    elevation: 2,
    backgroundColor: '#F2F2F2',
    // borderBottomWidth: StyleSheet.hairlineWidth, // Adiciona uma borda inferior para separação
    borderBottomColor: '#DEE2E6', // Cor da borda
  },
  sectionHeader: {
    fontSize: 16, // Um pouco menor
    fontWeight: '600', // Menos bold, mais "subtle"
    color: '#495057',
    // backgroundColor: '#EAEAEA', // <-- REMOVIDO: Fundo transparente
    paddingVertical: 8, // Menos padding vertical
    paddingHorizontal: 20,
    // borderBottomWidth: StyleSheet.hairlineWidth, // Linha fina na parte inferior da seção
    borderBottomColor: '#dee2e6',
    // textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5, // Espaço abaixo do cabeçalho da seção
    marginTop: 15, // Espaço acima da seção para separá-la da anterior
  },
  sectionHeaderToday: {
    backgroundColor: 'transparent', // Garante que "Hoje" também seja transparente
    color: '#007bff', // Uma cor de destaque diferente para "Hoje", talvez o azul primário
    fontWeight: '700', // Um pouco mais bold que o padrão
    // borderBottomWidth: 1.5,
    borderColor: '#007bff', // Borda azul para "Hoje"
    fontSize: 16
  },
  listContent: {
    paddingTop: 0, // Ajusta padding superior para não ter espaço extra
    paddingBottom: 20,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 18,
    marginBottom: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 6,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  vagaTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginLeft: 8,
  },
  statusBadge: {
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    width: 24,
    textAlign: 'center',
    marginRight: 10,
  },
  detailText: {
    fontSize: 15,
    color: '#495057',
    flexShrink: 1,
  },
  fineSection: {
    marginTop: 15,
    backgroundColor: '#fff3cd',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ffc107',
    flexDirection: 'column',
  },
  fineText: {
    fontWeight: 'bold',
    color: '#dc3545',
    fontSize: 15,
    marginBottom: 4,
    marginLeft: 30,
  },
  fineDetailText: {
    color: '#6c757d',
    fontSize: 13,
    marginLeft: 30,
    marginBottom: 2,
  },
  fullScreenCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 5,
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  pullToRefreshHint: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 10,
  },
});


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#F8F9FB',
//   },
//   item: {
//     backgroundColor: '#fff',
//     padding: 14,
//     marginBottom: 12,
//     borderRadius: 10,
//     elevation: 2,
//   },
//   label: {
//     fontWeight: 'bold',
//     fontSize: 14,
//     color: '#222',
//   },
//   valor: {
//     fontSize: 14,
//     marginBottom: 6,
//     color: '#444',
//   },
//   coima: {
//     fontSize: 14,
//     marginTop: 6,
//     color: '#C0392B',
//   },
// });


// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';

// export default function HistoricoScreen() {
//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchHistorico();
//   }, []);

//   const fetchHistorico = async () => {
//     try {
//       const res = await axios.get('http://192.168.50.191:5000/ocupacoes/historico'); // Ajusta para a tua rota
//       setSessions(res.data);
//     } catch (error) {
//       console.error('Erro ao buscar histórico:', error);
//       Alert.alert('Erro', 'Não foi possível carregar o histórico.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderItem = ({ item }) => {
//     // Supondo que item tem { id, id_sensor, matricula, inicio, fim, custo }
//     const inicio = new Date(item.inicio).toLocaleString();
//     const fim = item.fim ? new Date(item.fim).toLocaleString() : 'Em curso';
//     return (
//       <View style={styles.itemContainer}>
//         <Text style={styles.slot}>Vaga: {item.id_sensor}</Text>
//         <Text style={styles.time}>Início: {inicio}</Text>
//         <Text style={styles.time}>Fim: {fim}</Text>
//         {item.custo != null && <Text style={styles.cost}>Custo: R$ {item.custo.toFixed(2)}</Text>}
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007BFF" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {sessions.length ? (
//         <FlatList
//           data={sessions}
//           keyExtractor={(item) => item._id || item.id.toString()}
//           renderItem={renderItem}
//           contentContainerStyle={styles.list}
//         />
//       ) : (
//         <Text style={styles.emptyText}>Nenhuma sessão de estacionamento encontrada.</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   list: { padding: 20 },
//   itemContainer: { marginBottom: 20, padding: 15, borderRadius: 8, backgroundColor: '#f1f1f1' },
//   slot: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
//   time: { fontSize: 14, marginBottom: 3, color: '#555' },
//   cost: { fontSize: 14, fontWeight: 'bold', color: '#007BFF' },
//   emptyText: { flex: 1, textAlign: 'center', marginTop: 50, color: '#555', fontSize: 16 }
// });
