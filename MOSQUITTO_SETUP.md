📌 Instalação e Configuração do Broker Mosquitto (Ubuntu 22.04.5 LTS)

1️⃣ Atualizar o sistema
sudo apt update
sudo apt upgrade -y

2️⃣ Instalar Mosquitto e cliente Mosquitto
sudo apt install -y mosquitto mosquitto-clients

3️⃣ Ativar o serviço Mosquitto para iniciar automaticamente
sudo systemctl enable mosquitto
sudo systemctl start mosquito

4️⃣ Verificar o estado do serviço
sudo systemctl status mosquitto
Deve mostrar active (running).
5️⃣ Confirmar se a porta MQTT (1883) está aberta
sudo netstat -tulnp | grep 1883

6️⃣ Testar publicação de mensagem MQTT
mosquitto_pub -h localhost -t sensores/atualizar -m '{"id_sensor":"sensor_01","estado":"ocupado"}'
O backend (server.js) deve receber esta mensagem.
7️⃣ Configurar IP fixo na VM Ubuntu
Editar configuração:
sudo nano /etc/netplan/01-network-manager-all.yaml
Exemplo:
network:
  version: 2
  ethernets:
    enp0s3:
      dhcp4: no
      addresses:
        - 192.168.1.7/24
      gateway4: 192.168.1.254
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]
Aplicar:
sudo netplan apply

9️⃣ (Opcional) Configurar rede da VM em modo Bridged

No VirtualBox, define o Adaptador de Rede como `Bridged`, associado à placa de rede física do host (ex.: Intel Dual Band Wireless-AC 8265).  
Isto garante que a máquina virtual tem **IP na mesma rede local**, facilitando a comunicação MQTT entre dispositivos e o backend.
