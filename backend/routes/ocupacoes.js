const express = require('express');
const router = express.Router();
const Ocupacao = require('../models/Ocupacao');
const { verificarToken, verificarAdmin } = require('../middleware/authMiddleware');

// ✅ Iniciar ocupação
router.post('/iniciar', verificarToken, async (req, res) => {
  const {
    sensor_id,
    id_sensor,
    tempo_maximo,
    matricula,
    tipo_pagamento,
    valor_a_pagar
  } = req.body;

  try {

    const novaOcupacao = new Ocupacao({
      sensor_id: new mongoose.Types.ObjectId(sensor_id), 
      id_sensor,
      utilizador_id: req.utilizador.id,
      tempo_maximo,
      matricula: matricula || null,
      tipo_pagamento: tipo_pagamento || 'pos-pago',
      valor_a_pagar: tipo_pagamento === 'pre-pago' ? valor_a_pagar || 0 : 0
    });

    await novaOcupacao.save();
    res.status(201).json({ mensagem: 'Ocupação iniciada com sucesso!', ocupacao: novaOcupacao });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao iniciar ocupação', erro: erro.message });
  }
});

// ✅ Finalizar ocupação e verificar infração ou calcular valor
router.put('/finalizar/:id_sensor', verificarToken, verificarAdmin, async (req, res) => {
  const { id_sensor } = req.params;
  const { aplicada_por, observacoes, metodo_pagamento } = req.body;

  try {
    const ocupacaoAtiva = await Ocupacao.findOne({ id_sensor, fim_ocupacao: null });

    if (!ocupacaoAtiva) {
      return res.status(404).json({ mensagem: 'Nenhuma ocupação ativa encontrada para este sensor.' });
    }

    ocupacaoAtiva.fim_ocupacao = new Date();

    const duracaoMinutos = Math.floor((ocupacaoAtiva.fim_ocupacao - ocupacaoAtiva.inicio_ocupacao) / 60000);

    if (ocupacaoAtiva.tipo_pagamento === 'pre-pago') {
      if (duracaoMinutos > ocupacaoAtiva.tempo_maximo) {
        ocupacaoAtiva.em_infracao = true;
        ocupacaoAtiva.coima_aplicada = true;
        ocupacaoAtiva.valor_coima = 1500;
        ocupacaoAtiva.aplicada_por = aplicada_por || 'sistema';
        ocupacaoAtiva.observacoes = observacoes || '';
      }
    } else {
      // pós-pago: calcular o valor a pagar
      const tarifaPorMinuto = 1; // CVE por minuto
      ocupacaoAtiva.valor_a_pagar = duracaoMinutos * tarifaPorMinuto;
    }

    ocupacaoAtiva.pagamento_realizado = true;
    ocupacaoAtiva.metodo_pagamento = metodo_pagamento || 'indefinido';

    await ocupacaoAtiva.save();
    res.json({ mensagem: 'Ocupação finalizada.', ocupacao: ocupacaoAtiva });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao finalizar ocupação', erro: erro.message });
  }
});
// ✅ Listar histórico do utilizador autenticado
router.get('/utilizador', verificarToken, async (req, res) => {
  try {
    const ocupacoes = await Ocupacao.find({ utilizador_id: req.utilizador.id })
      .sort({ createdAt: -1 });

    res.json(ocupacoes);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar histórico do utilizador', erro: erro.message });
  }
});
// ✅ Listar ocupações por sensor
router.get('/:id_sensor', verificarToken, async (req, res) => {
  try {
    const ocupacoes = await Ocupacao.find({ id_sensor: req.params.id_sensor }).sort({ createdAt: -1 });
    res.json(ocupacoes);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao listar ocupações', erro: erro.message });
  }
});

// ✅ Listar todas as ocupações
router.get('/', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const todas = await Ocupacao.find().populate('utilizador_id', 'nome email').sort({ createdAt: -1 });
    res.json(todas);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao listar todas as ocupações', erro: erro.message });
  }
});


router.put('/:id/pagar', verificarToken, async (req, res) => {
  try {
    const ocupacao = await Ocupacao.findById(req.params.id);

    if (!ocupacao || ocupacao.utilizador_id.toString() !== req.utilizador.id) {
      return res.status(403).json({ mensagem: 'Acesso negado.' });
    }

    ocupacao.pagamento_realizado = true;
    ocupacao.metodo_pagamento = 'app'; // ou 'mb', 'nfc', etc.
    await ocupacao.save();

    res.json({ mensagem: 'Pagamento efetuado com sucesso.', ocupacao });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao efetuar pagamento.', erro: err.message });
  }
});

// GET /ocupacoes/ativas → retorna ocupação atual do utilizador logado
const mongoose = require('mongoose');

router.get('/ativas', verificarToken, async (req, res) => {
  try {
    console.log("🔍 Procurando ocupação ativa do utilizador:", req.utilizador.id);

    const ocupacao = await Ocupacao.findOne({
      utilizador_id: new mongoose.Types.ObjectId(req.utilizador.id), // força ObjectId

      fim_ocupacao: null
    });

    if (ocupacao) {
      console.log("✅ Ocupação ativa encontrada:", ocupacao._id);
      res.json({ ocupacao });
    } else {
      console.log("ℹ️ Nenhuma ocupação ativa encontrada.");
      res.json({ ocupacao: null });
    }
  } catch (error) {
    console.error('❌ Erro ao buscar ocupação ativa:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar ocupação ativa' });
  }
});


module.exports = router;
