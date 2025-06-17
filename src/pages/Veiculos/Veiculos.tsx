import React, { useState } from 'react';
import { Car, Search, Plus } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import TabNavigation from '../../components/Common/TabNavigation';
import ConsultarVeiculos from './components/ConsultarVeiculos';
import CadastroVeiculo from './components/CadastroVeiculo';

const tabs = [
  { id: 'consultar', label: 'Consultar Veículos', icon: Search },
  { id: 'cadastrar', label: 'Cadastrar Veículo', icon: Plus }
];

const Veiculos: React.FC = () => {
  const [activeTab, setActiveTab] = useState('consultar');

  return (
    <div>
      <PageHeader
        title="Veículos"
        icon={Car}
        description="Gestão de veículos e automóveis"
      />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'consultar' && <ConsultarVeiculos />}
      {activeTab === 'cadastrar' && <CadastroVeiculo />}
    </div>
  );
};

export default Veiculos;