import React, { useState } from 'react';
import DataTable from '../../../components/Common/DataTable';
import { useDataStore } from '../../../store/dataStore';
import { generateGeneralPDF } from '../../../utils/pdfGenerator';
import CadastroCNPJ from './CadastroCNPJ';

const ConsultarCNPJ: React.FC = () => {
  const { cnpjs, deleteCNPJ } = useDataStore();
  const [cnpjParaEditar, setCnpjParaEditar] = useState<any>(null);

  const columns = [
    { key: 'cnpj', label: 'CNPJ' },
    { key: 'nomeEmpresa', label: 'Nome da Empresa' },
    { key: 'tipologia', label: 'Tipologia' },
    { key: 'nomeVinculoPrimario', label: 'Vínculo Primário' },
    {
      key: 'campoTexto',
      label: 'Observações',
      render: (value: string) => value ? value.substring(0, 50) + '...' : 'Nenhuma'
    }
  ];

  const handleEdit = (cnpj: any) => {
    setCnpjParaEditar(cnpj);
  };

  const handleDelete = (cnpj: any) => {
    if (confirm('Tem certeza que deseja excluir este CNPJ?')) {
      deleteCNPJ(cnpj.id);
    }
  };

  const handleExport = () => {
    generateGeneralPDF('Relatório de CNPJs', cnpjs);
  };

  const handleCloseEdit = () => {
    setCnpjParaEditar(null);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={cnpjs}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        searchFields={['cnpj', 'nomeEmpresa', 'tipologia']}
      />
      {cnpjParaEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
            <CadastroCNPJ cnpjEdit={cnpjParaEditar} onClose={handleCloseEdit} />
          </div>
        </div>
      )}
    </>
  );
};

export default ConsultarCNPJ;