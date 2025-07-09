// eslint-disable-next-line no-unused-vars
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { API_BASE_URL } from '../constants/api';

export default function EstacionarScreen() {
  const [ocupacao, setOcupacao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    buscarOcupacaoAtiva();
  }, []);
//  useFocusEffect(
//     useCallback(() => {
//       buscarOcupacaoAtiva();
//     }, [])
//   );

  const buscarOcupacaoAtiva = async () => {
    setCarregando(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/ocupacoes/ativas`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.ocupacao) {
        setOcupacao(res.data.ocupacao);
      } else {
        setOcupacao(null);
      }
    } catch (error) {
      console.error('Erro ao buscar ocupação ativa:', error.message);
    } finally {
      setCarregando(false);
    }
  };
 
  if (carregando) {
    return <ActivityIndicator size="large" color="#0D6EFD" />;
  }

  // Sem ocupação ativa → pode iniciar nova
  if (!ocupacao) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>Não está estacionado atualmente.</Text>
        <Button title="Voltar ao mapa" onPress={() => navigation.navigate('Mapa')} />
      </View>
    );
  }

  // Verifica se tempo expirou
  const fim = moment(ocupacao.inicio_ocupacao).add(ocupacao.tempo_maximo, 'minutes');
  const expirado = moment().isAfter(fim);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🅿️ Estacionamento Atual</Text>
      <Text style={styles.label}>Vaga: {ocupacao.id_sensor}</Text>
      <Text style={styles.label}>Início: {moment(ocupacao.inicio_ocupacao).format('HH:mm')}</Text>
      <Text style={styles.label}>Tempo máximo: {ocupacao.tempo_maximo} min</Text>

      {expirado ? (
        <View style={styles.alertaBox}>
          <Text style={styles.alerta}>⚠️ Tempo expirado</Text>
          {ocupacao.em_infracao && (
            <>
              <Text style={styles.coima}>Coima: {ocupacao.valor_coima} CVE</Text>
              <Button title="Pagar agora" onPress={() => navigation.navigate('Pagamento')} />
            </>
          )}
          {!ocupacao.em_infracao && (
            <Text style={styles.label}>Aguardando processamento da coima...</Text>
          )}
        </View>
      ) : (
        <Text style={styles.estado}>⏳ Estacionamento ativo</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  texto: { fontSize: 18 },
  label: { fontSize: 16, marginBottom: 5 },
  estado: { marginTop: 15, fontSize: 16, color: 'green' },
  alertaBox: { marginTop: 20, backgroundColor: '#f8d7da', padding: 10, borderRadius: 10 },
  alerta: { fontSize: 18, color: '#842029', fontWeight: 'bold' },
  coima: { fontSize: 16, color: '#842029' },
});
