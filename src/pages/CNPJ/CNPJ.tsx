import React, { useState } from 'react';
import { Building2, Search, Plus } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import TabNavigation from '../../components/Common/TabNavigation';
import ConsultarCNPJ from './components/ConsultarCNPJ';
import CadastroCNPJ from './components/CadastroCNPJ';

const tabs = [
  { id: 'consultar', label: 'Consultar CNPJ', icon: Search },
  { id: 'cadastrar', label: 'Cadastrar CNPJ', icon: Plus }
];

const CNPJ: React.FC = () => {
  const [activeTab, setActiveTab] = useState('consultar');

  return (
    <div>
      <PageHeader
        title="CNPJ"
        icon={Building2}
        description="Gestão de empresas e pessoas jurídicas"
      />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'consultar' && <ConsultarCNPJ />}
      {activeTab === 'cadastrar' && <CadastroCNPJ />}
    </div>
  );
};

export default CNPJ;