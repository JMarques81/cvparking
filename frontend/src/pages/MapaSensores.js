import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon } from '@turf/helpers';
import { LayersControl } from 'react-leaflet';
const { BaseLayer } = LayersControl;

if (!L.Routing && window.L?.Routing) {
  L.Routing = window.L.Routing;
}

const iconeLivre = L.icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const iconeOcupado = L.icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const iconeOrigem = L.icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const coordsPlateau = [
  [-23.509767544523925, 14.915743381322798],
  [-23.51026226266444, 14.916387382137728],
  [-23.51049635797537, 14.91668425919893],
  [-23.510365927029966, 14.91699415160764],
  [-23.51005278886487, 14.917425666715147],
  [-23.5097313782438, 14.9180197508595],
  [-23.509387968156716, 14.919176699807693],
  [-23.50892564635555, 14.920162993485278],
  [-23.50882432262202, 14.920520004999716],
  [-23.508166695532452, 14.920998224146658],
  [-23.507699762688787, 14.921660785360416],
  [-23.50702534902426, 14.922016956240931],
  [-23.506680538161987, 14.922500185647024],
  [-23.506245687210452, 14.922825723588488],
  [-23.505395053257814, 14.92368833453476],
  [-23.50474403469437, 14.923307313756197],
  [-23.505042219034266, 14.921738293468167],
  [-23.504797800290078, 14.920762702190714],
  [-23.504984528713777, 14.919907581074014],
  [-23.505417456771852, 14.919081989176988],
  [-23.506307608138258, 14.919173039595279],
  [-23.506874874597173, 14.919234721733318],
  [-23.507160100539636, 14.918760680156367],
  [-23.506967870587346, 14.917915683914018],
  [-23.506999381149598, 14.916973849181403],
  [-23.507494486001605, 14.916355543968194],
  [-23.508056088129507, 14.915937048968814],
  [-23.509749227997276, 14.915759474814266],
  [-23.509767544523925, 14.915743381322798]
];

export default function MapaRotaComSensores() {
  const [localizacao, setLocalizacao] = useState(null);
  const [sensores, setSensores] = useState([]);
  const [vagaSelecionada, setVagaSelecionada] = useState(null);
  const [destinoClicado, setDestinoClicado] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [eta, setETA] = useState('');

  const rotaRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      pos => {
        setLocalizacao({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      err => {
        console.warn('Erro localização:', err);
      },
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
        waypoints: [L.latLng(localizacao.lat, localizacao.lng), L.latLng(maisProxima.lat, maisProxima.lng)],
        routeWhileDragging: false,
        addWaypoints: false,
        show: false,
        createMarker: (i, wp) => {
          if (i === 0) return L.marker(wp.latLng, { icon: iconeOrigem });
          const sensor = sensores.find(s => s.lat === wp.latLng.lat && s.lng === wp.latLng.lng);
          const icon = sensor?.estado === 'livre' ? iconeLivre : iconeOcupado;
          return L.marker(wp.latLng, { icon });
        }
      }).addTo(mapRef.current);

      new Audio('/sons/alerta.mp3').play().catch(() => { });
      setToastMsg('🔄 A recalcular rota para vaga mais próxima...');
      setTimeout(() => setToastMsg(''), 5000);

      rotaRef.current.on('routesfound', e => {
        const duracao = e.routes[0].summary.totalTime;
        const min = Math.floor(duracao / 60);
        const seg = Math.round(duracao % 60);
        setETA(`${min} min ${seg} s`);
        setTimeout(() => setETA(''), 5000);
      });
    }
  }, [sensores, destinoClicado, localizacao]);

  function RotaAoClicar() {
    const map = useMap();
    useEffect(() => { mapRef.current = map; }, [map]);

    useMapEvents({
      click(e) {
        const destino = e.latlng;
        const turfPoint = point([destino.lng, destino.lat]);
        const turfPolygon = polygon([[...coordsPlateau, coordsPlateau[0]]]);

        if (!booleanPointInPolygon(turfPoint, turfPolygon)) {
          setToastMsg('🚫 O destino está fora do Plateau.');
          setTimeout(() => setToastMsg(''), 4000);
          return;
        }

        setDestinoClicado(destino);
      }
    });

    return null;
  }

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-3">🚗 Clique no mapa para selecionar o destino e traçar a rota até à vaga livre mais próxima.</h3>

      {toastMsg && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show bg-warning text-dark" role="alert">
            <div className="toast-body">{toastMsg}</div>
          </div>
        </div>
      )}

      {eta && (
        <div className="position-fixed bottom-0 start-0 p-3 bg-light border rounded shadow">
          <strong>🕒 Tempo estimado:</strong> {eta}
        </div>
      )}

      <MapContainer center={[14.918, -23.509]} zoom={17} style={{ height: '80vh', width: '100%' }}>
        {/* <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
        <LayersControl position="topright">
          <BaseLayer checked name="Satélite (ESRI)">
            <TileLayer
              attribution='Tiles © Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>
          <BaseLayer name="Mapa Normal">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
        </LayersControl>

        {localizacao && (
          <>
            <Marker position={[localizacao.lat, localizacao.lng]} icon={iconeOrigem}>
              <Popup>📍 Sua localização atual</Popup>
            </Marker>
            <RotaAoClicar />
          </>
        )}

        {destinoClicado && (
          <Marker position={[destinoClicado.lat, destinoClicado.lng]} icon={iconeOrigem}>
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
