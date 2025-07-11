import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

export default function Utilizadores() {
  const [utilizadores, setUtilizadores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [novoUtilizador, setNovoUtilizador] = useState({
    nome: '',
    email: '',
    password: '',
    permissoes: ['publico'],
  });
  const [editando, setEditando] = useState(null);
  const [erro, setErro] = useState('');

  const token = localStorage.getItem('token');

  const fetchUtilizadores = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/utilizadores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUtilizadores(res.data);
    } catch (err) {
      console.error(err);
      setErro('Erro ao carregar utilizadores.');
    }
  };

  useEffect(() => {
    fetchUtilizadores();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      await axios.post(`${API_BASE_URL}/utilizadores`, {
        nome: novoUtilizador.nome,
        email: novoUtilizador.email,
        password: novoUtilizador.password,
        permissoes: novoUtilizador.permissoes,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      setNovoUtilizador({ nome: '', email: '', password: '', permissoes: ['publico'] });
      fetchUtilizadores();
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.mensagem || 'Erro ao criar utilizador.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem a certeza que deseja apagar este utilizador?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/utilizadores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUtilizadores();
    } catch (err) {
      console.error(err);
      alert('Erro ao apagar utilizador.');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      await axios.put(`${API_BASE_URL}/utilizadores/${editando._id}`, {
        nome: editando.nome,
        permissoes: editando.permissoes,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowEditModal(false);
      setEditando(null);
      fetchUtilizadores();
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.mensagem || 'Erro ao atualizar utilizador.');
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Gestão de Utilizadores</h2>

      <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
        + Novo Utilizador
      </Button>

      {erro && <Alert variant="danger">{erro}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Permissões</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {utilizadores.map((u) => (
            <tr key={u._id}>
              <td>{u.nome}</td>
              <td>{u.email}</td>
              <td>{u.permissoes.join(', ')}</td>
              <td>
                <Button
                  variant="secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setEditando(u);
                    setShowEditModal(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(u._id)}
                >
                  Apagar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Criar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Criar Novo Utilizador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {erro && <Alert variant="danger">{erro}</Alert>}
          <Form onSubmit={handleCreate}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={novoUtilizador.nome}
                onChange={(e) =>
                  setNovoUtilizador({ ...novoUtilizador, nome: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={novoUtilizador.email}
                onChange={(e) =>
                  setNovoUtilizador({ ...novoUtilizador, email: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={novoUtilizador.password}
                onChange={(e) =>
                  setNovoUtilizador({ ...novoUtilizador, password: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Permissões</Form.Label>
              <Form.Select
                value={novoUtilizador.permissoes[0]}
                onChange={(e) =>
                  setNovoUtilizador({ ...novoUtilizador, permissoes: [e.target.value] })
                }
              >
                <option value="publico">Público</option>
                <option value="fiscal">Fiscal</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Criar Utilizador
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Editar */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Utilizador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {erro && <Alert variant="danger">{erro}</Alert>}
          {editando && (
            <Form onSubmit={handleEdit}>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  value={editando.nome}
                  onChange={(e) =>
                    setEditando({ ...editando, nome: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Permissões</Form.Label>
                <Form.Select
                  value={editando.permissoes[0]}
                  onChange={(e) =>
                    setEditando({ ...editando, permissoes: [e.target.value] })
                  }
                >
                  <option value="publico">Público</option>
                  <option value="fiscal">Fiscal</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>

              <Button variant="primary" type="submit">
                Guardar Alterações
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
