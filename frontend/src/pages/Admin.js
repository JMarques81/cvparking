// Admin.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function Admin() {
  const [sensores, setSensores] = useState([]);
  const [erro, setErro] = useState('');
  const [nome, setNome] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [novoSensor, setNovoSensor] = useState({
    id_sensor: '', estado: '', lat: '', lng: '', timestamp: ''
  });

  const token = localStorage.getItem('token');

  const buscarSensores = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/sensores', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSensores(res.data);
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Erro ao carregar sensores.');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setNome(decoded.email || decoded.nome || 'Admin');
    }

    buscarSensores();
  }, [token, buscarSensores]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoSensor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    try {
      await axios.post('http://localhost:5000/sensores', novoSensor, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSucesso('Sensor criado com sucesso!');
      setNovoSensor({ id_sensor: '', estado: '', lat: '', lng: '', timestamp: '' });
      await buscarSensores();
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Erro ao criar sensor.');
    }
  };

  const editarSensor = async (sensor) => {
    const novoEstado = prompt(`Estado atual: ${sensor.estado}\nNovo estado (livre/ocupado):`, sensor.estado);
    const novaLat = prompt(`Latitude atual: ${sensor.lat}\nNova latitude:`, sensor.lat);
    const novaLng = prompt(`Longitude atual: ${sensor.lng}\nNova longitude:`, sensor.lng);

    try {
      await axios.put(`http://localhost:5000/sensores/${sensor._id}`, {
        estado: novoEstado,
        lat: novaLat,
        lng: novaLng
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSucesso('Sensor atualizado com sucesso!');
      await buscarSensores();
    } catch (err) {
      alert('Erro ao editar sensor.');
    }
  };

  const apagarSensor = async (id) => {
    if (!window.confirm('Deseja mesmo apagar este sensor?')) return;
    try {
      await axios.delete(`http://localhost:5000/sensores/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSucesso('Sensor apagado com sucesso.');
      await buscarSensores();
    } catch (err) {
      alert('Erro ao apagar sensor.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Bem-vindo, {nome}</h2>
      {erro && <div className="alert alert-danger">{erro}</div>}
      {sucesso && <div className="alert alert-success">{sucesso}</div>}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md">
            <input name="id_sensor" value={novoSensor.id_sensor} onChange={handleChange} className="form-control" placeholder="ID do Sensor" required />
          </div>
          <div className="col-md">
            <select name="estado" value={novoSensor.estado} onChange={handleChange} className="form-control" required>
              <option value="">-- Estado --</option>
              <option value="livre">Livre</option>
              <option value="ocupado">Ocupado</option>
            </select>
          </div>
          <div className="col-md">
            <input name="timestamp" type="datetime-local" value={novoSensor.timestamp} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md">
            <input name="lat" value={novoSensor.lat} onChange={handleChange} className="form-control" placeholder="Latitude" required />
          </div>
          <div className="col-md">
            <input name="lng" value={novoSensor.lng} onChange={handleChange} className="form-control" placeholder="Longitude" required />
          </div>
          <div className="col-md">
            <button type="submit" className="btn btn-success w-100">Adicionar</button>
          </div>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Estado</th>
              <th>Lat</th>
              <th>Lng</th>
              <th>Timestamp</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {sensores.map(s => (
              <tr key={s._id}>
                <td>{s.id_sensor}</td>
                <td className={s.estado === 'ocupado' ? 'text-danger' : 'text-success'}>{s.estado}</td>
                <td>{s.lat}</td>
                <td>{s.lng}</td>
                <td>{new Date(s.timestamp).toLocaleString()}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => editarSensor(s)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => apagarSensor(s._id)}>Apagar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
