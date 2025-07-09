require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const mqtt = require('mqtt');
const Sensor = require('./models/Sensor');

const authRoutes = require('./routes/auth');
const sensoresRoutes = require('./routes/sensores');
const spotsRoutes = require('./routes/spots');
const parkingRoutes = require('./routes/parking');
const ocupacoesRoutes = require('./routes/ocupacoes');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/sensores', sensoresRoutes);
app.use('/spots', spotsRoutes);
app.use('/parking', parkingRoutes);
app.use('/ocupacoes', ocupacoesRoutes);


// WebSocket
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: '*' }
});
app.set('io', io);

io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado via WebSocket');

  socket.on('pedirSensores', () => {
    Sensor.find().then(sensores => {
      socket.emit('sensoresIniciais', sensores);
    });
  });

  socket.on('simularSensor', (sensorAtualizado) => {
    Sensor.findByIdAndUpdate(sensorAtualizado._id, sensorAtualizado, { new: true })
      .then(novo => {
        io.emit('sensorAtualizado', novo);
      });
  });
});

// Middleware global para emissão após rotas
app.use(async (req, res, next) => {
  res.on('finish', async () => {
    if (req.method === 'POST' && req.originalUrl.includes('/sensores')) {
      const sensores = await Sensor.find();
      io.emit('sensoresIniciais', sensores);
    }

    if (req.method === 'PUT' && req.originalUrl.includes('/sensores/')) {
      const id = req.originalUrl.split('/').pop();
      const sensor = await Sensor.findById(id);
      if (sensor) io.emit('sensorAtualizado', sensor);
    }

    if (req.method === 'DELETE' && req.originalUrl.includes('/sensores/')) {
      const id = req.originalUrl.split('/').pop();
      io.emit('sensorRemovido', id);
    }
  });
  next();
});

// Conectar ao broker MQTT
const mqttClient = mqtt.connect('mqtt://localhost:1883');

mqttClient.on('connect', () => {
  console.log('📡 Conectado ao broker MQTT');
  mqttClient.subscribe('sensores/atualizar', (err) => {
    if (err) {
      console.error('❌ Erro ao subscrever ao tópico:', err);
    } else {
      console.log('🟢 Subscrito ao tópico sensores/atualizar');
    }
  });
});

mqttClient.on('message', async (topic, message) => {
  if (topic === 'sensores/atualizar') {
    try {
      const dados = JSON.parse(message.toString());
      console.log('📥 Mensagem MQTT recebida:', dados);

      let sensor = null;

      // 1️⃣ Tenta atualizar por _id
      if (dados._id && mongoose.Types.ObjectId.isValid(dados._id)) {
        sensor = await Sensor.findByIdAndUpdate(
          new mongoose.Types.ObjectId(dados._id),
          {
            estado: dados.estado,
            timestamp: dados.timestamp ? new Date(dados.timestamp) : new Date()
          },
          { new: true }
        );
      }

      // 2️⃣ Se não encontrou, tenta por id_sensor
      if (!sensor && dados.id_sensor) {
        sensor = await Sensor.findOneAndUpdate(
          { id_sensor: dados.id_sensor },
          {
            estado: dados.estado,
            timestamp: dados.timestamp ? new Date(dados.timestamp) : new Date()
          },
          { new: true }
        );
      }

      // 3️⃣ Se ainda não encontrou, apenas avisa e não cria
      if (!sensor) {
        console.warn(`⚠️ Sensor não encontrado. Ignorado.`);
        return;
      }

      console.log(`✅ Sensor atualizado: ${sensor.id_sensor}`);
      io.emit('sensorAtualizado', sensor);

    } catch (erro) {
      console.error('❌ Erro ao processar mensagem MQTT:', erro.message);
    }
  }
});


// MongoDB
mongoose.connect("mongodb://localhost:27017/estacionamento_inteligente")
  .then(() => console.log("✅ MongoDB conectado com sucesso!"))
  .catch(err => console.error("❌ Erro ao conectar ao MongoDB:", err));

// Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor a correr na porta ${PORT}`);
});
