import React, { useState } from 'react';
import { FileText, Search, Plus } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import TabNavigation from '../../components/Common/TabNavigation';
import ConsultarOcorrencias from './components/ConsultarOcorrencias';
import NovaOcorrencia from './components/NovaOcorrencia';

const tabs = [
  { id: 'consultar', label: 'Consultar Ocorrências', icon: Search },
  { id: 'nova', label: 'Nova Ocorrência', icon: Plus }
];

const Ocorrencia: React.FC = () => {
  const [activeTab, setActiveTab] = useState('consultar');

  return (
    <div>
      <PageHeader
        title="Ocorrências"
        icon={FileText}
        description="Gestão completa de ocorrências criminais"
      />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'consultar' && <ConsultarOcorrencias />}
      {activeTab === 'nova' && <NovaOcorrencia />}
    </div>
  );
};

export default Ocorrencia;