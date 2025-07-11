import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function GraficoInfracoes() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    async function carregarInfracoes() {
      try {
        const sensoresRes = await axios.get('http://localhost:5000/sensores/publico');
        const sensores = sensoresRes.data;

        const resultados = await Promise.all(
          sensores.map(async (sensor) => {
            const res = await axios.get(`http://localhost:5000/ocupacoes/${sensor.id_sensor}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            const infracoes = res.data.filter(o => o.em_infracao).length;
            return {
              sensor: sensor.id_sensor,
              infracoes
            };
          })
        );

        setDados(resultados);
      } catch (err) {
        console.error('Erro ao carregar dados de infrações:', err);
      }
    }

    carregarInfracoes();
  }, []);

  return (
    <div className="card mt-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title text-center">📉 Infrações por Sensor</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sensor" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="infracoes" fill="#dc3545" name="Infrações" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GraficoInfracoes;
