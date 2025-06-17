import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DataTable from '../../../components/Common/DataTable';
import { useDataStore } from '../../../store/dataStore';
import { generateGeneralPDF } from '../../../utils/pdfGenerator';
import CadastroEmpresarial from './CadastroEmpresarial';

const ConsultarEmpresarial: React.FC = () => {
  const { empresariais, deleteEmpresarial } = useDataStore();
  const [empresarialParaEditar, setEmpresarialParaEditar] = useState<any>(null);

  const columns = [
    { key: 'nomeEnvolvido', label: 'Nome' },
    { key: 'vinculoRaizen', label: 'Vínculo Raízen' },
    { key: 'setor', label: 'Setor' },
    {
      key: 'periodoInicio',
      label: 'Período Início',
      render: (value: Date) => format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })
    },
    {
      key: 'ativo',
      label: 'Ativo',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'SIM' ? 'bg-green-100 text-green-800' :
          value === 'NÃO' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'saidaDevidoOcorrencia',
      label: 'Saída por Ocorrência',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'SIM' ? 'bg-red-100 text-red-800' :
          value === 'NÃO' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    }
  ];

  const handleEdit = (empresarial: any) => {
    setEmpresarialParaEditar(empresarial);
  };

  const handleDelete = (empresarial: any) => {
    if (confirm('Tem certeza que deseja excluir este vínculo empresarial?')) {
      deleteEmpresarial(empresarial.id);
    }
  };

  const handleExport = () => {
    generateGeneralPDF('Relatório Empresarial', empresariais);
  };

  const handleCloseEdit = () => {
    setEmpresarialParaEditar(null);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={empresariais}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        searchFields={['nomeEnvolvido', 'vinculoRaizen', 'setor']}
      />
      {empresarialParaEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
            <CadastroEmpresarial empresarialEdit={empresarialParaEditar} onClose={handleCloseEdit} />
          </div>
        </div>
      )}
    </>
  );
};

export default ConsultarEmpresarial;