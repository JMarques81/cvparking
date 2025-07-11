import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Sensores from './pages/Sensores';
import Admin from './pages/Admin';
import RotaPrivada from './components/RotaPrivada';
import MapaSensores from './pages/MapaSensores';
import Dashboard from './pages/Dashboard';
import MapaRotaSimples from './pages/MapaRotaSimples';
import Utilizadores from './pages/Utilizadores';
import Ocupacoes from './pages/Ocupacoes';
import PainelInfracoes from './pages/PainelInfracoes';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="sensores" element={<Sensores />} />
          <Route path="mapa" element={<MapaSensores />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="rota-teste" element={<MapaRotaSimples />} />
          <Route path="utilizadores" element={<Utilizadores />} />
          <Route path="ocupacoes" element={<Ocupacoes />} />
          <Route path="infracoes" element={<PainelInfracoes />} />
          <Route
            path="admin"
            element={
              <RotaPrivada>
                <Admin />
              </RotaPrivada>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;