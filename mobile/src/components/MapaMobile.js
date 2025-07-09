import axios from 'axios';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import io from 'socket.io-client';

export default function MapaMobileComRota() {
  const [localizacao, setLocalizacao] = useState(null);
  const [sensores, setSensores] = useState([]);
  const [rota, setRota] = useState([]);
  const [vagaSelecionada, setVagaSelecionada] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão de localização negada.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocalizacao({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      });
    })();
  }, []);

  useEffect(() => {
    const socket = io('http://192.168.50.162:5000'); // teu IP local
    socket.emit('pedirSensores');
    socket.on('sensoresIniciais', setSensores);
    socket.on('sensorAtualizado', atualizado => {
      setSensores(prev => prev.map(s => (s._id === atualizado._id ? atualizado : s)));
    });
    return () => socket.disconnect();
  }, []);

  // Calcular rota para vaga mais próxima quando clicado
  const calcularRota = async () => {
    if (!localizacao || sensores.length === 0) return;
    const vagas = sensores.filter(s => s.estado === 'livre');
    if (vagas.length === 0) {
      Alert.alert('Info', 'Sem vagas livres disponíveis.');
      return;
    }

    // Encontrar vaga mais próxima
    const maisProxima = vagas.reduce((melhor, atual) => {
      const d1 = distancia(localizacao, atual);
      const d2 = melhor ? distancia(localizacao, melhor) : Infinity;
      return d1 < d2 ? atual : melhor;
    }, null);

    setVagaSelecionada(maisProxima);

    // Fazer requisição a uma API de rotas (exemplo com OpenRouteService, substitua pela sua)
    const origem = `${localizacao.longitude},${localizacao.latitude}`;
    const destino = `${maisProxima.lng},${maisProxima.lat}`;
    const resposta = await axios.get(`https://router.project-osrm.org/route/v1/driving/${origem};${destino}?overview=full&geometries=geojson`);

    const coords = resposta.data.routes[0].geometry.coordinates.map(([lng, lat]) => ({
      latitude: lat,
      longitude: lng
    }));

    setRota(coords);
  };

  function distancia(a, b) {
    const dx = a.latitude - b.lat;
    const dy = a.longitude - b.lng;
    return Math.sqrt(dx * dx + dy * dy);
  }

  return (
    <View style={{ flex: 1 }}>
      {localizacao ? (
        <MapView
          style={styles.map}
          region={localizacao}
          showsUserLocation={true}
          onPress={calcularRota}
        >
          {sensores.map(sensor => (
            <Marker
              key={sensor._id}
              coordinate={{ latitude: sensor.lat, longitude: sensor.lng }}
              pinColor={sensor.estado === 'livre' ? 'green' : 'red'}
              title={`Sensor ${sensor.id_sensor}`}
              description={`Estado: ${sensor.estado}`}
            />
          ))}

          {vagaSelecionada && (
            <Marker
              coordinate={{ latitude: vagaSelecionada.lat, longitude: vagaSelecionada.lng }}
              pinColor="blue"
              title="Vaga selecionada"
            />
          )}

          {rota.length > 0 && (
            <Polyline coordinates={rota} strokeColor="blue" strokeWidth={4} />
          )}
        </MapView>
      ) : (
        <Text style={styles.loading}>A obter localização...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  loading: {
    textAlign: 'center',
    marginTop: 20
  }
});


// import * as Location from 'expo-location';
// import { useEffect, useState } from 'react';
// import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import io from 'socket.io-client';

// export default function MapaMobile() {
//   const [localizacao, setLocalizacao] = useState(null);
//   const [sensores, setSensores] = useState([]);

//   const largura = Dimensions.get('window').width;
//   const altura = Dimensions.get('window').height;

//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permissão negada', 'Não foi possível obter a localização.');
//         return;
//       }

//       const loc = await Location.getCurrentPositionAsync({});
//       setLocalizacao({
//         latitude: loc.coords.latitude,
//         longitude: loc.coords.longitude,
//         latitudeDelta: 0.002,
//         longitudeDelta: 0.002,
//       });
//     })();
//   }, []);

//   useEffect(() => {
//     const socket = io('http://192.168.1.143:5000');
//     socket.emit('pedirSensores');
//     socket.on('sensoresIniciais', setSensores);
//     socket.on('sensorAtualizado', atualizado => {
//       setSensores(prev =>
//         prev.map(s => (s._id === atualizado._id ? atualizado : s))
//       );
//     });
//     return () => socket.disconnect();
//   }, []);

//   return (
//     <View style={styles.container}>
//       {localizacao ? (
//         <MapView
//           style={{ width: largura, height: altura }}
//           region={localizacao}
//           showsUserLocation={true}
//         >
//           {sensores.map(sensor => (
//             <Marker
//               key={sensor._id}
//               coordinate={{ latitude: sensor.lat, longitude: sensor.lng }}
//               pinColor={sensor.estado === 'livre' ? 'green' : 'red'}
//               title={`Sensor ${sensor.id_sensor}`}
//               description={`Estado: ${sensor.estado}`}
//             />
//           ))}
//         </MapView>
//       ) : (
//         <Text style={styles.texto}>A obter localização...</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   texto: {
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 16,
//   },
// });