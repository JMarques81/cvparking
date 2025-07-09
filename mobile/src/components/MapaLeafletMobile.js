import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon } from '@turf/helpers';
import axios from 'axios';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import io from 'socket.io-client';

const coordsPlateau = [
  [-23.509767, 14.915743], [-23.510262, 14.916387], [-23.510496, 14.916684],
  [-23.510365, 14.916994], [-23.510052, 14.917425], [-23.509731, 14.918019],
  [-23.509387, 14.919176], [-23.508925, 14.920162], [-23.508824, 14.920520],
  [-23.508166, 14.920998], [-23.507699, 14.921660], [-23.507025, 14.922016],
  [-23.506680, 14.922500], [-23.506245, 14.922825], [-23.505395, 14.923688],
  [-23.504744, 14.923307], [-23.505042, 14.921738], [-23.504797, 14.920762],
  [-23.504984, 14.919907], [-23.505417, 14.919081], [-23.506307, 14.919173],
  [-23.506874, 14.919234], [-23.507160, 14.918760], [-23.506967, 14.917915],
  [-23.506999, 14.916973], [-23.507494, 14.916355], [-23.508056, 14.915937],
  [-23.509749, 14.915759], [-23.509767, 14.915743]
];

export default function MapaMobileComRota() {
  const [localizacao, setLocalizacao] = useState(null);
  const [sensores, setSensores] = useState([]);
  const [rota, setRota] = useState([]);
  const [vagaSelecionada, setVagaSelecionada] = useState(null);
  const [toast, setToast] = useState('');

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
        longitudeDelta: 0.002
      });
    })();
  }, []);

  useEffect(() => {
    const socket = io('http://192.168.50.162:5000'); // <-- ALTERA para o IP real do teu backend
    socket.emit('pedirSensores');
    socket.on('sensoresIniciais', setSensores);
    socket.on('sensorAtualizado', atualizado => {
      setSensores(prev => prev.map(s => (s._id === atualizado._id ? atualizado : s)));
    });
    return () => socket.disconnect();
  }, []);

  const calcularRota = async (e) => {
    const destino = e.nativeEvent.coordinate;

    // Verificar se destino está dentro do Plateau
    const turfPoint = point([destino.longitude, destino.latitude]);
    const turfPolygon = polygon([[...coordsPlateau, coordsPlateau[0]]]);
    if (!booleanPointInPolygon(turfPoint, turfPolygon)) {
      setToast('🚫 Fora da zona do Plateau');
      setTimeout(() => setToast(''), 4000);
      return;
    }

    // Selecionar vaga livre mais próxima
    const livres = sensores.filter(s => s.estado === 'livre');
    if (!livres.length || !localizacao) return;

    const maisProxima = livres.reduce((melhor, atual) => {
      const d1 = distancia(destino, atual);
      const d2 = melhor ? distancia(destino, melhor) : Infinity;
      return d1 < d2 ? atual : melhor;
    }, null);

    setVagaSelecionada(maisProxima);

    try {
      const resposta = await axios.post(
        'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
        {
          coordinates: [
            [localizacao.longitude, localizacao.latitude],
            [maisProxima.lng, maisProxima.lat]
          ]
        },
        {
          headers: {
            Authorization: '5b3ce3597851110001cf624806653c79dea6429898c1df0041e9ce71',
            'Content-Type': 'application/json'
          }
        }
      );

      const coords = resposta.data.features[0].geometry.coordinates.map(([lng, lat]) => ({
        latitude: lat,
        longitude: lng
      }));

      setRota(coords);
    } catch (error) {
      console.error('Erro ao obter rota:', error);
      Alert.alert('Erro', 'Falha ao obter rota. Verifica a internet ou a chave API.');
    }
  };

  const distancia = (a, b) => {
    const dx = a.latitude - b.lat;
    const dy = a.longitude - b.lng;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return (
    <View style={{ flex: 1 }}>
      {toast ? <Text style={styles.toast}>{toast}</Text> : null}
      {localizacao ? (
        <MapView
          style={styles.map}
          region={localizacao}
          onPress={calcularRota}
          showsUserLocation
        >
          {sensores.map(s => (
            <Marker
              key={s._id}
              coordinate={{ latitude: s.lat, longitude: s.lng }}
              pinColor={s.estado === 'livre' ? 'green' : 'red'}
              title={`Sensor ${s.id_sensor}`}
              description={`Estado: ${s.estado}`}
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
        <Text style={styles.toast}>📍 A obter localização...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  toast: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'yellow',
    textAlign: 'center',
    zIndex: 99,
    borderRadius: 6
  }
});














// import axios from 'axios';
// import * as Location from 'expo-location';
// import { useEffect, useState } from 'react';
// import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
// import MapView, { Marker, Polyline } from 'react-native-maps';
// import io from 'socket.io-client';

// export default function MapaMobileComRota() {
//   const [localizacao, setLocalizacao] = useState(null);
//   const [sensores, setSensores] = useState([]);
//   const [rota, setRota] = useState([]);
//   const [vagaSelecionada, setVagaSelecionada] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Erro', 'Permissão de localização negada.');
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
//     const socket = io('http://192.168.50.162:5000'); // Teu IP local
//     socket.emit('pedirSensores');
//     socket.on('sensoresIniciais', setSensores);
//     socket.on('sensorAtualizado', atualizado => {
//       setSensores(prev => prev.map(s => (s._id === atualizado._id ? atualizado : s)));
//     });
//     return () => socket.disconnect();
//   }, []);

//   const calcularRota = async () => {
//     if (!localizacao || sensores.length === 0) return;

//     const vagas = sensores.filter(s => s.estado === 'livre');
//     if (vagas.length === 0) {
//       Alert.alert('Info', 'Sem vagas livres disponíveis.');
//       return;
//     }

//     const maisProxima = vagas.reduce((melhor, atual) => {
//       const d1 = distancia(localizacao, atual);
//       const d2 = melhor ? distancia(localizacao, melhor) : Infinity;
//       return d1 < d2 ? atual : melhor;
//     }, null);

//     setVagaSelecionada(maisProxima);

//     try {
//       const resposta = await axios.post(
//         'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
//         {
//           coordinates: [
//             [localizacao.longitude, localizacao.latitude],
//             [maisProxima.lng, maisProxima.lat]
//           ]
//         },
//         {
//           headers: {
//             Authorization: '5b3ce3597851110001cf624806653c79dea6429898c1df0041e9ce71',
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       const coords = resposta.data.features[0].geometry.coordinates.map(([lng, lat]) => ({
//         latitude: lat,
//         longitude: lng
//       }));

//       setRota(coords);
//     } catch (error) {
//       console.error('Erro ao obter rota:', error);
//       Alert.alert('Erro', 'Falha ao obter rota. Verifica tua chave ou a internet.');
//     }
//   };

//   function distancia(a, b) {
//     const dx = a.latitude - b.lat;
//     const dy = a.longitude - b.lng;
//     return Math.sqrt(dx * dx + dy * dy);
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       {localizacao ? (
//         <MapView
//           style={styles.map}
//           region={localizacao}
//           showsUserLocation={true}
//           onPress={calcularRota}
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

//           {vagaSelecionada && (
//             <Marker
//               coordinate={{ latitude: vagaSelecionada.lat, longitude: vagaSelecionada.lng }}
//               pinColor="blue"
//               title="Vaga selecionada"
//             />
//           )}

//           {rota.length > 0 && (
//             <Polyline coordinates={rota} strokeColor="blue" strokeWidth={4} />
//           )}
//         </MapView>
//       ) : (
//         <Text style={styles.loading}>A obter localização...</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   map: {
//     width: Dimensions.get('window').width,
//     height: Dimensions.get('window').height
//   },
//   loading: {
//     textAlign: 'center',
//     marginTop: 20
//   }
// });

// 2


// import { Dimensions, StyleSheet, View } from 'react-native';
// import { WebView } from 'react-native-webview';

// export default function MapaLeafletMobile() {
//   const largura = Dimensions.get('window').width;
//   const altura = Dimensions.get('window').height;

//   const html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8" />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
//       <style>
//         #map { height: 100vh; width: 100vw; }
//       </style>
//     </head>
//     <body>
//       <div id="map"></div>
//       <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
//       <script>
//         const map = L.map('map').setView([14.918, -23.509], 17);
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           attribution: '© OpenStreetMap'
//         }).addTo(map);

//         const sensores = [
//           { id: 'A1', lat: 14.9181, lng: -23.5091, estado: 'livre' },
//           { id: 'B1', lat: 14.9182, lng: -23.5089, estado: 'ocupado' }
//         ];

//         sensores.forEach(s => {
//           const cor = s.estado === 'livre' ? 'green' : 'red';
//           const icon = L.icon({
//             iconUrl: 'https://maps.google.com/mapfiles/ms/icons/' + cor + '-dot.png',
//             iconSize: [32, 32],
//             iconAnchor: [16, 32]
//           });
//           L.marker([s.lat, s.lng], { icon }).addTo(map)
//             .bindPopup('Sensor ' + s.id + '<br>Estado: ' + s.estado);
//         });
//       </script>
//     </body>
//     </html>
//   `;

//   return (
//     <View style={styles.container}>
//       <WebView originWhitelist={['*']} source={{ html }} style={{ width: largura, height: altura }} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 }
// });
