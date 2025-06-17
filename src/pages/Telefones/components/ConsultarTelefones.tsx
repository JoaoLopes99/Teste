import React, { useState } from 'react';
import DataTable from '../../../components/Common/DataTable';
import { useDataStore } from '../../../store/dataStore';
import { generateGeneralPDF } from '../../../utils/pdfGenerator';
import CadastroTelefone from './CadastroTelefone';

const ConsultarTelefones: React.FC = () => {
  const { telefones, deleteTelefone } = useDataStore();
  const [telefoneParaEditar, setTelefoneParaEditar] = useState<any>(null);

  const columns = [
    { key: 'telefone', label: 'Telefone' },
    { key: 'tipoVinculo', label: 'Tipo de Vínculo' },
    { key: 'proprietarioLinha', label: 'Proprietário da Linha' },
    { key: 'nomeVinculoPrimario', label: 'Vínculo Primário' },
    {
      key: 'campoTexto',
      label: 'Observações',
      render: (value: string) => value ? value.substring(0, 50) + '...' : 'Nenhuma'
    }
  ];

  const handleEdit = (telefone: any) => {
    setTelefoneParaEditar(telefone);
  };

  const handleDelete = (telefone: any) => {
    if (confirm('Tem certeza que deseja excluir este telefone?')) {
      deleteTelefone(telefone.id);
    }
  };

  const handleExport = () => {
    generateGeneralPDF('Relatório de Telefones', telefones);
  };

  const handleCloseEdit = () => {
    setTelefoneParaEditar(null);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={telefones}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        searchFields={['telefone', 'proprietarioLinha']}
      />
      {telefoneParaEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
            <CadastroTelefone telefoneEdit={telefoneParaEditar} onClose={handleCloseEdit} />
          </div>
        </div>
      )}
    </>
  );
};

export default ConsultarTelefones;