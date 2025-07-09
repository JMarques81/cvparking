import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert, // Para indicar carregamento
  KeyboardAvoidingView, // Para evitar que o teclado cubra os inputs
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { API_BASE_URL } from '../constants/api';

// import Logo from '../assets/logo.png'; // Arquivo de logo em assets
export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false); // Estado para o indicador de carregamento

  const fazerLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Ops!', 'Por favor, preencha seu email e senha para continuar.');
      return;
    }

    setLoading(true); // Ativa o indicador de carregamento

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password: senha
      });

      const { token, permissoes } = res.data;


      await AsyncStorage.setItem('token', token); // ⚠️ Aqui deve ser o token JWT (string)
      await AsyncStorage.setItem('permissoes', JSON.stringify(permissoes)); // lista


      onLoginSuccess(token, permissoes); // Chama a função de sucesso do login

    } catch (err) {
      console.error('Erro ao fazer login:', err);
      const msg = err.response?.data?.mensagem || 'Falha ao conectar. Verifique sua internet ou tente novamente mais tarde.';
      Alert.alert('Login Inválido', msg);
    } finally {
      setLoading(false); // Desativa o indicador de carregamento
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Adicionar um Logo ou Ícone para Branding */}
        {/* Se você tiver um logo, descomente e ajuste o caminho */}
        {/* <Image source={Logo} style={styles.logo} /> */}
        <Text style={styles.titulo}>Bem-vindo ao CVParking!</Text>
        <Text style={styles.subTitulo}>Faça login para gerenciar seu estacionamento.</Text>

        <TextInput
          placeholder="Seu Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999" // Cor do placeholder
        />

        <TextInput
          placeholder="Sua Senha"
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={styles.botao}
          onPress={fazerLogin}
          disabled={loading} // Desabilita o botão enquanto carrega
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBotao}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkTextContainer}>
          <Text style={styles.linkText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkTextContainer}>
          <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f5', // Um fundo claro para o app
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Centraliza os elementos horizontalmente
    paddingHorizontal: 30, // Mais padding nas laterais
  },
  // logo: {
  //   width: 120,
  //   height: 120,
  //   resizeMode: 'contain',
  //   marginBottom: 30,
  // },
  titulo: {
    fontSize: 28, // Maior e mais impactante
    fontWeight: 'bold',
    color: '#333', // Cor mais escura para o título
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitulo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40, // Mais espaço após o subtítulo
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 55, // Um pouco maior
    backgroundColor: '#fff',
    paddingHorizontal: 18, // Mais padding interno
    borderRadius: 12, // Bordas mais arredondadas
    marginBottom: 18, // Mais espaço entre inputs
    borderWidth: 1,
    borderColor: '#e0e0e0', // Borda mais suave
    fontSize: 16,
    shadowColor: '#000', // Sombra para profundidade
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3, // Sombra para Android
  },
  botao: {
    width: '100%',
    height: 55, // Mesmo tamanho do input
    backgroundColor: '#007AFF', // Azul mais vibrante (iOS Blue)
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20, // Espaço após o botão principal
    shadowColor: '#007AFF', // Sombra com a cor do botão
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18, // Texto maior
  },
  linkTextContainer: {
    marginTop: 15, // Espaço entre os links
  },
  linkText: {
    color: '#007AFF', // Mesma cor do botão para consistência
    fontSize: 15,
    textDecorationLine: 'underline', // Sublinhado para indicar que é um link
  },
});

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useState } from 'react';
// import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// export default function LoginScreen({ onLogin }) {
//   const [email, setEmail] = useState('');
//   const [senha, setSenha] = useState('');

//   const fazerLogin = async () => {
//     if (!email || !senha) {
//       Alert.alert('Campos obrigatórios', 'Por favor, preencha email e senha.');
//       return;
//     }

//     try {
//       const res = await axios.post('http://192.168.50.54:5000/auth/login', {
//         email,
//         password: senha
//       });

//       const { token, permissoes } = res.data;

//       await AsyncStorage.setItem('token', token);
//       await AsyncStorage.setItem('permissoes', JSON.stringify(permissoes));

//       onLogin(permissoes);

//     } catch (err) {
//       console.error('Erro ao fazer login:', err);
//       const msg = err.response?.data?.mensagem || 'Login inválido ou servidor offline.';
//       Alert.alert('Erro', msg);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.titulo}>CVParking - Login</Text>

//       <TextInput
//         placeholder="Email"
//         style={styles.input}
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <TextInput
//         placeholder="Senha"
//         style={styles.input}
//         value={senha}
//         onChangeText={setSenha}
//         secureTextEntry
//       />

//       <TouchableOpacity style={styles.botao} onPress={fazerLogin}>
//         <Text style={styles.textoBotao}>Entrar</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f5f5f5' },
//   titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
//   input: {
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 15,
//     borderColor: '#ccc',
//     borderWidth: 1
//   },
//   botao: {
//     backgroundColor: '#007BFF',
//     padding: 14,
//     borderRadius: 10,
//     alignItems: 'center'
//   },
//   textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
// });