import React, { useState } from 'react';
import DataTable from '../../../components/Common/DataTable';
import { useDataStore } from '../../../store/dataStore';
import { generateGeneralPDF } from '../../../utils/pdfGenerator';
import CadastroRedeSocial from './CadastroRedeSocial';

const ConsultarRedesSociais: React.FC = () => {
  const { redesSociais, deleteRedeSocial } = useDataStore();
  const [redeParaEditar, setRedeParaEditar] = useState<any>(null);

  const columns = [
    { key: 'nomeRede', label: 'Nome da Rede' },
    { key: 'link', label: 'Link' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'nomeVinculoPrimario', label: 'Vínculo Primário' },
    {
      key: 'campoTexto',
      label: 'Observações',
      render: (value: string) => value ? value.substring(0, 50) + '...' : 'Nenhuma'
    }
  ];

  const handleEdit = (rede: any) => {
    setRedeParaEditar(rede);
  };

  const handleDelete = (rede: any) => {
    if (confirm('Tem certeza que deseja excluir esta rede social?')) {
      deleteRedeSocial(rede.id);
    }
  };

  const handleExport = () => {
    generateGeneralPDF('Relatório de Redes Sociais', redesSociais);
  };

  const handleCloseEdit = () => {
    setRedeParaEditar(null);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={redesSociais}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        searchFields={['nomeRede', 'tipo', 'nomeVinculoPrimario']}
      />
      {redeParaEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
            <CadastroRedeSocial redeEdit={redeParaEditar} onClose={handleCloseEdit} />
          </div>
        </div>
      )}
    </>
  );
};

export default ConsultarRedesSociais;