import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Download } from 'lucide-react';
import { useDataStore } from '../../../store/dataStore';
import { Transacao } from '../../../types';
import FileUpload from '../../../components/Common/FileUpload';

const CadastroTransacao: React.FC = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const { addTransacao, cpfs } = useDataStore();
  const [documentos, setDocumentos] = useState<string[]>([]);

  const cpfVinculo = watch('cpfVinculoPrimario');
  const cpfVinculado = cpfs.find(c => c.cpf === cpfVinculo);

  const handleDownloadTemplate = () => {
    // Simula download do template Excel
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'template_transacoes.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadExcel = () => {
    // Simula upload de Excel
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('Arquivo Excel selecionado:', file.name);
        // Aqui seria implementada a lógica de processamento do Excel
      }
    };
    input.click();
  };

  const onSubmit = (data: any) => {
    // ... existing code ...
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-end space-x-4 mb-6">
        <button
          onClick={handleDownloadTemplate}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Baixar Modelo</span>
        </button>
        <button
          onClick={handleUploadExcel}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Excel</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        // ... existing code ...
      </form>
    </div>
  );
};

export default CadastroTransacao; 