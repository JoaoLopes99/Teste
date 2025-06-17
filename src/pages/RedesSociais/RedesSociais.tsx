import React, { useState } from 'react';
import { MessageSquare, Search, Plus } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import TabNavigation from '../../components/Common/TabNavigation';
import ConsultarRedesSociais from './components/ConsultarRedesSociais';
import CadastroRedeSocial from './components/CadastroRedeSocial';

const tabs = [
  { id: 'consultar', label: 'Consultar Redes Sociais', icon: Search },
  { id: 'cadastrar', label: 'Cadastrar Rede Social', icon: Plus }
];

const RedesSociais: React.FC = () => {
  const [activeTab, setActiveTab] = useState('consultar');

  return (
    <div>
      <PageHeader
        title="Redes Sociais"
        icon={MessageSquare}
        description="Gestão de perfis e redes sociais"
      />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'consultar' && <ConsultarRedesSociais />}
      {activeTab === 'cadastrar' && <CadastroRedeSocial />}
    </div>
  );
};

export default RedesSociais;