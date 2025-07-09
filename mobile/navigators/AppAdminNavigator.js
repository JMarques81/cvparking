import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import PerfilScreen from '../screens/PerfilScreen';

function DashboardAdmin() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>📊 Painel Administrativo</Text>
    </View>
  );
}

function RelatoriosAdmin() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>📁 Relatórios Gerais</Text>
    </View>
  );
}

function UtilizadoresAdmin() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>👥 Gestão de Utilizadores</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function AppAdminNavigator({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'apps';
          if (route.name === 'Dashboard') iconName = 'grid';
          else if (route.name === 'Relatórios') iconName = 'document-text';
          else if (route.name === 'Utilizadores') iconName = 'people';
          else if (route.name === 'Perfil') iconName = 'person-circle';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardAdmin} />
      <Tab.Screen name="Relatórios" component={RelatoriosAdmin} />
      <Tab.Screen name="Utilizadores" component={UtilizadoresAdmin} />
      <Tab.Screen name="Perfil">
        {(props) => <PerfilScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
