// services/ocupacaoService.js
import axios from 'axios';

const API_BASE = 'http://localhost:5000/ocupacoes';

export const finalizarOcupacao = async (id_sensor, fim_ocupacao) => {
  try {
    const response = await axios.put(`${API_BASE}/finalizar/${id_sensor}`, {
      fim_ocupacao
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao finalizar ocupação:', error);
    throw error;
  }
};
