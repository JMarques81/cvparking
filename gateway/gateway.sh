#!/bin/bash
# ============================================================
# Script principal de configuração do Gateway LoRaWAN
# Dispositivo: Raspberry Pi Zero 2 W + Concentrador SX1302
# ============================================================

echo "🔧 Iniciando configuração do Gateway LoRaWAN..."

# 1️⃣ Ativar SPI
echo "Ativando SPI..."
sudo raspi-config nonint do_spi 0
if [ $? -eq 0 ]; then
  echo "SPI ativado."
else
  echo "Erro ao ativar SPI."
  exit 1
fi

# 2️⃣ Iniciar concentrador SX1302
echo "Iniciando concentrador SX1302..."
./start_concentrator.sh
if [ $? -eq 0 ]; then
  echo "Concentrador iniciado."
else
  echo "Erro ao iniciar concentrador."
  exit 1
fi

# 3️⃣ Iniciar broker Mosquitto
echo "Iniciando broker Mosquitto..."
sudo systemctl start mosquitto
if [ $? -eq 0 ]; then
  echo "Mosquitto iniciado."
else
  echo "Erro ao iniciar Mosquitto."
  exit 1
fi

echo "Configuração concluída com sucesso."

