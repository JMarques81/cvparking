Iniciar o serviço wpa_supplicant com o ficheiro de configuração (/etc/wpa_supplicant/wpa_supplicant.conf)
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=CV

network={
    ssid="NOME_DA_REDE"
    psk="PALAVRA_PASSE"
}

# Mata qualquer instância anterior do wpa_supplicant
sudo killall wpa_supplicant

# Verifica se ainda há algum processo wpa ativo e mata pelo PID
ps aux | grep wpa
sudo killall wpa_supplicant
sudo kill -9 xxxx

# Desbloqueia o Wi-Fi se estiver bloqueado
sudo rfkill unblock wifi
rfkill list

# Reinicia a interface wlan0
sudo ifconfig wlan0 down
sudo ifconfig wlan0 up


# Inicia o wpa_supplicant com o ficheiro de configuração correto
sudo wpa_supplicant -B -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf

# Recarrega a configuração ativa
sudo wpa_cli -i wlan0 reconfigure

# Solicita um novo IP via DHCP
sudo dhclient wlan0

# Verifica o estado da ligação
iw wlan0 link
ip a show wlan0
iwgetid
