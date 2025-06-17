import React, { useState } from 'react';
import DataTable from '../../../components/Common/DataTable';
import { useDataStore } from '../../../store/dataStore';
import { generateGeneralPDF } from '../../../utils/pdfGenerator';
import CadastroFinanceiro from './CadastroFinanceiro';

const ConsultarFinanceiro: React.FC = () => {
  const { transacoes, deleteTransacao } = useDataStore();
  const [transacaoParaEditar, setTransacaoParaEditar] = useState<any>(null);

  const columns = [
    { key: 'tipoTransacao', label: 'Tipo' },
    { key: 'valorTransacao', label: 'Valor' },
    { key: 'dadosBancarios', label: 'Dados Bancários' },
    { key: 'nomeVinculoPrimario', label: 'Vínculo Primário' },
    {
      key: 'campoTexto',
      label: 'Observações',
      render: (value: string) => value ? value.substring(0, 50) + '...' : 'Nenhuma'
    }
  ];

  const handleEdit = (transacao: any) => {
    setTransacaoParaEditar(transacao);
  };

  const handleDelete = (transacao: any) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransacao(transacao.id);
    }
  };

  const handleExport = () => {
    generateGeneralPDF('Relatório de Transações', transacoes);
  };

  const handleCloseEdit = () => {
    setTransacaoParaEditar(null);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={transacoes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        searchFields={['tipoTransacao', 'nomeVinculoPrimario']}
      />
      {transacaoParaEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
            <CadastroFinanceiro transacaoEdit={transacaoParaEditar} onClose={handleCloseEdit} />
          </div>
        </div>
      )}
    </>
  );
};

export default ConsultarFinanceiro;