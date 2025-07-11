import React, { useEffect, useState } from 'react';
import './Home.css';

export default function HeroSection() {
  const imagensHero = [
    '/images/DJI_0273-Edit-scaled.jpg',

  ];

  const [imagemAtual, setImagemAtual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((anterior) => (anterior + 1) % imagensHero.length);
    }, 5000); // Troca de imagem a cada 5 segundos
    return () => clearInterval(intervalo);
  }, []);

  const estiloHero = {
    background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${imagensHero[imagemAtual]}') center center no-repeat`,
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    color: 'white',
    padding: '0 20px',
    textAlign: 'center',
    zIndex: 1,
    position: 'relative',
  };

  return (
    <div className="hero-container fullwidth-only">
      <div className="hero" style={estiloHero}>
        <h1>Sistema de Estacionamento Inteligente</h1>
        <p>Instale a app CVPARKING e saiba onde estacionar no Centro Histórico da Praia</p>
        <a href="/mapa" className="btn btn-primary btn-lg mt-3">Ver Vagas em Tempo Real</a>
      </div>
    </div>
  );
}
