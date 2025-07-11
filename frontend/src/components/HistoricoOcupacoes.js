import { useEffect, useState } from 'react';
import axios from 'axios';

function HistoricoOcupacoes() {
  const [ocupacoes, setOcupacoes] = useState([]);
  const [ocupacoesFiltradas, setOcupacoesFiltradas] = useState([]);
  const [sensores, setSensores] = useState([]);
  const [sensorSelecionado, setSensorSelecionado] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [erro, setErro] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/sensores/publico')
      .then(res => {
        setSensores(res.data);
        if (res.data.length > 0) {
          setSensorSelecionado(res.data[0].id_sensor);
        }
      })
      .catch(err => {
        console.error(err);
        setErro("Erro ao carregar sensores.");
      });
  }, []);

  useEffect(() => {
    if (!sensorSelecionado) return;

    axios.get(`http://localhost:5000/ocupacoes/${sensorSelecionado}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        setOcupacoes(res.data);
        setOcupacoesFiltradas(res.data);
      })
      .catch(err => {
        console.error(err);
        setErro("Erro ao carregar histórico.");
      });
  }, [sensorSelecionado]);

  useEffect(() => {
    if (!dateStart && !dateEnd) {
      setOcupacoesFiltradas(ocupacoes);
    } else {
      const inicio = dateStart ? new Date(dateStart) : new Date('2000-01-01');
      const fim = dateEnd ? new Date(dateEnd) : new Date('2100-12-31');

      const filtradas = ocupacoes.filter(o => {
        const inicioOc = new Date(o.inicio_ocupacao);
        return inicioOc >= inicio && inicioOc <= fim;
      });

      setOcupacoesFiltradas(filtradas);
    }
  }, [dateStart, dateEnd, ocupacoes]);

  return (
    <div className="container mt-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h4 className="mb-0">📋 Histórico de Ocupações</h4>
        <select className="form-select w-auto" value={sensorSelecionado} onChange={e => setSensorSelecionado(e.target.value)}>
          {sensores.map((s, i) => (
            <option key={i} value={s.id_sensor}>{s.id_sensor.toUpperCase()}</option>
          ))}
        </select>
        <input type="date" className="form-control w-auto" value={dateStart} onChange={e => setDateStart(e.target.value)} />
        <input type="date" className="form-control w-auto" value={dateEnd} onChange={e => setDateEnd(e.target.value)} />
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>Início</th>
              <th>Fim</th>
              <th>Matrícula</th>
              <th>Infração</th>
              <th>Coima</th>
              <th>Responsável</th>
            </tr>
          </thead>
          <tbody>
            {ocupacoesFiltradas.map((o, i) => (
              <tr key={i} className={o.em_infracao ? 'table-danger' : ''}>
                <td>{new Date(o.inicio_ocupacao).toLocaleString()}</td>
                <td>{o.fim_ocupacao ? new Date(o.fim_ocupacao).toLocaleString() : <span className="text-warning">Ativa</span>}</td>
                <td>{o.matricula || '-'}</td>
                <td>{o.em_infracao ? '✅' : '❌'}</td>
                <td>{o.coima_aplicada ? `${o.valor_coima} CVE` : '-'}</td>
                <td>{o.aplicada_por || '-'}</td>
              </tr>
            ))}
            {ocupacoesFiltradas.length === 0 && (
              <tr>
                <td colSpan="6">Nenhuma ocupação no intervalo selecionado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoricoOcupacoes;


// import { useEffect, useState } from 'react';
// import axios from 'axios';

// function HistoricoOcupacoes() {
//   const [ocupacoes, setOcupacoes] = useState([]);
//   const [sensores, setSensores] = useState([]);
//   const [sensorSelecionado, setSensorSelecionado] = useState('');
//   const [carregando, setCarregando] = useState(false);
//   const [erro, setErro] = useState(null);

//   useEffect(() => {
//     // Carrega a lista de sensores públicos ao iniciar
//     axios.get('http://localhost:5000/sensores/publico')
//       .then(res => {
//         setSensores(res.data);
//         if (res.data.length > 0) {
//           setSensorSelecionado(res.data[0].id_sensor);
//         }
//       })
//       .catch(err => {
//         console.error(err);
//         setErro("Erro ao carregar sensores.");
//       });
//   }, []);

//   useEffect(() => {
//     if (!sensorSelecionado) return;

//     setCarregando(true);
//     axios.get(`http://localhost:5000/ocupacoes/${sensorSelecionado}`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//       .then(res => setOcupacoes(res.data))
//       .catch(err => {
//         console.error(err);
//         setErro("Erro ao carregar histórico.");
//       })
//       .finally(() => setCarregando(false));
//   }, [sensorSelecionado]);

//   return (
//     <div className="container mt-5">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h4 className="mb-0">📋 Histórico de Ocupações</h4>
//         <select className="form-select w-auto" value={sensorSelecionado} onChange={e => setSensorSelecionado(e.target.value)}>
//           {sensores.map((s, i) => (
//             <option key={i} value={s.id_sensor}>
//               {s.id_sensor.toUpperCase()}
//             </option>
//           ))}
//         </select>
//       </div>

//       {erro && <div className="alert alert-danger">{erro}</div>}

//       {carregando ? (
//         <div className="text-center mt-4">
//           <div className="spinner-border text-primary" role="status" />
//           <p className="mt-2">A carregar histórico...</p>
//         </div>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-striped table-bordered align-middle text-center">
//             <thead className="table-dark">
//               <tr>
//                 <th>Início</th>
//                 <th>Fim</th>
//                 <th>Matrícula</th>
//                 <th>Infração</th>
//                 <th>Coima</th>
//                 <th>Responsável</th>
//               </tr>
//             </thead>
//             <tbody>
//               {ocupacoes.map((o, i) => (
//                 <tr key={i} className={o.em_infracao ? 'table-danger' : ''}>
//                   <td>{new Date(o.inicio_ocupacao).toLocaleString()}</td>
//                   <td>
//                     {o.fim_ocupacao
//                       ? new Date(o.fim_ocupacao).toLocaleString()
//                       : <span className="badge bg-warning text-dark">Ativa</span>}
//                   </td>
//                   <td>{o.matricula || '-'}</td>
//                   <td>{o.em_infracao ? '✅' : '❌'}</td>
//                   <td>{o.coima_aplicada ? `${o.valor_coima} CVE` : '-'}</td>
//                   <td>{o.aplicada_por || '-'}</td>
//                 </tr>
//               ))}
//               {ocupacoes.length === 0 && (
//                 <tr>
//                   <td colSpan="6">Nenhuma ocupação encontrada para este sensor.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default HistoricoOcupacoes;
