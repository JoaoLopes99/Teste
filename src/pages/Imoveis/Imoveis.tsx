import React, { useState } from 'react';
import { Home, Search, Plus } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import TabNavigation from '../../components/Common/TabNavigation';
import ConsultarImoveis from './components/ConsultarImoveis';
import CadastroImovel from './components/CadastroImovel';

const tabs = [
  { id: 'consultar', label: 'Consultar Imóveis', icon: Search },
  { id: 'cadastrar', label: 'Cadastrar Imóvel', icon: Plus }
];

const Imoveis: React.FC = () => {
  const [activeTab, setActiveTab] = useState('consultar');

  return (
    <div>
      <PageHeader
        title="Imóveis"
        icon={Home}
        description="Gestão de imóveis e propriedades"
      />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'consultar' && <ConsultarImoveis />}
      {activeTab === 'cadastrar' && <CadastroImovel />}
    </div>
  );
};

export default Imoveis;