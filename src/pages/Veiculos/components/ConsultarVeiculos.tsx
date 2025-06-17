import React, { useState } from 'react';
import DataTable from '../../../components/Common/DataTable';
import { useDataStore } from '../../../store/dataStore';
import { generateGeneralPDF } from '../../../utils/pdfGenerator';
import CadastroVeiculo from './CadastroVeiculo';

const ConsultarVeiculos: React.FC = () => {
  const { veiculos, deleteVeiculo } = useDataStore();
  const [veiculoParaEditar, setVeiculoParaEditar] = useState<any>(null);

  const columns = [
    { key: 'placa', label: 'Placa' },
    { key: 'marca', label: 'Marca' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'cor', label: 'Cor' },
    { key: 'tipoVinculo', label: 'Tipo de Vínculo' },
    { key: 'nomeVinculoPrimario', label: 'Vínculo Primário' }
  ];

  const handleEdit = (veiculo: any) => {
    setVeiculoParaEditar(veiculo);
  };

  const handleDelete = (veiculo: any) => {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      deleteVeiculo(veiculo.id);
    }
  };

  const handleExport = () => {
    generateGeneralPDF('Relatório de Veículos', veiculos);
  };

  const handleCloseEdit = () => {
    setVeiculoParaEditar(null);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={veiculos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        searchFields={['placa', 'marca', 'modelo']}
      />
      {veiculoParaEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
            <CadastroVeiculo veiculoEdit={veiculoParaEditar} onClose={handleCloseEdit} />
          </div>
        </div>
      )}
    </>
  );
};

export default ConsultarVeiculos;