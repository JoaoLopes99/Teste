import React, { useState } from 'react';
import DataTable from '../../../components/Common/DataTable';
import { useDataStore } from '../../../store/dataStore';
import { generateCPFPDF } from '../../../utils/pdfGenerator';
import CadastroCPF from './CadastroCPF';

const ConsultarCPF: React.FC = () => {
  const { cpfs, deleteCPF } = useDataStore();
  const [cpfParaEditar, setCpfParaEditar] = useState<any>(null);

  const columns = [
    { key: 'cpf', label: 'CPF' },
    { key: 'nome', label: 'Nome' },
    { key: 'tipoCpf', label: 'Tipo' },
    {
      key: 'antecedentesCriminais',
      label: 'Antecedentes',
      render: (value: string) => value ? value.substring(0, 50) + '...' : 'Não possui'
    },
    {
      key: 'tipologiaCriminal',
      label: 'Tipologia',
      render: (value: string[]) => value ? value.join(', ') : 'Nenhuma'
    }
  ];

  const handleEdit = (cpf: any) => {
    setCpfParaEditar(cpf);
  };

  const handleDelete = (cpf: any) => {
    if (confirm('Tem certeza que deseja excluir este CPF?')) {
      deleteCPF(cpf.id);
    }
  };

  const handleExport = () => {
    generateCPFPDF(cpfs);
  };

  const handleCloseEdit = () => {
    setCpfParaEditar(null);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={cpfs}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        searchFields={['cpf', 'nome', 'tipoCpf']}
      />
      {cpfParaEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
            <CadastroCPF cpfEdit={cpfParaEditar} onClose={handleCloseEdit} />
          </div>
        </div>
      )}
    </>
  );
};

export default ConsultarCPF;