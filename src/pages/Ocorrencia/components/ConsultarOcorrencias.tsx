import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DataTable from '../../../components/Common/DataTable';
import { useDataStore } from '../../../store/dataStore';
import { generateOcorrenciaPDF } from '../../../utils/pdfGenerator';
import EditarOcorrencia from './EditarOcorrencia';

const ConsultarOcorrencias: React.FC = () => {
  const { ocorrencias, deleteOcorrencia } = useDataStore();
  const [ocorrenciaParaEditar, setOcorrenciaParaEditar] = useState<any>(null);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'tipo', label: 'Tipo' },
    {
      key: 'dataInicio',
      label: 'Data',
      render: (value: Date) => format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })
    },
    { key: 'unidade', label: 'Unidade' },
    { key: 'responsavel', label: 'Responsável' },
    {
      key: 'gravidade',
      label: 'Gravidade',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Crítica' ? 'bg-red-100 text-red-800' :
          value === 'Alta' ? 'bg-orange-100 text-orange-800' :
          value === 'Média' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Finalizada' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {value}
        </span>
      )
    }
  ];

  const handleEdit = (ocorrencia: any) => {
    setOcorrenciaParaEditar(ocorrencia);
  };

  const handleDelete = (ocorrencia: any) => {
    if (confirm('Tem certeza que deseja excluir esta ocorrência?')) {
      deleteOcorrencia(ocorrencia.id);
    }
  };

  const handleExport = () => {
    generateOcorrenciaPDF(ocorrencias);
  };

  const handleCloseEdit = () => {
    setOcorrenciaParaEditar(null);
  };

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={ocorrencias}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        searchFields={['tipo', 'unidade', 'responsavel']}
      />

      {ocorrenciaParaEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <EditarOcorrencia
              ocorrencia={ocorrenciaParaEditar}
              onClose={handleCloseEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultarOcorrencias;