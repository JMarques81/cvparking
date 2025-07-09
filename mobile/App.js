// ✅ App.js COMPLETO E CORRIGIDO
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import AppNavigatorDinamico from './AppNavigatorDinamico';
import LoginScreen from './screens/LoginScreen';

export default function App() {
  const [permissoes, setPermissoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
         console.log('🎯 token:', token);
        const permissoesSalvas = await AsyncStorage.getItem('permissoes');

        if (token && permissoesSalvas) {
          const listaPermissoes = JSON.parse(permissoesSalvas);
          console.log('🎯 Permissões carregadas:', listaPermissoes);
          setPermissoes(listaPermissoes);
        }
      } catch (e) {
        console.error("Erro ao carregar permissões:", e);
      } finally {
        setLoading(false);
      }
    };

    verificarToken();
  }, []);

  const handleLoginSuccess = async (token, permissoesRecebidas) => {
    console.log('🔑 Token recebido:', token);
    console.log('📚 Permissões recebidas:', permissoesRecebidas);
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('permissoes', JSON.stringify(permissoesRecebidas));
    setPermissoes(permissoesRecebidas);
  };

  const handleLogout = async () => {
    console.log('🚪 Logout iniciado');
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('permissoes');
    setPermissoes([]);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {permissoes.length > 0 ? (
        <AppNavigatorDinamico permissoes={permissoes} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </NavigationContainer>
  );
}


// // ✅ App.js atualizado com controlo de sessão completo e seguro

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NavigationContainer } from '@react-navigation/native';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, View } from 'react-native';

// import AppNavigatorDinamico from './AppNavigatorDinamico';
// import LoginScreen from './screens/LoginScreen';

// export default function App() {
//   const [permissoes, setPermissoes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const verificarToken = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const permissoesSalvas = await AsyncStorage.getItem('permissoes');

//         if (token && permissoesSalvas) {
//           setPermissoes(JSON.parse(permissoesSalvas));
//         }
//       } catch (e) {
//         console.error("Erro ao carregar permissões:", e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verificarToken();
//   }, []);

//   const handleLoginSuccess = async (token, permissoesRecebidas) => {
//     await AsyncStorage.setItem('token', token);
//     await AsyncStorage.setItem('permissoes', JSON.stringify(permissoesRecebidas));
//     setPermissoes(permissoesRecebidas);
//   };

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem('token');
//     await AsyncStorage.removeItem('permissoes');
//     setPermissoes([]);
//   };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#007AFF" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       {permissoes.length > 0 ? (
//         <AppNavigatorDinamico permissoes={permissoes} onLogout={handleLogout} />
//       ) : (
//         <LoginScreen onLoginSuccess={handleLoginSuccess} />
//       )}
//     </NavigationContainer>
//   );
// }



// // ✅ App.js
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NavigationContainer } from '@react-navigation/native';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, View } from 'react-native';

// import AppNavigatorDinamico from './AppNavigatorDinamico';
// import LoginScreen from './screens/LoginScreen';

// export default function App() {
//   const [permissoes, setPermissoes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const verificarToken = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const permissoesSalvas = await AsyncStorage.getItem('permissoes');

//         if (token && permissoesSalvas) {
//           setPermissoes(JSON.parse(permissoesSalvas));
//         }
//       } catch (e) {
//         console.error("Erro ao carregar permissões:", e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verificarToken();
//   }, []);

//   const handleLoginSuccess = async (token, permissoesRecebidas) => {
//     await AsyncStorage.setItem('token', token);
//     await AsyncStorage.setItem('permissoes', JSON.stringify(permissoesRecebidas));
//     setPermissoes(permissoesRecebidas);
//   };

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem('token');
//     await AsyncStorage.removeItem('permissoes');
//     setPermissoes([]);
//   };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#007AFF" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       {permissoes.length > 0 ? (
//         <AppNavigatorDinamico permissoes={permissoes} onLogout={handleLogout} />
//       ) : (
//         <LoginScreen onLoginSuccess={handleLoginSuccess} />
//       )}
//     </NavigationContainer>
//   );
// }


// // App.js
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NavigationContainer } from '@react-navigation/native';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, View } from 'react-native';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// import AppNavigatorDinamico from './AppNavigatorDinamico';
// import LoginScreen from './screens/LoginScreen';

// export default function App() {
//   const [permissoes, setPermissoes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const verificarToken = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const permissoesSalvas = await AsyncStorage.getItem('permissoes');
//         if (token && permissoesSalvas) {
//           setPermissoes(JSON.parse(permissoesSalvas));
//         }
//       } catch (e) {
//         console.error("Erro ao carregar permissões:", e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verificarToken();
//   }, []);

//   const handleLoginSuccess = async (token, permissoesRecebidas) => {
//     await AsyncStorage.setItem('token', token);
//     await AsyncStorage.setItem('permissoes', JSON.stringify(permissoesRecebidas));
//     setPermissoes(permissoesRecebidas);
//   };

  

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem('token');
//     await AsyncStorage.removeItem('permissoes');
//     setPermissoes([]);
//   };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#007AFF" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
//         <NavigationContainer>
//           {permissoes.length > 0 ? (
//             <AppNavigatorDinamico permissoes={permissoes} onLogout={handleLogout} />
//           ) : (
//             <LoginScreen onLoginSuccess={handleLoginSuccess} />
//           )}
//         </NavigationContainer>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }

// // App.js
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NavigationContainer } from '@react-navigation/native';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, View } from 'react-native';

// import AppNavigatorDinamico from './AppNavigatorDinamico';
// import LoginScreen from './screens/LoginScreen';

// export default function App() {
//   const [permissoes, setPermissoes] = useState([]);
//   const [loading, setLoading] = useState(true); // para loading inicial

//   useEffect(() => {
//     const verificarToken = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const permissoesSalvas = await AsyncStorage.getItem('permissoes');
//         if (token && permissoesSalvas) {
//           setPermissoes(JSON.parse(permissoesSalvas));
//         }
//       } catch (e) {
//         console.error("Erro ao carregar permissões:", e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verificarToken();
//   }, []);

//   const handleLoginSuccess = async (token, permissoesRecebidas) => {
//     await AsyncStorage.setItem('token', token);
//     await AsyncStorage.setItem('permissoes', JSON.stringify(permissoesRecebidas));
//     setPermissoes(permissoesRecebidas);
//   };

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem('token');
//     await AsyncStorage.removeItem('permissoes');
//     setPermissoes([]);
//   };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#007AFF" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaProvider>
//       <NavigationContainer>
//         {permissoes.length > 0 ? (
//           <AppNavigatorDinamico permissoes={permissoes} onLogout={handleLogout} />
//         ) : (
//           <LoginScreen onLoginSuccess={handleLoginSuccess} />
//         )}
//       </NavigationContainer></SafeAreaProvider>
//   );
// }


// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, View } from 'react-native';

// import AppNavigatorDinamico from './AppNavigatorDinamico';
// import LoginScreen from './screens/LoginScreen';
// import SplashScreen from './screens/SplashScreen';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   const [permissoes, setPermissoes] = useState([]);
//   const [carregando, setCarregando] = useState(true);

//   useEffect(() => {
//     const verificarSessao = async () => {
//       const token = await AsyncStorage.getItem('token');
//       const permissoesGuardadas = await AsyncStorage.getItem('permissoes');

//       if (token && permissoesGuardadas) {
//         setPermissoes(JSON.parse(permissoesGuardadas));
//       }
//       setCarregando(false);
//     };

//     verificarSessao();
//   }, []);

//   const handleLogin = async (novasPermissoes) => {
//     setPermissoes(novasPermissoes);
//   };

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem('token');
//     await AsyncStorage.removeItem('permissoes');
//     setPermissoes([]);
//   };

//   if (carregando) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#28a745" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaProvider>
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Splash" component={SplashScreen} />
//         <Stack.Screen name="Login" options={{ headerShown: false }}>
//           {() => <LoginScreen onLogin={handleLogin} />}
//         </Stack.Screen>
//         <Stack.Screen name="App">
//           {() => <AppNavigatorDinamico permissoes={permissoes} onLogout={handleLogout} />}
//         </Stack.Screen>
//       </Stack.Navigator>
//     </NavigationContainer></SafeAreaProvider>
//   );
// }


// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NavigationContainer } from '@react-navigation/native';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, View } from 'react-native';

// import AppNavigatorDinamico from './AppNavigatorDinamico';

// import LoginScreen from './screens/LoginScreen';

// export default function App() {
//   const [permissoes, setPermissoes] = useState([]);
//   const [carregando, setCarregando] = useState(true);

//   useEffect(() => {
//     const verificarSessao = async () => {
//       const token = await AsyncStorage.getItem('token');
//       const permissoesGuardadas = await AsyncStorage.getItem('permissoes');

//       if (token && permissoesGuardadas) {
//         setPermissoes(JSON.parse(permissoesGuardadas));
//       }
//       setCarregando(false);
//     };

//     verificarSessao();
//   }, []);

//   const handleLogin = async (novasPermissoes) => {
//     setPermissoes(novasPermissoes);
//   };

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem('token');
//     await AsyncStorage.removeItem('permissoes');
//     setPermissoes([]);
//   };

//   if (carregando) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#28a745" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       {permissoes.length > 0 ? (
//         <AppNavigatorDinamico permissoes={permissoes} onLogout={handleLogout} />
//       ) : (
//         <LoginScreen onLogin={handleLogin} />
//       )}
//     </NavigationContainer>
//   );
// }


// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NavigationContainer } from '@react-navigation/native';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, View } from 'react-native';

// import AppFiscalNavigator from './AppFiscalNavigator';
// import AppPublicoNavigator from './AppPublicoNavigator';
// import LoginScreen from './screens/LoginScreen';

// export default function App() {
//   const [tipo, setTipo] = useState(null);
//   const [carregando, setCarregando] = useState(true);

//   useEffect(() => {
//     const verificarSessao = async () => {
//       const token = await AsyncStorage.getItem('token');
//       const tipoGuardado = await AsyncStorage.getItem('tipo_utilizador');

//       if (token && tipoGuardado) {
//         setTipo(tipoGuardado);
//       }
//       setCarregando(false);
//     };

//     verificarSessao();
//   }, []);

//   const handleLogin = (tipoAutenticado) => {
//     setTipo(tipoAutenticado);
//   };

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem('token');
//     await AsyncStorage.removeItem('tipo_utilizador');
//     setTipo(null);
//   };

//   if (carregando) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#28a745" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       {tipo === 'fiscal' ? (
//         <AppFiscalNavigator onLogout={handleLogout} />
//       ) : tipo === 'publico' ? (
//         <AppPublicoNavigator onLogout={handleLogout} />
//       ) : (
//         <LoginScreen onLogin={handleLogin} />
//       )}
//     </NavigationContainer>
//   );
// }


// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NavigationContainer } from '@react-navigation/native'; // 👈 IMPORTANTE
// import { useEffect, useState } from 'react';

// import AppFiscalNavigator from './AppFiscalNavigator';
// import AppPublicoNavigator from './AppPublicoNavigator';
// import LoginScreen from './screens/LoginScreen';

// export default function App() {
//   const [tipo, setTipo] = useState(null);
//   const [mostrarLogin, setMostrarLogin] = useState(true);

//   useEffect(() => {
//     const verificarSessao = async () => {
//       const token = await AsyncStorage.getItem('token');
//       const tipoGuardado = await AsyncStorage.getItem('tipo_utilizador');

//       console.log('Verificando sessão...');
//       console.log('Token:', token);
//       console.log('Tipo Utilizador:', tipoGuardado);

//       if (token && tipoGuardado) {
//         setTipo(tipoGuardado);
//         setMostrarLogin(false);
//       } else {
//         setMostrarLogin(true);
//       }
//     };
//     verificarSessao();
//   }, []);

//   const handleLogin = (tipoAutenticado) => {
//     setTipo(tipoAutenticado);
//     setMostrarLogin(false);
//   };

//   if (mostrarLogin) return <LoginScreen onLogin={handleLogin} />;

//   return (
//     <NavigationContainer> {/* ✅ ENVOLVE AQUI */}
//       {tipo === 'fiscal' ? <AppFiscalNavigator /> : <AppPublicoNavigator />}
//     </NavigationContainer>
//   );
// }
