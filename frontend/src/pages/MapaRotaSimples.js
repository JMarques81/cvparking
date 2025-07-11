import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import io from 'socket.io-client';

// Garantir que L.Routing está disponível
if (!L.Routing && window.L?.Routing) {
  L.Routing = window.L.Routing;
}

const iconeLivre = L.icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const iconeOcupado = L.icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const iconeOrigem = L.icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Componente que trata clique no mapa e desenha rota inicial
function RotaAoClicar({ origem, sensores, setVagaSelecionada, setDestinoClicado, rotaRef, mapRef }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  useMapEvents({
    click(e) {
      const destino = e.latlng;
      setDestinoClicado(destino);

      const vagasLivres = sensores.filter(s => s.estado === 'livre');
      if (vagasLivres.length === 0) {
        alert('Sem vagas livres disponíveis.');
        return;
      }

      const maisProxima = vagasLivres.reduce((melhor, atual) => {
        const dAtual = L.latLng(destino).distanceTo([atual.lat, atual.lng]);
        const dMelhor = melhor ? L.latLng(destino).distanceTo([melhor.lat, melhor.lng]) : Infinity;
        return dAtual < dMelhor ? atual : melhor;
      }, null);

      if (!maisProxima || !origem) return;

      setVagaSelecionada(maisProxima);

      if (rotaRef.current) map.removeControl(rotaRef.current);

      rotaRef.current = L.Routing.control({
        waypoints: [
          L.latLng(origem.lat, origem.lng),
          L.latLng(maisProxima.lat, maisProxima.lng)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: (i, wp) => {
          return L.marker(wp.latLng, {
            icon: i === 0 ? iconeOrigem : iconeLivre
          });
        }
      }).addTo(map);

      rotaRef.current.on('routesfound', e => {
        const duracao = e.routes[0].summary.totalTime;
        const min = Math.floor(duracao / 60);
        const seg = Math.round(duracao % 60);
        alert(`🕒 Tempo estimado de chegada: ${min} min ${seg} s`);
      });
    }
  });

  return null;
}

export default function MapaRotaComSensores() {
  const [localizacao, setLocalizacao] = useState(null);
  const [sensores, setSensores] = useState([]);
  const [vagaSelecionada, setVagaSelecionada] = useState(null);
  const [destinoClicado, setDestinoClicado] = useState(null);

  const rotaRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      pos => setLocalizacao({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => console.warn('⚠️ Erro ao obter localização:', err),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('connect', () => socket.emit('pedirSensores'));
    socket.on('sensoresIniciais', setSensores);
    socket.on('sensorAtualizado', sensorAtualizado => {
      setSensores(prev =>
        prev.map(s => (s._id === sensorAtualizado._id ? sensorAtualizado : s))
      );
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (!destinoClicado || sensores.length === 0 || !mapRef.current || !localizacao) return;

    const vagasLivres = sensores.filter(s => s.estado === 'livre');
    if (vagasLivres.length === 0) return;

    const maisProxima = vagasLivres.reduce((melhor, atual) => {
      const dAtual = L.latLng(destinoClicado).distanceTo([atual.lat, atual.lng]);
      const dMelhor = melhor ? L.latLng(destinoClicado).distanceTo([melhor.lat, melhor.lng]) : Infinity;
      return dAtual < dMelhor ? atual : melhor;
    }, null);

    if (!maisProxima) return;

    if (!vagaSelecionada || vagaSelecionada._id !== maisProxima._id) {
      setVagaSelecionada(maisProxima);

      if (rotaRef.current) mapRef.current.removeControl(rotaRef.current);

      rotaRef.current = L.Routing.control({
        waypoints: [
          L.latLng(localizacao.lat, localizacao.lng),
          L.latLng(maisProxima.lat, maisProxima.lng)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: (i, wp) => {
          return L.marker(wp.latLng, {
            icon: i === 0 ? iconeOrigem : iconeLivre
          });
        }
      }).addTo(mapRef.current);

      // 🔊 Notificação sonora
      const audio = new Audio('/sons/alerta.mp3'); // colocar o ficheiro na pasta public/sons/
      audio.play().catch(() => console.warn('🔈 Falha ao reproduzir som.'));

      // ⚠️ Alerta visual
      alert('⚠️ A vaga anterior foi ocupada. Rota atualizada para nova vaga livre.');

      // 🕒 Tempo estimado
      rotaRef.current.on('routesfound', e => {
        const duracao = e.routes[0].summary.totalTime;
        const min = Math.floor(duracao / 60);
        const seg = Math.round(duracao % 60);
        alert(`🕒 Tempo estimado de chegada: ${min} min ${seg} s`);
      });
    }
  }, [sensores, destinoClicado, localizacao]);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-3">🚗 Clique no mapa para traçar rota até vaga mais próxima</h3>
      <MapContainer
        center={[14.918, -23.509]}
        zoom={17}
        style={{ height: '80vh', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {localizacao && (
          <>
            <Marker position={[localizacao.lat, localizacao.lng]} icon={iconeOrigem}>
              <Popup>📍 Sua localização atual</Popup>
            </Marker>

            <RotaAoClicar
              origem={localizacao}
              sensores={sensores}
              setVagaSelecionada={setVagaSelecionada}
              setDestinoClicado={setDestinoClicado}
              rotaRef={rotaRef}
              mapRef={mapRef}
            />
          </>
        )}

        {destinoClicado && (
          <Marker position={[destinoClicado.lat, destinoClicado.lng]} icon={iconeLivre}>
            <Popup>📌 Destino selecionado</Popup>
          </Marker>
        )}

        {sensores.map(sensor => (
          <Marker
            key={sensor._id}
            position={[sensor.lat, sensor.lng]}
            icon={sensor.estado === 'livre' ? iconeLivre : iconeOcupado}
          >
            <Popup>
              <strong>ID:</strong> {sensor.id_sensor}<br />
              <strong>Estado:</strong> {sensor.estado}<br />
              <strong>Atualizado:</strong> {new Date(sensor.timestamp).toLocaleString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
