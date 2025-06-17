import React, { useState } from 'react';
import { Phone, Search, Plus } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import TabNavigation from '../../components/Common/TabNavigation';
import ConsultarTelefones from './components/ConsultarTelefones';
import CadastroTelefone from './components/CadastroTelefone';

const tabs = [
  { id: 'consultar', label: 'Consultar Telefones', icon: Search },
  { id: 'cadastrar', label: 'Cadastrar Telefone', icon: Plus }
];

const Telefones: React.FC = () => {
  const [activeTab, setActiveTab] = useState('consultar');

  return (
    <div>
      <PageHeader
        title="Telefones"
        icon={Phone}
        description="Gestão de telefones e comunicações"
      />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'consultar' && <ConsultarTelefones />}
      {activeTab === 'cadastrar' && <CadastroTelefone />}
    </div>
  );
};

export default Telefones;