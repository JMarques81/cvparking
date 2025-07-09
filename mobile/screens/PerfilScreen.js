
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para limpar o token
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PerfilScreen({ onLogout }) { // Garanta que 'onLogout' é recebido aqui

  const handleLogout = async () => {
    Alert.alert(
      "Terminar Sessão",
      "Tem a certeza que quer terminar a sua sessão?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sim, Sair",
          onPress: async () => {
            try {
              // Remover o token e permissões do AsyncStorage
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('permissoes');
              console.log('Token e permissões removidos.');
              // Chamar a função onLogout passada pelo AppNavigatorDinamico
              if (onLogout) {
                onLogout();
              }
            } catch (e) {
              console.error("Erro ao remover dados do AsyncStorage:", e);
              Alert.alert("Erro", "Não foi possível terminar a sessão completamente.");
            }
          },
          style: "destructive" // Estilo de botão para ação destrutiva
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      <Text style={styles.infoText}>Aqui você pode ver e gerenciar suas informações de perfil.</Text>

      {/* Exemplo de um botão de Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Terminar Sessão</Text>
      </TouchableOpacity>

      {/* Você pode adicionar mais informações do perfil aqui */}
      {/* <Text style={styles.infoText}>Email: usuario@example.com</Text> */}
      {/* <Text style={styles.infoText}>Placa: ABC-1234</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#dc3545', // Vermelho para "sair"
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 40,
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


// import { Ionicons } from '@expo/vector-icons';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// export default function PerfilScreen({ onLogout }) {
//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Ionicons name="person-circle-outline" size={100} color="#007bff" />
//         <Text style={styles.nome}>Bem-vindo ao CVParking</Text>
//         <Text style={styles.email}>Utilizador Público</Text>
//       </View>

//       <View style={styles.separador} />

//       <TouchableOpacity style={styles.botaoLogout} onPress={onLogout}>
//         <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
//         <Text style={styles.textoBotao}>Terminar Sessão</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9', alignItems: 'center' },
//   header: { alignItems: 'center', marginTop: 40 },
//   nome: { fontSize: 20, fontWeight: '600', marginTop: 10 },
//   email: { fontSize: 16, color: '#666' },
//   separador: {
//     height: 1,
//     backgroundColor: '#ddd',
//     width: '80%',
//     marginVertical: 30
//   },
//   botaoLogout: {
//     flexDirection: 'row',
//     backgroundColor: '#dc3545',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 8,
//     alignItems: 'center'
//   },
//   textoBotao: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold'
//   }
// });
