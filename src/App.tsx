import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Ocorrencia from './pages/Ocorrencia/Ocorrencia';
import CPF from './pages/CPF/CPF';
import CNPJ from './pages/CNPJ/CNPJ';
import Imoveis from './pages/Imoveis/Imoveis';
import Veiculos from './pages/Veiculos/Veiculos';
import Telefones from './pages/Telefones/Telefones';
import RedesSociais from './pages/RedesSociais/RedesSociais';
import Financeiro from './pages/Financeiro/Financeiro';
import Empresarial from './pages/Empresarial/Empresarial';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/ocorrencia" element={<Ocorrencia />} />
                  <Route path="/cpf" element={<CPF />} />
                  <Route path="/cnpj" element={<CNPJ />} />
                  <Route path="/imoveis" element={<Imoveis />} />
                  <Route path="/veiculos" element={<Veiculos />} />
                  <Route path="/telefones" element={<Telefones />} />
                  <Route path="/redes-sociais" element={<RedesSociais />} />
                  <Route path="/financeiro" element={<Financeiro />} />
                  <Route path="/empresarial" element={<Empresarial />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;