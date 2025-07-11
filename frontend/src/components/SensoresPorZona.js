import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SensoresPorZona({ zona }) {
  const [sensores, setSensores] = useState([]);

 useEffect(() => {
  // const fetchData = () => {
  //    const token = localStorage.getItem('token'); // LÊ o token guardado

  //   axios.get(`http://localhost:5000/spots/zona/${zona}`, {
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //     }
  //   })
  //   .then(res => setSensores(res.data))
  //   .catch(err => {
  //     console.error('Erro ao buscar sensores:', err);
  //     setSensores([]);
  //   });
  // };
const fetchData = () => {
  axios.get(`http://localhost:5000/sensores/publico`) // <- rota sem token
    .then(res => setSensores(res.data))
    .catch(err => {
      console.error('Erro ao buscar sensores públicos:', err);
      setSensores([]);
    });
};
  fetchData();
  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval);
}, [zona])


  return (
    <div>
      <h2>Sensores na Zona {zona}</h2>
      {sensores.length === 0 ? (
        <p>⚠️ Erro ao carregar os sensores.</p>
      ) : (
        <ul>
         {sensores.map(sensor => (
          <li key={sensor._id}>
            {sensor.nome || 'Sensor'} - Estado: {sensor.estado}
          </li>
        ))}

        </ul>
      )}
    </div>
  );
}

export default SensoresPorZona;
