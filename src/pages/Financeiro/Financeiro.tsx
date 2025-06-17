import React, { useState } from 'react';
import { DollarSign, Search, Plus } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import TabNavigation from '../../components/Common/TabNavigation';
import ConsultarFinanceiro from './components/ConsultarFinanceiro';
import CadastroFinanceiro from './components/CadastroFinanceiro';

const tabs = [
  { id: 'consultar', label: 'Consultar Financeiro', icon: Search },
  { id: 'cadastrar', label: 'Cadastrar Transação', icon: Plus }
];

const Financeiro: React.FC = () => {
  const [activeTab, setActiveTab] = useState('consultar');

  return (
    <div>
      <PageHeader
        title="Financeiro"
        icon={DollarSign}
        description="Gestão de transações financeiras"
      />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'consultar' && <ConsultarFinanceiro />}
      {activeTab === 'cadastrar' && <CadastroFinanceiro />}
    </div>
  );
};

export default Financeiro;