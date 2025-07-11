// import React from 'react';
import './Home.css';
import React, { useEffect, useState } from 'react';
import HeroSection from './HeroSection';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  FaMapMarkedAlt,
  FaBell,
  FaChartBar,
  FaMapMarkerAlt,
  FaCogs,
  FaTools,
  FaEnvelope,
  FaRulerVertical,
  FaBroadcastTower,
  FaPhone,
  FaCity,
  FaUserShield,
  FaNewspaper,
} from 'react-icons/fa';

import './TarifasEstacionamento.css'; // cria estilos personalizados se necessário

const tarifas = [
  { titulo: 'Tempo Fraccionado', preco: '15$00', detalhe: 'Tempo mínimo de estacionamento de 15 minutos em qualquer Zona de Estacionamento de Duração Limitada.', url: '/wordpress/index.php/servicos/' },
  { titulo: 'Diário', preco: '150$00', detalhe: 'Talão diário para Estacionamento nas Zonas Diárias.', url: '/wordpress/index.php/servicos/' },
  { titulo: 'Dístico Mensal', preco: '2300$00', detalhe: 'Para trabalhadores em zonas de estacionamento de duração limitada.', url: '/wordpress/index.php/servicos/' },
  { titulo: 'Dístico Semanal', preco: '690$00', detalhe: 'Estacionamento semanal para funcionários em zonas regulamentadas.', url: '/wordpress/index.php/servicos/' },
  { titulo: 'Dístico Residente', preco: '2530$00', detalhe: 'Para residentes em áreas com estacionamento regulado.', url: '/wordpress/index.php/servicos/' },
  { titulo: 'Dístico Comerciante', preco: '28750$00', detalhe: 'Para empresas ou trabalhadores independentes com sede nas zonas reguladas.', url: '/wordpress/index.php/servicos/' },
  { titulo: 'Parque Privativo', preco: '51750$00', detalhe: 'Estacionamento exclusivo para empresas/instituições na Cidade da Praia.', url: '/wordpress/index.php/servicos/' },
  { titulo: 'Mobilidade Elétrico/Híbrido', preco: 'Gratuito', detalhe: 'Estacionamento gratuito para veículos elétricos ou híbridos.', url: '/wordpress/index.php/servicos/' },
  { titulo: 'Dístico Especial', preco: 'Gratuito', detalhe: 'Estacionamento gratuito para pessoas com mobilidade reduzida.', url: '/wordpress/index.php/servicos/' },
];

export default function Home() {



  useEffect(() => {
    const handleScrollOrResize = () => {
      const toggler = document.querySelector('.navbar-toggler');
      if (toggler) {
        const isVisible = window.getComputedStyle(toggler).display !== 'none';
        if (isVisible) {
          toggler.classList.add('text-white');
        } else {
          toggler.classList.remove('text-white');
        }
      }
    };

    // Verifica ao iniciar, ao fazer scroll e redimensionar
    handleScrollOrResize();
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize);

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const menu = document.querySelector('.navbar-collapse');
      if (window.innerWidth >= 992) {
        menu?.classList.remove('show');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <HeroSection />
      {/* Sobre */}
      <section id="sobre" className="bg-light">
        <div className="container">
          <h2 className="text-center mb-4">🅿  Sobre o Projeto</h2>
          <p className="text-center">
            O <strong>CVPARKING</strong>, em parceria com a <strong>EMEP</strong>, visa modernizar a gestão do estacionamento urbano, permitindo localizar vagas disponíveis em tempo real e reduzir a ocupação indevida de lugares públicos.
          </p>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades">
        <div className="container">
          <h2 className="text-center mb-4 d-flex align-items-center justify-content-center gap-2">
            <FaCogs /> Funcionalidades
          </h2>
          <div className="row text-center funcionalidades justify-content-center">
            <div className="col-md-4 funcional-box" style={{ backgroundImage: "url('/images/pexels-carro-smartphone.jpg')" }}>
              <h5 className="mt-3">Mapa Interativo</h5>
              <p>Visualize em tempo real as vagas livres e ocupadas com atualização automática.</p>
            </div>
            <div className="col-md-4 funcional-box" style={{ backgroundImage: "url('https://images.pexels.com/photos/6347727/pexels-photo-6347727.jpeg')" }}>
              <h5 className="mt-3">Notificações</h5>
              <p>Receba alertas sobre fim de tempo de estacionamento ou mudança de vaga.</p>
            </div>
            <div className="col-md-4 funcional-box" style={{ backgroundImage: "url('https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg')" }}>
              <h5 className="mt-3">Estatísticas</h5>
              <p>Gráficos de ocupação, infrações e utilização dos parques da cidade.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notícias */}
      <section id="noticias" className="py-5 bg-white">
        <div className="container">
          <h2 className="text-center mb-4 d-flex align-items-center justify-content-center gap-2">
            <FaNewspaper /> Últimas Notícias
          </h2>
          <p className="text-center">Acompanhe as atualizações e eventos relacionados ao sistema e à EMEP.</p>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="bg-light">
        <div className="container">
          <h2 className="text-center mb-4 d-flex align-items-center justify-content-center gap-2">
            <FaBroadcastTower /> Como Funciona
          </h2>
          <p className="text-center">
            Sensores detectam a presença de veículos e transmitem os dados via LoRaWAN até à gateway, que envia para o servidor da EMEP via MQTT. A aplicação exibe o estado em tempo real.
          </p>
        </div>
      </section>

      <section id="tarifas" className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold" style={{ fontSize: '2.5rem' }}>Tarifas de Estacionamento</h2>
          <div className="row justify-content-center">
            {tarifas.map((item, index) => (
              <div key={index} className="col-md-4 mb-4 d-flex">
                <div className="card shadow-sm flex-fill text-center border-0">
                  <div className="card-body p-4">
                    <p className="text-uppercase text-muted small mb-2">IVA incluído</p>
                    <h3 className="display-5 fw-bold text-orange mb-1">{item.preco}</h3>
                    <h5 className="card-title mt-3 fw-semibold">{item.titulo}</h5>
                    <p className="card-text small mt-2 mb-4 text-secondary">{item.detalhe}</p>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-warning px-4 rounded-pill">
                      Saber mais
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-4 d-flex align-items-center justify-content-center gap-2">
            <FaEnvelope /> Entre em Contacto
          </h2>
          <p className="text-center text-muted mb-5">Tem dúvidas ou sugestões? Preencha o formulário abaixo.</p>
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8">
              <form className="row g-3 shadow p-4 bg-white rounded">
                <div className="col-md-6">
                  <label htmlFor="nome" className="form-label">Nome</label>
                  <input type="text" className="form-control" id="nome" required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" required />
                </div>
                <div className="col-12">
                  <label htmlFor="mensagem" className="form-label">Mensagem</label>
                  <textarea className="form-control" id="mensagem" rows="5" required></textarea>
                </div>
                <div className="col-12 text-center">
                  <button type="submit" className="btn btn-primary px-5">
                    <FaEnvelope className="me-2" /> Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light pt-5 pb-3">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4 text-start">
              <h6 className="fw-light border-bottom border-secondary pb-2 mb-3 w-50">Sede</h6>
              <p className="text-secondary">Avenida Cidade da Praia, Plateau – Cabo Verde</p>
              <p className="text-secondary">
                <FaPhone /> +238 9117579
              </p>
              <p className="text-secondary small">
                <strong>Horário:</strong> Dias úteis, 8h30–13h e 14h–17h30
              </p>
              <a href="https://www.cvparking.cv" target="_blank" rel="noreferrer" className="btn btn-outline-light btn-sm mt-2 rounded-pill">
                www.cvparking.cv
              </a>
            </div>

            <div className="col-md-4 mb-4 text-start">
              <h6 className="fw-light border-bottom border-secondary pb-2 mb-3 w-50">Soluções</h6>
              <ul className="list-unstyled text-secondary">
                <li>• Estacionamento inteligente</li>
                <li>• Monitorização IoT</li>
                <li>• Gestão urbana</li>
              </ul>
            </div>

            <div className="col-md-4 mb-4 text-start">
              <h6 className="fw-light border-bottom border-secondary pb-2 mb-3 w-50">Parceiros</h6>
              <img src="/images/logo_CMPRAIA.png" alt="Parceiro CMP" width="100" className="me-2 mb-2" />
              {/* <img src="https://exolinked.com/wp-content/uploads/sites/8/2024/04/MS-Partner_2-8-1.png" alt="Microsoft Partner" width="100" /> */}
              <img src="/images/cropped-logo-4.png" alt="Microsoft Partner" width="100" />


            </div>
          </div>
          <hr className="border-secondary my-4" />
          <p className="text-center text-secondary small">© 2025 CVPARKING - Todos os direitos reservados</p>
        </div>
      </footer>
    </>
  );
}