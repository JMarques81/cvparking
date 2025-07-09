#!/bin/bash
# ============================================================
# Script de inicialização do concentrador LoRa SX1302
# Dispositivo: Raspberry Pi Zero 2 W
# ============================================================

echo "🔧 A iniciar o LoRa Packet Forwarder..."

# Navegar até à pasta onde o LoRa Packet Forwarder foi instalado
cd /home/pi/lora_sx1302

# Tornar o binário executável (opcional, mas garante)
chmod +x lora_pkt_fwd

# Executar o Packet Forwarder
./lora_pkt_fwd

# Mensagem de finalização
echo "✅ LoRa Packet Forwarder em execução."
