import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EstacionarStack from '../EstacionarStack';
import HistoricoScreen from '../screens/HistoricoScreen';
import MapaMobileComRota from '../screens/MapaMobileComRota';
import PagamentoScreen from '../screens/PagamentoScreen';
import PerfilScreen from '../screens/PerfilScreen';
const Tab = createBottomTabNavigator(); // ✅ Esta linha estava faltando
const Stack = createNativeStackNavigator();

export default function AppPublicoNavigator({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Mapa') iconName = 'navigate';
          else if (route.name === 'Estacionar') iconName = 'car';
          else if (route.name === 'Histórico') iconName = 'time';
          else if (route.name === 'Pagamento') iconName = 'wallet';
          else if (route.name === 'Perfil') iconName = 'person-circle';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false
      })}
    >
      <Tab.Screen name="Mapa" component={MapaMobileComRota} />
      <Tab.Screen name="Estacionar" component={EstacionarStack} />
      <Tab.Screen name="Histórico" component={HistoricoScreen} />
      <Tab.Screen name="Pagamento" component={PagamentoScreen} />
      <Tab.Screen name="Perfil">
        {(props) => <PerfilScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// import { Ionicons } from '@expo/vector-icons';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import ConfirmacaoEstacionamento from './screens/ConfirmacaoEstacionamento';
// import EstacionarConfirmarScreen from './screens/EstacionarConfirmarScreen';
// import EstacionarScreen from './screens/EstacionarScreen';
// import HistoricoScreen from './screens/HistoricoScreen';
// import MapaMobileComRota from './screens/MapaMobileComRota';
// import PagamentoScreen from './screens/PagamentoScreen';
// import PerfilScreen from './screens/PerfilScreen';

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// function EstacionarStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="EstacionarInicio" component={EstacionarScreen} options={{ title: 'Estacionar' }} />
//       <Stack.Screen name="EstacionarConfirmar" component={EstacionarConfirmarScreen} />
//       <Stack.Screen name="ConfirmacaoEstacionamento" component={ConfirmacaoEstacionamento} options={{ title: 'Confirmar Estacionamento' }} />
//     </Stack.Navigator>
//   );
// }

// export default function AppPublicoNavigator() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName;
//           if (route.name === 'Mapa') iconName = 'navigate';
//           else if (route.name === 'Estacionar') iconName = 'car';
//           else if (route.name === 'Histórico') iconName = 'time';
//           else if (route.name === 'Pagamento') iconName = 'wallet';
//           else if (route.name === 'Perfil') iconName = 'person-circle';
//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         headerShown: false
//       })}
//     >
//       <Tab.Screen name="Mapa" component={MapaMobileComRota} />
//       <Tab.Screen name="Estacionar" component={EstacionarScreen} />
//       <Tab.Screen name="Histórico" component={HistoricoScreen} />
//       <Tab.Screen name="Pagamento" component={PagamentoScreen} />
//       <Tab.Screen name="Perfil" component={PerfilScreen} />
//     </Tab.Navigator>
//   );
// }





