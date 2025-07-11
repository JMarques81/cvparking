import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Table, Button, Badge, Spinner } from 'react-bootstrap';
import { API_BASE_URL } from '../constants/api';

export default function Ocupacoes() {
  const [ocupacoes, setOcupacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  const fetchOcupacoes = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get(`${API_BASE_URL}/ocupacoes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOcupacoes(res.data);
    } catch (err) {
      console.error('Erro ao carregar ocupações:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOcupacoes();

    const newSocket = io(API_BASE_URL);
    setSocket(newSocket);

    newSocket.on('ocupacaoAtualizada', (nova) => {
      setOcupacoes((prev) =>
        prev.map((o) => (o._id === nova._id ? nova : o))
      );
    });

    newSocket.on('novaOcupacao', (nova) => {
      setOcupacoes((prev) => [nova, ...prev]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [fetchOcupacoes]);

  const aplicarCoima = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (!window.confirm('Confirmar aplicação de coima?')) return;

    try {
      await axios.put(`${API_BASE_URL}/ocupacoes/${id}/coima`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOcupacoes();
    } catch (err) {
      console.error(err);
      alert('Erro ao aplicar coima.');
    }
  };

  const tempoRestante = (o) => {
    if (o.fim_ocupacao) return 'Finalizada';
    const fim = new Date(o.inicio_ocupacao).getTime() + o.tempo_maximo * 60000;
    const diff = Math.max(0, Math.floor((fim - Date.now()) / 60000));
    return `${diff} min`;
  };

  return (
    <div className="container py-5">
      <h2>🚗 Ocupações em Tempo Real</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Vaga</th>
              <th>Matrícula</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Tempo Restante</th>
              <th>Coima</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ocupacoes.map((o) => (
              <tr key={o._id}>
                <td>{o.id_sensor}</td>
                <td>{o.matricula || 'N/A'}</td>
                <td>{new Date(o.inicio_ocupacao).toLocaleString()}</td>
                <td>{o.fim_ocupacao ? new Date(o.fim_ocupacao).toLocaleString() : '---'}</td>
                <td>{tempoRestante(o)}</td>
                <td>
                  {o.em_infracao ? (
                    <Badge bg="danger">Em Infração</Badge>
                  ) : (
                    <Badge bg="success">OK</Badge>
                  )}
                </td>
                <td>
                  {!o.em_infracao && (
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => aplicarCoima(o._id)}
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
