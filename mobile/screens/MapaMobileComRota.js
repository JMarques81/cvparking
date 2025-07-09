import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon } from '@turf/helpers';
import axios from 'axios';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import Modal from 'react-native-modal';
import io from 'socket.io-client';
import { API_BASE_URL } from '../constants/api';

// --- Constantes e Configurações ---
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const COORDS_PLATEAU = [
  [-23.509767, 14.915743], [-23.510262, 14.916387], [-23.510496, 14.916684],
  [-23.510365, 14.916994], [-23.510052, 14.917425], [-23.509731, 14.918019],
  [-23.509387, 14.919176], [-23.508925, 14.920162], [-23.508824, 14.920520],
  [-23.508166, 14.920998], [-23.507699, 14.921660], [-23.507025, 14.922016],
  [-23.506680, 14.922500], [-23.506245, 14.922825], [-23.505395, 14.923688],
  [-23.504744, 14.923307], [-23.505042, 14.921738], [-23.504797, 14.920762],
  [-23.504984, 14.919907], [-23.505417, 14.919081], [-23.506307, 14.919173],
  [-23.506874, 14.919234], [-23.507160, 14.918760], [-23.506967, 14.917915],
  [-23.506999, 14.916973], [-23.507494, 14.916355], [-23.508056, 14.915937],
  [-23.509749, 14.915759], [-23.509767, 14.915743],
];

const PLATEAU_CENTER = {
  latitude: 14.9165,
  longitude: -23.5096,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const SENSOR_COLORS = {
  livre: '#28a745',
  ocupado: '#dc3545',
  vaga_selecionada: '#007bff',
  destino_clicado: '#6f42c1',
  usuario: '#17a2b8',
};

export default function MapaMobileComRota() {
  const [userLocation, setUserLocation] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [route, setRoute] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [toastMessage, setToastMessage] = useState('👋 Toque em qualquer ponto da zona do Plateau para encontrar uma vaga livre próxima.');
  const [destination, setDestination] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const mapRef = useRef(null);
  const soundRef = useRef(null);
  const navigation = useNavigation();
  const debounceTimeoutRef = useRef(null);

  // --- Funções de callback otimizadas ---

  const clearRoute = useCallback(() => {
    setRoute([]);
    setDestination(null);
    setSelectedSpot(null);
    setEstimatedTime(null);
    setIsRouteLoading(false);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  const confirmParking = useCallback(() => {
    setShowConfirmModal(false);
    navigation.navigate('Estacionar', {
      screen: 'EstacionarConfirmar',
      params: { vaga: selectedSpot },
    });
    clearRoute();
  }, [selectedSpot, navigation, clearRoute]);

  const playSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        //require('../assets/sons/beep.mp3')
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (err) {
      console.warn('Erro ao tocar som:', err);
    }
  };

  const calculateRoute = useCallback(async (clickedCoordinate) => {
    clearRoute();
    setIsRouteLoading(true);
    setToastMessage('⏳ Calculando a melhor rota para você...');
    setShowHelpModal(false);

    if (
      typeof clickedCoordinate.latitude !== 'number' ||
      typeof clickedCoordinate.longitude !== 'number'
    ) {
      setToastMessage('🚫 Coordenadas de destino inválidas.');
      setTimeout(() => setToastMessage(''), 4000);
      setIsRouteLoading(false);
      return;
    }
    setDestination(clickedCoordinate);
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      console.warn('❌ Localização do utilizador inválida');
      setToastMessage('📍 Não foi possível obter sua localização atual para calcular a rota.');
      setTimeout(() => setToastMessage(''), 4000);
      setIsRouteLoading(false);
      return;
    }

    const turfPoint = point([clickedCoordinate.longitude, clickedCoordinate.latitude]);
    const turfPolygon = polygon([COORDS_PLATEAU]);
    if (!booleanPointInPolygon(turfPoint, turfPolygon)) {
      setToastMessage('🚫 Destino fora da zona de estacionamento do Plateau.');
      setTimeout(() => setToastMessage(''), 4000);
      setIsRouteLoading(false);
      return;
    }

    const availableSensors = sensors.filter(s => s.estado === 'livre');
    if (!availableSensors.length) {
      setToastMessage('😔 Nenhuma vaga livre disponível no momento.');
      setTimeout(() => setToastMessage(''), 4000);
      setIsRouteLoading(false);
      return;
    }

    if (!userLocation || typeof userLocation.latitude !== 'number' || typeof userLocation.longitude !== 'number') {
      setToastMessage('📍 Não foi possível obter sua localização atual para calcular a rota.');
      setTimeout(() => setToastMessage(''), 4000);
      setIsRouteLoading(false);
      return;
    }

    const closestSpot = availableSensors.reduce((best, current) => {
      const d1 = calculateDistance(clickedCoordinate, { lat: current.lat, lng: current.lng });
      const d2 = best ? calculateDistance(clickedCoordinate, { lat: best.lat, lng: best.lng }) : Infinity;
      return d1 < d2 ? current : best;
    }, null);

    if (
      !closestSpot || typeof closestSpot.lat !== 'number' || typeof closestSpot.lng !== 'number'
    ) {
      Alert.alert('Erro', 'Dados da vaga mais próxima inválidos.');
      setIsRouteLoading(false);
      return;
    }

    setSelectedSpot(closestSpot);

    try {

      const DIRECTIONS_API = 'https://api.openrouteservice.org/v2/directions';
      const PROFILE = 'driving-car';
      if (!PROFILE || typeof PROFILE !== 'string') {
        //throw new Error("Perfil de rota inválido");
        return;
      }


      const response = await axios.post(
        `${DIRECTIONS_API}/${PROFILE}/geojson`,
        {
          coordinates: [
            [userLocation.longitude, userLocation.latitude],
            [closestSpot.lng, closestSpot.lat],
          ]
        },
        { headers: { Authorization: '5b3ce3597851110001cf624806653c79dea6429898c1df0041e9ce71', 'Content-Type': 'application/json' } }
      );



      // const response = await axios.post(
      //   'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
      //   {
      //     coordinates: [
      //       [userLocation.longitude, userLocation.latitude],
      //       [closestSpot.lng, closestSpot.lat],
      //     ],
      //   },
      //   {
      //     headers: {
      //       Authorization: '5b3ce3597851110001cf624806653c79dea6429898c1df0041e9ce71',
      //       'Content-Type': 'application/json',
      //     },
      //   }
      // );

      const routeCoords = response.data.features[0].geometry.coordinates.map(([lng, lat]) => ({
        latitude: lat,
        longitude: lng,
      }));

      const durationSeconds = response.data.features[0].properties.segments[0].duration;
      setEstimatedTime(Math.round(durationSeconds / 60));

      setRoute(routeCoords);
      playSound();
      setToastMessage('✅ Rota calculada! Toque na vaga para estacionar.');
      // Delay showing the modal slightly after the toast
      setTimeout(() => {
        setShowConfirmModal(true);
        setToastMessage(''); // Clear toast message once modal is shown
      }, 600);

    } catch (error) {
      console.error('Erro ao obter rota:', error.response ? error.response.data : error.message);
      Alert.alert('Erro na Rota', 'Não foi possível calcular a rota para a vaga selecionada. Tente novamente.');
      setToastMessage('❌ Erro ao calcular rota. Tente novamente.');
      setTimeout(() => setToastMessage(''), 4000);
    } finally {
      setIsRouteLoading(false);
    }
  }, [clearRoute, userLocation, sensors, playSound]);

  const calculateDistance = (coordA, coordB) => {
    const dx = coordA.latitude - coordB.lat;
    const dy = coordA.longitude - coordB.lng;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleMapPressDebounced = useCallback((e) => {
    const clickedCoordinate = e.nativeEvent.coordinate;
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      calculateRoute(clickedCoordinate);
    }, 300);
  }, [calculateRoute]);

  // --- Efeitos de Lifecycle ---

  useEffect(() => {
    const getInitialLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão de Localização',
          'Permissão para acessar a localização foi negada. Algumas funcionalidades do mapa podem ser limitadas.'
        );
        // Mesmo sem permissão, mostramos o mapa no centro padrão
        setUserLocation(PLATEAU_CENTER);
        setIsLocationLoading(false); // Localização "obtida" (mesmo que seja o padrão)
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeout: 10000, // 10 segundos
        });
        const newRegion = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        setUserLocation(newRegion);

        if (mapRef.current) {
          const userPoint = point([newRegion.longitude, newRegion.latitude]);
          const plateauPolygon = polygon([COORDS_PLATEAU]);

          if (!booleanPointInPolygon(userPoint, plateauPolygon)) {
            mapRef.current.animateToRegion(newRegion, 1000);
          }
        }
      } catch (error) {
        console.error("Erro ao obter localização inicial:", error);
        Alert.alert(
          'Erro de Localização',
          'Não foi possível obter sua localização atual. Verifique as configurações de GPS.'
        );
        setUserLocation(PLATEAU_CENTER);
      } finally {
        setIsLocationLoading(false);
      }
    };
    getInitialLocation();
  }, []);

  useEffect(() => {
    const socket = io(API_BASE_URL);

    socket.emit('pedirSensores');
    socket.on('sensoresIniciais', setSensors);

    socket.on('sensorAtualizado', updatedSensor => {
      setSensors(prevSensors => {
        return prevSensors.map(sensor => {
          if (sensor._id === updatedSensor._id) {
            const isEqual =
              sensor.estado === updatedSensor.estado &&
              sensor.lat === updatedSensor.lat &&
              sensor.lng === updatedSensor.lng &&
              sensor.timestamp === updatedSensor.timestamp;

            if (isEqual) return sensor;
            return updatedSensor;
          }
          return sensor;
        });
      });

      if (
        selectedSpot &&
        updatedSensor._id === selectedSpot._id &&
        updatedSensor.estado === 'ocupado' &&
        destination
      ) {
        setToastMessage('⚠️ Sua vaga foi ocupada! Recalculando a melhor alternativa...');
        setTimeout(() => setToastMessage(''), 3000);
        calculateRoute(destination);
      }
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      socket.disconnect();
    };
  }, [selectedSpot, destination, calculateRoute]);

  // NEW: Effect to adjust map region when modal appears/disappears
  useEffect(() => {
    if (!mapRef.current) return;

    if (showConfirmModal && userLocation && selectedSpot && route.length > 0) {
      // Calculate a region that shows the entire route + user location + selected spot
      // And slightly shifts it up to clear the modal
      const coordsToFit = [
        userLocation,
        { latitude: selectedSpot.lat, longitude: selectedSpot.lng },
        ...route,
      ].filter(Boolean); // Filter out any null/undefined coordinates

      if (coordsToFit.length > 0) {
        mapRef.current.fitToCoordinates(coordsToFit, {
          edgePadding: {
            top: 50,
            right: 50,
            bottom: height * 0.35, // Adjust this based on modal height
            left: 50,
          },
          animated: true,
        });
      }
    } else if (!showConfirmModal && userLocation) {
      // When modal closes, return to user's general location or initial Plateau view
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }, 500); // Animate back quickly
    }
  }, [showConfirmModal, userLocation, selectedSpot, route]);


  return (
    <View style={styles.container}>
      {/* Toast de mensagem */}
      {toastMessage ? <Text style={styles.toast}>{toastMessage}</Text> : null}

      {/* Indicador de carregamento da rota */}
      {isRouteLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={styles.loadingText.color} />
          <Text style={styles.loadingText}>A calcular rota...</Text>
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={PLATEAU_CENTER} // Inicia no centro do Plateau
        onPress={handleMapPressDebounced}
        showsUserLocation
        mapType={mapType}
      >
        {/* Marcadores dos sensores */}
        {sensors
          .filter(s => typeof s.lat === 'number' && typeof s.lng === 'number')
          .map(s => (
            <Marker
              key={s._id}
              coordinate={{ latitude: s.lat, longitude: s.lng }}
              title={`Vaga ${s.id_sensor}`}
              description={`Estado: ${s.estado === 'livre' ? 'Livre' : 'Ocupada'}`}
              onPress={() => {
                if (s.estado === 'livre') {
                  setSelectedSpot(s);
                 
                  // Trigger calculation immediately when spot is pressed, then show modal
                  calculateRoute({ latitude: s.lat, longitude: s.lng }); // Recalculate if direct marker press
                } else {
                  setToastMessage(`🚫 Vaga ${s.id_sensor} está ocupada.`);
                  setTimeout(() => setToastMessage(''), 3000);
                }
              }}
            >
              <FontAwesome5
                name="parking"
                size={28}
                color={s.estado === 'livre' ? SENSOR_COLORS.livre : SENSOR_COLORS.ocupado}
              />
              {s.estado === 'livre' && (
                <View style={styles.availableSpotIndicator} />
              )}
            </Marker>
          ))}

        {/* Marcador para a localização atual do usuário */}
        {userLocation && userLocation.latitude && userLocation.longitude && (
          <Marker coordinate={userLocation} title="Sua Posição">
            <FontAwesome5 name="car" size={24} color={SENSOR_COLORS.usuario} />
          </Marker>
        )}

        {/* Marcador para a vaga selecionada (destino da rota) */}
        {selectedSpot && (
          <Marker coordinate={{ latitude: selectedSpot.lat, longitude: selectedSpot.lng }} title="Vaga Selecionada">
            <FontAwesome5 name="parking" size={32} color={SENSOR_COLORS.vaga_selecionada} />
          </Marker>
        )}

        {/* Marcador para o ponto de destino clicado no mapa */}
        {destination && (
          <Marker coordinate={destination} title="Destino no Mapa">
            <FontAwesome5 name="flag-checkered" size={30} color={SENSOR_COLORS.destino_clicado} />
          </Marker>
        )}

        {/* Desenha a Polyline da rota */}
        {route.length > 0 && route.every(p => typeof p.latitude === 'number' && typeof p.longitude === 'number') && (
          <Polyline
            coordinates={route}
            strokeColor={SENSOR_COLORS.vaga_selecionada}
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapView>

      {/* Indicador de carregamento de localização */}
      {isLocationLoading && (
        <View style={styles.locationLoadingIndicator}>
          <ActivityIndicator size="small" color={SENSOR_COLORS.usuario} />
          <Text style={styles.locationLoadingText}>Obtendo localização...</Text>
        </View>
      )}

      {/* Botões de Ação Flutuantes */}
      <TouchableOpacity
        onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
        style={styles.mapTypeButton}
        accessibilityLabel="Alternar tipo de mapa"
      >
        <FontAwesome5
          name={mapType === 'standard' ? 'satellite' : 'map'}
          size={20}
          color="white"
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => clearRoute()}
        style={styles.clearRouteButton}
        accessibilityLabel="Limpar rota e seleção"
      >
        <FontAwesome5 name="times" size={20} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowHelpModal(true)}
        style={styles.helpButton}
        accessibilityLabel="Abrir ajuda sobre o mapa"
      >
        <FontAwesome5 name="question-circle" size={20} color="white" />
      </TouchableOpacity>

      {/* Modais de Ajuda e Confirmação */}
      <Modal isVisible={showHelpModal} onBackdropPress={() => setShowHelpModal(false)} animationIn="fadeInUp" animationOut="fadeOutDown">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Como Usar o Mapa</Text>
          <Text style={styles.modalDescription}>
            1. Toque em qualquer ponto do mapa na **zona do Plateau** para definir seu destino.
            {"\n"}2. O aplicativo calculará a **melhor rota** para a vaga livre mais próxima.
            {"\n"}3. Confirme o estacionamento na vaga sugerida para iniciar sua sessão.
          </Text>
          <TouchableOpacity onPress={() => setShowHelpModal(false)} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Entendi</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={showConfirmModal}
        onBackdropPress={() => { setShowConfirmModal(false); clearRoute(); }}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={styles.bottomModal}
      >
        <View style={styles.confirmModalContent}>
          <Text style={styles.modalTitleConfirm}>Confirmar Estacionamento</Text>
          {estimatedTime !== null && (
            <Text style={styles.modalDescriptionSmall}>
              Tempo estimado até a vaga: <Text style={{ fontWeight: 'bold' }}>{estimatedTime} min</Text>.
            </Text>
          )}
          <Text style={styles.modalDescriptionSmall}>
            Deseja estacionar na vaga <Text style={{ fontWeight: 'bold' }}>{selectedSpot?.id_sensor}</Text>?
          </Text>
          <View style={styles.modalActions}>
            <TouchableOpacity
              onPress={confirmParking}
              style={[styles.modalButton, styles.confirmButton]}
            >
              <Text style={styles.modalButtonText}>Sim, Estacionar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setShowConfirmModal(false); clearRoute(); }}
              style={[styles.modalButton, styles.cancelButton]}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  map: {
    width: width,
    height: height,
  },
  toast: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    zIndex: 100,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: SENSOR_COLORS.vaga_selecionada,
  },
  locationLoadingIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 60,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 101,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationLoadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    backgroundColor: SENSOR_COLORS.vaga_selecionada,
    padding: 16,
    borderRadius: 50,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapTypeButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 120 : 90,
    right: 20,
    backgroundColor: '#17a2b8',
    width: 48,
    height: 48,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  clearRouteButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#dc3545',
    width: 48,
    height: 48,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  helpButton: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        bottom: 190,
      },
      android: {
        bottom: 150,
      },
    }),
    right: 20,
    backgroundColor: '#ffc107',
    padding: 14,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#343a40',
    textAlign: 'center',
  },
  modalTitleConfirm: { // NEW: Slightly smaller title for the confirmation modal
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40',
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#6c757d',
    lineHeight: 24,
  },
  modalDescriptionSmall: {
    fontSize: 14, // Slightly smaller font
    marginBottom: 8, // Reduced margin
    textAlign: 'center',
    color: '#6c757d',
    lineHeight: 18, // Reduced line height
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 10, // Reduced padding
    paddingHorizontal: 20, // Reduced padding
    borderRadius: 8, // Slightly smaller border radius
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  confirmButton: {
    backgroundColor: SENSOR_COLORS.vaga_selecionada,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15, // Slightly smaller font for button text
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  confirmModalContent: {
    backgroundColor: 'white',
    padding: 12, // Reduced padding
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 25 : 15, // Adjusted padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12,
  },
});



