import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CoimasScreen from '../screens/CoimasScreen';
import MapaFiscalScreen from '../screens/MapaFiscalScreen';
import PainelScreen from '../screens/PainelScreen';
import PerfilScreen from '../screens/PerfilScreen';
import RelatoriosScreen from '../screens/RelatoriosScreen';

const Tab = createBottomTabNavigator();

export default function AppFiscalNavigator({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Painel') iconName = 'apps';
          else if (route.name === 'Mapa Fiscal') iconName = 'map';
          else if (route.name === 'Coimas') iconName = 'alert-circle';
          else if (route.name === 'Relatórios') iconName = 'bar-chart';
          else iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#dc3545',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen name="Painel" component={PainelScreen} />
      <Tab.Screen name="Mapa Fiscal" component={MapaFiscalScreen} />
      <Tab.Screen name="Coimas" component={CoimasScreen} />
      <Tab.Screen name="Relatórios" component={RelatoriosScreen} />
      <Tab.Screen name="Mais">
        {(props) => <PerfilScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
