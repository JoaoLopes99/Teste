import React, { useState } from 'react';
import { Briefcase, Search, Plus } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import TabNavigation from '../../components/Common/TabNavigation';
import ConsultarEmpresarial from './components/ConsultarEmpresarial';
import CadastroEmpresarial from './components/CadastroEmpresarial';

const tabs = [
  { id: 'consultar', label: 'Consultar Empresarial', icon: Search },
  { id: 'cadastrar', label: 'Cadastrar Vínculo', icon: Plus }
];

const Empresarial: React.FC = () => {
  const [activeTab, setActiveTab] = useState('consultar');

  return (
    <div>
      <PageHeader
        title="Empresarial"
        icon={Briefcase}
        description="Gestão de vínculos empresariais"
      />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'consultar' && <ConsultarEmpresarial />}
      {activeTab === 'cadastrar' && <CadastroEmpresarial />}
    </div>
  );
};

export default Empresarial;