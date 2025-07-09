import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const verificar = async () => {
      const token = await AsyncStorage.getItem('token');
      const permissoes = await AsyncStorage.getItem('permissoes');

      if (token && permissoes) {
        navigation.replace('App');
      } else {
        navigation.replace('Login');
      }
    };

    verificar();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#f00" />
    </View>
  );
}


// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useEffect } from 'react';
// import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

// export default function SplashScreen({ navigation }) {
//   useEffect(() => {
//     const verificarPermissao = async () => {
//       const token = await AsyncStorage.getItem('token');
//       const tipo = await AsyncStorage.getItem('tipo_utilizador');
//       // Redireciona conforme tipo_utilizador guardado
//       if (token && tipo) {
//         if (tipo === 'publico') {
//           navigation.replace('AppPublicoNavigator');
//         } else if (tipo === 'fiscal') {
//           navigation.replace('AppFiscalNavigator');
//         } else if (tipo === 'admin') {
//           navigation.replace('AppAdminNavigator');
//         }
//       }
//     };
//     setTimeout(verificarPermissao, 1500); // pequeno delay para efeito
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.logoContainer}>
//         <View style={styles.circle}>
//           <Text style={styles.logoText}>
//             <Text style={styles.logoES}>ES</Text>
//             <Text style={styles.logoPARK}>PARKING</Text>
//           </Text>
//           <View style={styles.semiCircle} />
//         </View>
//       </View>

//       <ActivityIndicator color="#fff" size="large" style={{ marginTop: 40 }} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#000',
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logoContainer: {
//     marginBottom: 80,
//   },
//   circle: {
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     backgroundColor: '#111',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   semiCircle: {
//     position: 'absolute',
//     bottom: -5,
//     right: -5,
//     width: 60,
//     height: 60,
//     borderBottomWidth: 8,
//     borderRightWidth: 8,
//     borderColor: '#f00',
//     borderRadius: 30,
//     transform: [{ rotate: '-45deg' }],
//   },
//   logoText: {
//     fontSize: 28,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   logoES: {
//     color: '#f00',
//   },
//   logoPARK: {
//     color: '#fff',
//   }
// });
