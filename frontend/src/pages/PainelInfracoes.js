import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';
import { Button, Table, Alert, Spinner } from 'react-bootstrap';

export default function PainelInfracoes() {
  const [ocupacoes, setOcupacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Buscar ocupações em infração
  useEffect(() => {
    const buscarInfracoes = async () => {
      try {
        const token = localStorage.getItem('token'); // ✅ Para web!
        const res = await axios.get(`${API_BASE_URL}/ocupacoes?em_infracao=true`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOcupacoes(res.data);
      } catch (err) {
        setErro('Erro ao buscar infrações.');
      } finally {
        setLoading(false);
      }
    };
    buscarInfracoes();
  }, []);

  const aplicarCoima = async (id) => {
    setErro('');
    setSucesso('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/ocupacoes/${id}/coima`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSucesso('Coima aplicada com sucesso.');
      setOcupacoes(prev =>
        prev.map(oc =>
          oc._id === id ? { ...oc, coima_aplicada: true } : oc
        )
      );
    } catch (err) {
      setErro('Erro ao aplicar coima.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Painel de Infrações</h2>

      {erro && <Alert variant="danger">{erro}</Alert>}
      {sucesso && <Alert variant="success">{sucesso}</Alert>}

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID Ocupação</th>
              <th>Sensor</th>
              <th>Início</th>
              <th>Tempo Máximo</th>
              <th>Coima Aplicada</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {ocupacoes.map((oc) => (
              <tr key={oc._id}>
                <td>{oc._id}</td>
                <td>{oc.id_sensor}</td>
                <td>{new Date(oc.inicio_ocupacao).toLocaleString()}</td>
                <td>{oc.tempo_maximo} min</td>
                <td>{oc.coima_aplicada ? 'Sim' : 'Não'}</td>
                <td>
                  {!oc.coima_aplicada && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => aplicarCoima(oc._id)}
                    >
                      Aplicar Coima
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
