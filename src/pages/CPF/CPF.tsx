import React, { useState } from 'react';
import { User, Search, Plus, Share2 } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import TabNavigation from '../../components/Common/TabNavigation';
import ConsultarCPF from './components/ConsultarCPF';
import CadastroCPF from './components/CadastroCPF';
import QuadroCriminal from './components/QuadroCriminal';

const tabs = [
  { id: 'consultar', label: 'Consultar CPF', icon: Search },
  { id: 'quadro', label: 'Quadro Criminal', icon: Share2 },
  { id: 'cadastrar', label: 'Cadastrar CPF', icon: Plus }
];

const CPF: React.FC = () => {
  const [activeTab, setActiveTab] = useState('consultar');

  return (
    <div>
      <PageHeader
        title="CPF"
        icon={User}
        description="Gestão de pessoas e vínculos criminais"
      />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'consultar' && <ConsultarCPF />}
      {activeTab === 'quadro' && <QuadroCriminal />}
      {activeTab === 'cadastrar' && <CadastroCPF />}
    </div>
  );
};

export default CPF;