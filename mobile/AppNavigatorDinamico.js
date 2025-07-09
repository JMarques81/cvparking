// AppNavigatorDinamico.js
import AppAdminNavigator from './navigators/AppAdminNavigator';
import AppFiscalNavigator from './navigators/AppFiscalNavigator';
import AppPublicoNavigator from './navigators/AppPublicoNavigator';

export default function AppNavigatorDinamico({ permissoes = [], onLogout }) {
  console.log('Permissões atuais:', permissoes);

  if (Array.isArray(permissoes) && permissoes.includes('admin')) {
    return <AppAdminNavigator onLogout={onLogout} />;
  }

  if (Array.isArray(permissoes) && permissoes.includes('fiscal')) {
    return <AppFiscalNavigator onLogout={onLogout} />;
  }

  return <AppPublicoNavigator onLogout={onLogout} />;
}

// // AppNavigatorDinamico.js
// import { Ionicons } from '@expo/vector-icons';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Platform, StyleSheet, Text, View } from 'react-native';

// import CoimasScreen from './screens/CoimasScreen';
// import MapaMobileComRota from './screens/MapaMobileComRota';
// import PainelFiscal from './screens/PainelFiscalScreen';
// import PerfilScreen from './screens/PerfilScreen';
// import RelatoriosScreen from './screens/RelatoriosScreen';

// const Tab = createBottomTabNavigator();

// const CustomHeader = ({ title }) => (
//   <View style={headerStyles.container}>
//     <Text style={headerStyles.title}>{title}</Text>
//   </View>
// );

// const headerStyles = StyleSheet.create({
//   container: {
//     backgroundColor: '#007AFF',
//     paddingTop: Platform.OS === 'ios' ? 50 : 20,
//     paddingBottom: 15,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 15,
//     borderBottomRightRadius: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   title: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

// const getTabBarIcon = (routeName, focused, color, size) => {
//   let iconName;
//   switch (routeName) {
//     case 'Mapa':
//       iconName = focused ? 'map' : 'map-outline';
//       break;
//     case 'Meu Perfil':
//       iconName = focused ? 'person' : 'person-outline';
//       break;
//     case 'Painel Fiscal':
//       iconName = focused ? 'speedometer' : 'speedometer-outline';
//       break;
//     case 'Infrações':
//       iconName = focused ? 'alert-circle' : 'alert-circle-outline';
//       break;
//     case 'Relatórios Fiscais':
//       iconName = focused ? 'document-text' : 'document-text-outline';
//       break;
//     default:
//       iconName = 'help-circle-outline';
//   }
//   return <Ionicons name={iconName} size={size} color={color} />;
// };

// export default function AppNavigatorDinamico({ permissoes, onLogout }) {
//   if (!permissoes || permissoes.length === 0) {
//     return null; // Evita erro ao montar abas vazias
//   }

//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => getTabBarIcon(route.name, focused, color, size),
//         tabBarActiveTintColor: '#007AFF',
//         tabBarInactiveTintColor: '#8e8e93',
//         tabBarStyle: {
//           backgroundColor: '#fff',
//           borderTopWidth: 0,
//           elevation: 10,
//           height: Platform.OS === 'ios' ? 90 : 70,
//           paddingBottom: Platform.OS === 'ios' ? 30 : 10,
//           paddingTop: 5,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: '500',
//         },
//         headerShown: route.name !== 'Mapa',
//         header: () => <CustomHeader title={route.name} />,
//       })}
//     >
//       {permissoes.includes('publico') && (
//         <>
//           <Tab.Screen
//             name="Mapa"
//             component={MapaMobileComRota}
//             options={{ headerShown: false }}
//           />
//           <Tab.Screen name="Meu Perfil">
//             {() => <PerfilScreen onLogout={onLogout} />}
//           </Tab.Screen>
//         </>
//       )}

//       {permissoes.includes('fiscal') && (
//         <>
//           <Tab.Screen
//             name="Painel Fiscal"
//             component={PainelFiscal}
//             options={{ title: 'Painel do Fiscal' }}
//           />
//           <Tab.Screen
//             name="Infrações"
//             component={CoimasScreen}
//             options={{ title: 'Gerenciar Infrações' }}
//           />
//           <Tab.Screen
//             name="Relatórios Fiscais"
//             component={RelatoriosScreen}
//             options={{ title: 'Relatórios de Fiscalização' }}
//           />
//           <Tab.Screen name="Meu Perfil">
//             {() => <PerfilScreen onLogout={onLogout} />}
//           </Tab.Screen>
//         </>
//       )}
//     </Tab.Navigator>
//   );
// }




// import { Ionicons } from '@expo/vector-icons';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Platform, StyleSheet, Text, View } from 'react-native';

// import HistoricoScreen from './screens/HistoricoScreen';
// import MapaMobileComRota from './screens/MapaMobileComRota';
// import PagamentoScreen from './screens/PagamentoScreen';
// import PerfilScreen from './screens/PerfilScreen';

// import CoimasScreen from './screens/CoimasScreen';
// import EstacionarScreen from './screens/EstacionarScreen';
// import PainelFiscalScreen from './screens/PainelFiscalScreen';
// import RelatoriosScreen from './screens/RelatoriosScreen';

// import DashboardAdmin from './screens/DashboardAdmin'; // opcional
// // import UtilizadoresAdminScreen from './screens/UtilizadoresAdminScreen'; // opcional

// const Tab = createBottomTabNavigator();

// const CustomHeader = ({ title }) => (
//   <View style={headerStyles.container}>
//     <Text style={headerStyles.title}>{title}</Text>
//   </View>
// );

// const headerStyles = StyleSheet.create({
//   container: {
//     backgroundColor: '#007AFF',
//     paddingTop: Platform.OS === 'ios' ? 50 : 20,
//     paddingBottom: 15,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 15,
//     borderBottomRightRadius: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   title: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

// const getTabIcon = (routeName, focused, color, size) => {
//   const icons = {
//     'Mapa': focused ? 'map' : 'map-outline',
//     'Estacionar': focused ? 'car' : 'car-outline',
//     'Histórico': focused ? 'time' : 'time-outline',
//     'Pagamentos': focused ? 'wallet' : 'wallet-outline',
//     'Meu Perfil': focused ? 'person' : 'person-outline',
//     'Painel Fiscal': focused ? 'speedometer' : 'speedometer-outline',
//     'Infrações': focused ? 'alert-circle' : 'alert-circle-outline',
//     'Relatórios Fiscais': focused ? 'document-text' : 'document-text-outline',
//     'Administração': focused ? 'settings' : 'settings-outline',
//     'Dashboard': focused ? 'cube' : 'cube-outline',
//   };
//   return <Ionicons name={icons[routeName] || 'help-circle-outline'} size={size} color={color} />;
// };

// export default function AppNavigatorDinamico({ permissoes, onLogout }) {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => getTabIcon(route.name, focused, color, size),
//         tabBarActiveTintColor: '#007AFF',
//         tabBarInactiveTintColor: '#8e8e93',
//         tabBarStyle: {
//           backgroundColor: '#fff',
//           borderTopWidth: 0,
//           elevation: 10,
//           shadowColor: '#000',
//           shadowOffset: { width: 0, height: -5 },
//           shadowOpacity: 0.05,
//           shadowRadius: 10,
//           height: Platform.OS === 'ios' ? 90 : 60,
//           paddingBottom: Platform.OS === 'ios' ? 30 : 0,
//           paddingTop: 5,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: '500',
//         },
//         headerShown: route.name !== 'Mapa',
//         header: () => <CustomHeader title={route.name} />,
//       })}
//     >
//       {permissoes.includes('publico') && (
//         <>
//           <Tab.Screen
//             name="Mapa"
//             component={MapaMobileComRota}
//             options={{ headerShown: false }}
//           />
//           <Tab.Screen name="Estacionar" component={EstacionarScreen} />
//           <Tab.Screen name="Histórico" component={HistoricoScreen} />
//           <Tab.Screen name="Pagamentos" component={PagamentoScreen} />
//           <Tab.Screen name="Meu Perfil">
//             {() => <PerfilScreen onLogout={onLogout} />}
//           </Tab.Screen>
//         </>
//       )}

//       {permissoes.includes('fiscal') && (
//         <>
//           <Tab.Screen name="Painel Fiscal" component={PainelFiscalScreen} />
//           <Tab.Screen name="Infrações" component={CoimasScreen} />
//           <Tab.Screen name="Relatórios Fiscais" component={RelatoriosScreen} />
//           <Tab.Screen name="Meu Perfil">
//             {() => <PerfilScreen onLogout={onLogout} />}
//           </Tab.Screen>
//         </>
//       )}

//       {permissoes.includes('admin') && (
//         <>
//           <Tab.Screen name="Dashboard" component={DashboardAdmin} />
//           {/* <Tab.Screen name="Administração" component={UtilizadoresAdminScreen} /> */}
//           <Tab.Screen name="Meu Perfil">
//             {() => <PerfilScreen onLogout={onLogout} />}
//           </Tab.Screen>
//         </>
//       )}
//     </Tab.Navigator>
//   );
// }



// 2 // ✅ AppNavigatorDinamico.js - Define as abas com base nas permissoes
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import AppFiscalNavigator from './AppFiscalNavigator';
// import AppPublicoNavigator from './AppPublicoNavigator';

// const Tab = createBottomTabNavigator();

// export default function AppNavigatorDinamico({ permissoes, onLogout }) {
//   if (permissoes.includes('fiscal')) {
//     return <AppFiscalNavigator onLogout={onLogout} />;
//   } else {
//     return <AppPublicoNavigator onLogout={onLogout} />;
//   }
// }


// //Estilos para o cabeçalho
// //(Colocado acima do componente principal para melhor organização)

// import { Ionicons } from '@expo/vector-icons';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// // Screens
// import CoimasScreen from './screens/CoimasScreen';
// import MapaMobileComRota from './screens/MapaMobileComRota';

// import PainelFiscal from './screens/PainelFiscalScreen';
// import PerfilScreen from './screens/PerfilScreen';
// import RelatoriosScreen from './screens/RelatoriosScreen';

// const Tab = createBottomTabNavigator();

// export default function AppNavigatorDinamico({ permissoes, onLogout }) {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName = 'home';
//           if (route.name === 'Mapa') iconName = 'map';
//           else if (route.name === 'Perfil') iconName = 'person';
//           else if (route.name === 'Coimas') iconName = 'alert';
//           else if (route.name === 'Relatórios') iconName = 'document-text';
//           else if (route.name === 'Painel') iconName = 'speedometer';

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: '#007BFF',
//         tabBarInactiveTintColor: 'gray',
//       })}
//     >
//       {permissoes.includes('publico') && (
//         <>
//           <Tab.Screen name="Mapa" component={MapaMobileComRota} />
//           <Tab.Screen name="Perfil">
//             {() => <PerfilScreen onLogout={onLogout} />}
//           </Tab.Screen>
//         </>
//       )}

//       {permissoes.includes('fiscal') && (
//         <>
//           <Tab.Screen name="Painel" component={PainelFiscal} />
//           <Tab.Screen name="Coimas" component={CoimasScreen} />
//           <Tab.Screen name="Relatórios" component={RelatoriosScreen} />
//            <Tab.Screen name="Perfil">
//             {() => <PerfilScreen onLogout={onLogout} />}
//           </Tab.Screen>
//         </>
//       )}
//     </Tab.Navigator>
//   );
// }


// import { Ionicons } from '@expo/vector-icons';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Platform, StyleSheet, Text, View } from 'react-native'; // <-- Adicione 'Platform' aqui

// // Importe suas telas
// import CoimasScreen from './screens/CoimasScreen';
// import MapaMobileComRota from './screens/MapaMobileComRota';
// // import HistoricoScreen from './screens/HistoricoScreen'; // Se tiver tela de Histórico para o público
// // import PagamentoScreen from './screens/PagamentoScreen'; // Se tiver tela de Pagamento para o público
// import PainelFiscal from './screens/PainelFiscalScreen'; // Renomeado para consistência
// import PerfilScreen from './screens/PerfilScreen';
// import RelatoriosScreen from './screens/RelatoriosScreen'; // Renomeado para consistência
// // import DashboardAdmin from './screens/DashboardAdmin'; // Se tiver tela de Dashboard para admin

// const Tab = createBottomTabNavigator();

// // --- Componente para o Cabeçalho Personalizado (Opcional, mas melhora a UX) ---
// const CustomHeader = ({ title }) => (
//   <View style={headerStyles.container}>
//     <Text style={headerStyles.title}>{title}</Text>
//   </View>
// );

// const headerStyles = StyleSheet.create({
//   container: {
//     backgroundColor: '#007AFF', // Cor primária
//     paddingTop: Platform.OS === 'ios' ? 50 : 20, // Ajuste para a status bar em iOS
//     paddingBottom: 15,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 15,
//     borderBottomRightRadius: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   title: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });


// export default function AppNavigatorDinamico({ permissoes, onLogout }) {
//   // Ajuste os ícones e nomes para serem mais descritivos e visualmente atraentes
//   const getTabBarIcon = (routeName, focused, color, size) => {
//     let iconName;
//     let label; // Não está a ser usado diretamente aqui, mas é útil para futuros refinamentos

//     switch (routeName) {
//       case 'Mapa':
//         iconName = focused ? 'map' : 'map-outline';
//         label = 'Mapa';
//         break;
//       case 'Estacionar': // Nova aba para iniciar estacionamento
//         iconName = focused ? 'car' : 'car-outline';
//         label = 'Estacionar';
//         break;
//       case 'Histórico': // Nova aba
//         iconName = focused ? 'time' : 'time-outline';
//         label = 'Histórico';
//         break;
//       case 'Pagamentos': // Nova aba
//         iconName = focused ? 'wallet' : 'wallet-outline';
//         label = 'Pagamentos';
//         break;
//       case 'Meu Perfil': // Nome mais amigável
//         iconName = focused ? 'person' : 'person-outline';
//         label = 'Perfil';
//         break;
//       case 'Painel Fiscal': // Nome mais claro
//         iconName = focused ? 'speedometer' : 'speedometer-outline';
//         label = 'Fiscal';
//         break;
//       case 'Infrações': // Nome mais claro para Coimas
//         iconName = focused ? 'alert-circle' : 'alert-circle-outline';
//         label = 'Infrações';
//         break;
//       case 'Relatórios Fiscais': // Nome mais claro
//         iconName = focused ? 'document-text' : 'document-text-outline';
//         label = 'Relatórios';
//         break;
//       case 'Administração': // Aba para o admin, se existir
//         iconName = focused ? 'settings' : 'settings-outline';
//         label = 'Admin';
//         break;
//       case 'Dashboard Admin': // Outra possível aba para admin
//         iconName = focused ? 'cube' : 'cube-outline';
//         label = 'Dashboard';
//         break;
//       default:
//         iconName = 'help-circle-outline';
//         label = 'Ajuda';
//     }
//     return <Ionicons name={iconName} size={size} color={color} />;
//   };

//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => getTabBarIcon(route.name, focused, color, size),
//         tabBarActiveTintColor: '#007AFF', // Azul primário mais vibrante
//         tabBarInactiveTintColor: '#8e8e93', // Cinza suave
//         tabBarStyle: {
//           backgroundColor: '#fff', // Fundo branco para a tab bar
//           borderTopWidth: 0, // Remove a borda superior padrão
//           elevation: 10, // Sombra para Android
//           shadowColor: '#000', // Sombra para iOS
//           shadowOffset: { width: 0, height: -5 },
//           shadowOpacity: 0.05,
//           shadowRadius: 10,
//           height: Platform.OS === 'ios' ? 90 : 60, // Aumenta a altura para iOS para acomodar o "safe area"
//           paddingBottom: Platform.OS === 'ios' ? 30 : 0, // Padding para iOS
//           paddingTop: 5,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: '500',
//         },
//         headerShown: true, // Mostrar o cabeçalho por padrão
//         header: ({ route }) => <CustomHeader title={route.name} />, // Usar cabeçalho personalizado
//       })}
//     >
//       {/* Abas para Utilizador Público */}
//       {permissoes.includes('publico') && (
//         <>
//           <Tab.Screen
//             name="Mapa"
//             component={MapaMobileComRota}
//             options={{
//               title: 'Explorar Estacionamento', // Título para o cabeçalho
//               headerShown: false // Ocultar o cabeçalho no mapa (já tem elementos visuais fortes)
//             }}
//           />
//           {/* Adicionei mais abas sugeridas para o perfil público */}
//           {/* <Tab.Screen name="Estacionar" component={EstacionarScreen} /> */}
//           {/* <Tab.Screen name="Histórico" component={HistoricoScreen} /> */}
//           {/* <Tab.Screen name="Pagamentos" component={PagamentoScreen} /> */}
//           <Tab.Screen name="Meu Perfil">
//             {() => <PerfilScreen onLogout={onLogout} />}
//           </Tab.Screen>
//         </>
//       )}

//       {/* Abas para o Fiscal */}
//       {permissoes.includes('fiscal') && (
//         <>
//           <Tab.Screen
//             name="Painel Fiscal"
//             component={PainelFiscal}
//             options={{ title: 'Painel do Fiscal' }}
//           />
//           <Tab.Screen
//             name="Infrações"
//             component={CoimasScreen}
//             options={{ title: 'Gerenciar Infrações' }}
//           />
//           <Tab.Screen
//             name="Relatórios Fiscais"
//             component={RelatoriosScreen}
//             options={{ title: 'Relatórios de Fiscalização' }}
//           />
//           <Tab.Screen name="Meu Perfil">
//             {() => <PerfilScreen onLogout={onLogout} />}
//           </Tab.Screen>
//         </>
//       )}
//     </Tab.Navigator>
//   );
// }
// Estilos para o cabeçalho
// (Colocado acima do componente principal para melhor organização)

// import { Ionicons } from '@expo/vector-icons';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// // Screens
// import CoimasScreen from './screens/CoimasScreen';
// import MapaMobileComRota from './screens/MapaMobileComRota';

// import PainelFiscal from './screens/PainelFiscalScreen';
// import PerfilScreen from './screens/PerfilScreen';
// import RelatoriosScreen from './screens/RelatoriosScreen';

// const Tab = createBottomTabNavigator();

// export default function AppNavigatorDinamico({ permissoes, onLogout }) {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName = 'home';
//           if (route.name === 'Mapa') iconName = 'map';
//           else if (route.name === 'Perfil') iconName = 'person';
//           else if (route.name === 'Coimas') iconName = 'alert';
//           else if (route.name === 'Relatórios') iconName = 'document-text';
//           else if (route.name === 'Painel') iconName = 'speedometer';

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: '#007BFF',
//         tabBarInactiveTintColor: 'gray',
//       })}
//     >
//       {permissoes.includes('publico') && (
//         <>
//           <Tab.Screen name="Mapa" component={MapaMobileComRota} />
//           <Tab.Screen name="Perfil">
//             {() => <PerfilScreen onLogout={onLogout} />}
//           </Tab.Screen>
//         </>
//       )}

//       {permissoes.includes('fiscal') && (
//         <>
//           <Tab.Screen name="Painel" component={PainelFiscal} />
//           <Tab.Screen name="Coimas" component={CoimasScreen} />
//           <Tab.Screen name="Relatórios" component={RelatoriosScreen} />
//            <Tab.Screen name="Perfil">
//             {() => <PerfilScreen onLogout={onLogout} />}
//           </Tab.Screen>
//         </>
//       )}
//     </Tab.Navigator>
//   );
// }
