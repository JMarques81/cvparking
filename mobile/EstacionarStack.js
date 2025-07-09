import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
// import Colors from './constants/Colors'; // Define cores como Colors.primary, Colors.text
import ConfirmacaoEstacionamento from './screens/ConfirmacaoEstacionamento';
import EstacionarConfirmarScreen from './screens/EstacionarConfirmarScreen';
import EstacionarScreen from './screens/EstacionarScreen';

const Stack = createNativeStackNavigator();
const Colors = {
  primary: '#007AFF',
  card: '#FFFFFF',
  text: '#1C1C1E',
};
export default function EstacionarStack() {
  return (
    <Stack.Navigator
      initialRouteName="EstacionarInicio"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.primary,
          ...Platform.select({
            ios: {
              shadowColor: Colors.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="EstacionarInicio"
        component={EstacionarScreen}
        options={{ title: 'Estacionar' }}
      />
      <Stack.Screen
        name="EstacionarConfirmar"
        component={EstacionarConfirmarScreen}
        options={{ title: 'Confirmar Estacionamento' }}
      />
      <Stack.Screen
        name="ConfirmacaoEstacionamento"
        component={ConfirmacaoEstacionamento}
        options={{ title: 'Confirmado' }}
      />
    </Stack.Navigator>
  );
}
