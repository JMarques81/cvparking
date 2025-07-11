import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

export async function listarInfracoes(token) {
  return axios.get(`${API_BASE_URL}/ocupacoes?em_infracao=true`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function aplicarCoima(ocupacaoId, token) {
  return axios.put(`${API_BASE_URL}/ocupacoes/${ocupacaoId}/coima`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
