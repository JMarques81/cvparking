import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip,
} from 'recharts';
import HistoricoOcupacoes from '../components/HistoricoOcupacoes';
import GraficoInfracoes from '../components/GraficoInfracoes';

const COLORS = ['#0088FE', '#FF8042'];

function Dashboard() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/sensores/publico')
      .then(res => setDados(res.data))
      .catch(err => console.error('Erro ao buscar sensores:', err));
  }, []);

  const total = dados.length;
  const livres = dados.filter(s => s.estado === 'livre').length;
  const ocupados = total - livres;

  const pieData = [
    { name: 'Livre', value: livres },
    { name: 'Ocupado', value: ocupados }
  ];

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">📊 Dashboard do Estacionamento Inteligente</h2>

      <div className="row mb-5">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Sensores: Livre vs Ocupado</h5>
              <PieChart width={300} height={300}>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Resumo total</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Total de sensores: {total}</li>
                <li className="list-group-item">Ocupados: {ocupados}</li>
                <li className="list-group-item">Livres: {livres}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <HistoricoOcupacoes />
      <GraficoInfracoes />
    </div>
  );
}

export default Dashboard;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   PieChart, Pie, Cell, Tooltip,
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer
// } from 'recharts';

// const COLORS = ['#0088FE', '#FF8042'];

// function Dashboard() {
//   const [dados, setDados] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:5000/sensores/publico')
//       .then(res => setDados(res.data))
//       .catch(err => console.error('Erro ao buscar sensores:', err));
//   }, []);

//   const total = dados.length;
//   const livres = dados.filter(s => s.estado === 'livre').length;
//   const ocupados = total - livres;

//   const pieData = [
//     { name: 'Livre', value: livres },
//     { name: 'Ocupado', value: ocupados }
//   ];

//   return (
//     <div>
//       <h2 className="mb-3">Dashboard</h2>

//       <div className="row">
//         <div className="col-md-6">
//           <h5>Sensores: Livre vs Ocupado</h5>
//           <PieChart width={300} height={300}>
//             <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
//               {pieData.map((entry, index) => (
//                 <Cell key={index} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//         </div>

//         <div className="col-md-6">
//           <h5>Resumo total</h5>
//           <ul className="list-group">
//             <li className="list-group-item">Total de sensores: {total}</li>
//             <li className="list-group-item">Ocupados: {ocupados}</li>
//             <li className="list-group-item">Livres: {livres}</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
