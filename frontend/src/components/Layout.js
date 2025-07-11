import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../App.css';
import { FaGlobe, FaPhone, FaEnvelope } from 'react-icons/fa';
import { ChevronDown, ChevronUp, MapPin, Trash2, Building } from 'lucide-react';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [scrolled, setScrolled] = useState(false);

  let utilizador = null;
  if (token) {
    try {
      utilizador = jwtDecode(token);
    } catch (err) {
      console.error('Token inválido:', err);
      localStorage.removeItem('token');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {!scrolled && (
        <div className="text-white py-1 px-4 fixed-top" style={{ zIndex: 1050, fontFamily: 'Poppins, sans-serif',backgroundColor:'#000', opacity:'65%' }}>
          <div className="container d-flex justify-content-end align-items-center gap-3 small">
            <span className="text-info d-flex align-items-center gap-1">
              <FaGlobe />
              <a href="https://mitsolutions.cv" target="_blank" rel="noopener noreferrer" className="text-info text-decoration-none">
                Site Oficial MIT Solutions
              </a>
            </span>
            <span className="text-info d-flex align-items-center gap-1">
              <FaPhone />
              +238 9117579
            </span>
            <span className="text-info d-flex align-items-center gap-1">
              <FaEnvelope />
              <a href="mailto:info@cvparking.cv" className="text-info text-decoration-none">
                info@cvparking.cv
              </a>
            </span>
          </div>
        </div>
      )}

      <nav
        className={`navbar navbar-expand-lg px-4 main-navbar ${scrolled ? 'scrolled' : ''}`}
        style={{
          position: 'fixed',
          top: scrolled ? '0px' : '29px',
          width: '100%',
          zIndex: 1060,
          transition: 'top 0.3s ease, background-color 0.3s ease',
          fontFamily: 'Poppins, sans-serif'
        }}
      >
        <div className="container">
          <Link className={`navbar-brand ${scrolled ? 'scrolled' : ''} text-white`} to="/">
            CVParking
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav align-items-center">
  {isHome && (
    <>
      <li className="nav-item">
        <a className="nav-link text-white" href="#sobre">Sobre nós</a>
      </li>
      <li className="nav-item dropdown custom-dropdown position-relative">
        <span className="nav-link text-white dropdown-toggle-custom" role="button">
          Soluções
          <svg className="arrow-indicator" width="10" height="10" viewBox="0 0 10 10">
            <polyline points="1,3 5,7 9,3" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        <ul className="dropdown-menu dropdown-menu-dark">
          <li><a className="dropdown-item" href="#servico-urbano">Estacionamento urbano inteligente</a></li>
          <li><a className="dropdown-item" href="#servico-privado">Estacionamento privado inteligente</a></li>
          <li><a className="dropdown-item" href="#servico-residuos">Gerenciamento inteligente de resíduos</a></li>
        </ul>
      </li>
      <li className="nav-item">
        <a className={`nav-link me-3 ${isHome ? 'text-white' : 'text-dark fw-bold'}`} href="#noticias">Notícias</a>
      </li>
      <li className="nav-item">
        <a className={`nav-link me-3 ${isHome ? 'text-white' : 'text-dark fw-bold'}`} href="#contacto">Contato</a>
      </li>
    </>
  )}

  {utilizador?.tipo === 'admin' && (
    <li className="nav-item">
      <Link className={`nav-link me-3 ${isHome ? 'text-white' : 'text-dark fw-bold'}`} to="/admin">Admin</Link>
    </li>
  )}

  {utilizador && (
    <>
      <li className={`nav-item me-3 ${isHome ? 'text-white' : 'text-dark fw-bold'}`}>
        👤 {utilizador.email || utilizador.nome}
      </li>
      <li className="nav-item">
        <button
          onClick={handleLogout}
          className={`btn ms-2 ${isHome ? 'btn-outline-light' : 'btn-outline-dark'}`}
        >
          Sair
        </button>
      </li>
    </>
  )}
</ul>

            {/* <ul className="navbar-nav align-items-center">
              {isHome && (
                <>
                  <li className="nav-item">
                    <a className="nav-link text-white" href="#sobre">Sobre nós</a>
                  </li>
             <li className="nav-item dropdown custom-dropdown position-relative">
  <span className="nav-link text-white dropdown-toggle-custom" role="button">
    Soluções
    <svg className="arrow-indicator" width="10" height="10" viewBox="0 0 10 10">
      <polyline points="1,3 5,7 9,3" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </span>
  <ul className="dropdown-menu dropdown-menu-dark">
    <li><a className="dropdown-item" href="#servico-urbano">Estacionamento urbano inteligente</a></li>
    <li><a className="dropdown-item" href="#servico-privado">Estacionamento privado inteligente</a></li>
    <li><a className="dropdown-item" href="#servico-residuos">Gerenciamento inteligente de resíduos</a></li>
  </ul>
</li>




                  <li className="nav-item">
                    <a className={`nav-link me-3 ${isHome ? 'text-white' : 'text-dark fw-bold'}`} href="#noticias">Notícias</a>

                  </li>
                  <li className="nav-item">
                    <a className={`nav-link me-3 ${isHome ? 'text-white' : 'text-dark fw-bold'}`} href="#contacto">Contato</a>
                  </li>
                </>
              )}
              {utilizador?.tipo === 'admin' && (
                <li className="nav-item">
                  <Link className={`nav-link me-3 ${isHome ? 'text-white' : 'text-dark fw-bold'}`} to="/admin">Admin</Link>
                </li>
              )}
              {utilizador && (
                <>
                  <li className="nav-item text-white me-3">👤 {utilizador.email || utilizador.nome}</li>
                  <li className="nav-item">
                    <button onClick={handleLogout} className="btn btn-outline-light ms-2">Sair</button>
                  </li>
                </>
              )}
            </ul> */}
          </div>
        </div>
      </nav>

      <div style={{ marginTop: scrolled ? '56px' : '84px', transition: 'margin-top 0.3s ease' }}>
        {isHome ? <Outlet /> : <div className="container" style={{ marginTop: '100px' }}><Outlet /></div>}
      </div>
    </>
  );
}

export default Layout;



// import React from 'react';
// import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';

// function Layout() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const token = localStorage.getItem('token');

//   let utilizador = null;

//   if (token) {
//     try {
//       utilizador = jwtDecode(token);
//     } catch (err) {
//       console.error('Token inválido:', err);
//       localStorage.removeItem('token');
//     }
//   }

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   const isHome = location.pathname === '/';

//   return (
//     <>
      
//       <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
//         <Link className="navbar-brand" to="/">CVParking</Link>
//         <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
//           <ul className="navbar-nav align-items-center">
//             {/* Links de navegação da Home */}
//             {isHome && (
//               <>
//                 <li className="nav-item">
//                   <a className="nav-link" href="#sobre">Sobre nós</a>
//                 </li>
//                 {/* <li className="nav-item">
//                   <a className="nav-link" href="#funcionalidades">Soluções</a>
//                 </li> */}
//                 <li className="nav-item dropdown">
//                   <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
//                     Soluções
//                   </a>
//                  <ul className="dropdown-menu px-2 py-1">
//   <li><a className="dropdown-item text-wrap" href="#servico-urbano">Estacionamento urbano inteligente</a></li>
//   <li><a className="dropdown-item text-wrap" href="#servico-privado">Estacionamento privado inteligente</a></li>
//   <li><a className="dropdown-item text-wrap" href="#servico-residuos">Gerenciamento inteligente de resíduos</a></li>
// </ul>


//                 </li>

//                 <li className="nav-item">
//                   <a className="nav-link" href="#noticias">Notícias</a>
//                 </li>
//                 <li className="nav-item">
//                   <a className="nav-link" href="#contacto">Contato</a>
//                 </li>
//               </>
//             )}

//             {/* Rotas autenticadas e gerais */}
//             {/* <li className="nav-item">
//               <Link className="nav-link" to="/sensores">Sensores</Link>
//             </li> */}

//             {utilizador?.tipo === 'admin' && (
//               <li className="nav-item">
//                 <Link className="nav-link" to="/admin">Admin</Link>
//               </li>
//             )}

//             {utilizador && (
//               <>
//                 <li className="nav-item text-white me-3">
//                   👤 {utilizador.email || utilizador.nome}
//                 </li>
//                 <li className="nav-item">
//                   <button onClick={handleLogout} className="btn btn-outline-light ms-2">Sair</button>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </nav>

//       {/* Renderiza outlet com ou sem container consoante a página */}
//       {isHome ? (
//         <Outlet />
//       ) : (
//         <div className="container mt-4">
//           <Outlet />
//         </div>
//       )}
//     </>
//   );
// }

// export default Layout;
