import React, { useState } from 'react';
import DataTable from '../../../components/Common/DataTable';
import { useDataStore } from '../../../store/dataStore';
import { generateGeneralPDF } from '../../../utils/pdfGenerator';
import CadastroImovel from './CadastroImovel';

const ConsultarImoveis: React.FC = () => {
  const { imoveis, deleteImovel } = useDataStore();
  const [imovelParaEditar, setImovelParaEditar] = useState<any>(null);

  const columns = [
    { key: 'imovel', label: 'Imóvel' },
    { key: 'tipoVinculo', label: 'Tipo de Vínculo' },
    { key: 'endereco', label: 'Endereço' },
    { key: 'cidade', label: 'Cidade' },
    { key: 'estado', label: 'Estado' },
    { key: 'nomeVinculoPrimario', label: 'Vínculo Primário' }
  ];

  const handleEdit = (imovel: any) => {
    setImovelParaEditar(imovel);
  };

  const handleDelete = (imovel: any) => {
    if (confirm('Tem certeza que deseja excluir este imóvel?')) {
      deleteImovel(imovel.id);
    }
  };

  const handleExport = () => {
    generateGeneralPDF('Relatório de Imóveis', imoveis);
  };

  const handleCloseEdit = () => {
    setImovelParaEditar(null);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={imoveis}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        searchFields={['imovel', 'endereco', 'cidade']}
      />
      {imovelParaEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
            <CadastroImovel imovelEdit={imovelParaEditar} onClose={handleCloseEdit} />
          </div>
        </div>
      )}
    </>
  );
};

export default ConsultarImoveis;