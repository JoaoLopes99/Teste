import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Download } from 'lucide-react';
import { useDataStore } from '../../../store/dataStore';
import { Empresarial } from '../../../types';
import FileUpload from '../../../components/Common/FileUpload';

interface CadastroEmpresarialProps {
  empresarialEdit?: Omit<Empresarial, 'id'>;
  onClose?: () => void;
}

const CadastroEmpresarial: React.FC<CadastroEmpresarialProps> = ({ empresarialEdit, onClose }) => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const { addEmpresarial, cpfs } = useDataStore();
  const [documentos, setDocumentos] = useState<string[]>(empresarialEdit?.documentos || []);

  const cpfEnvolvido = watch('cpfEnvolvido');
  const envolvido = cpfs.find(c => c.cpf === cpfEnvolvido);

  useEffect(() => {
    if (empresarialEdit) {
      setValue('cpfEnvolvido', empresarialEdit.cpfEnvolvido);
      setValue('nomeEnvolvido', empresarialEdit.nomeEnvolvido);
      setValue('vinculoRaizen', empresarialEdit.vinculoRaizen);
      setValue('setor', empresarialEdit.setor);
      setValue('periodoInicio', empresarialEdit.periodoInicio);
      setValue('periodoFim', empresarialEdit.periodoFim);
      setValue('ativo', empresarialEdit.ativo);
      setValue('saidaDevidoOcorrencia', empresarialEdit.saidaDevidoOcorrencia);
      setValue('campoTexto', empresarialEdit.campoTexto);
      setDocumentos(empresarialEdit.documentos || []);
    }
  }, [empresarialEdit, setValue]);

  const handleDownloadTemplate = () => {
    // Simula download do template Excel
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'template_empresarial.xlsx';
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
    const empresarial: Omit<Empresarial, 'id'> = {
      cpfEnvolvido: data.cpfEnvolvido,
      nomeEnvolvido: envolvido?.nome || '',
      vinculoRaizen: data.vinculoRaizen,
      setor: data.setor,
      periodoInicio: data.periodoInicio,
      periodoFim: data.periodoFim,
      ativo: data.ativo,
      saidaDevidoOcorrencia: data.saidaDevidoOcorrencia,
      campoTexto: data.campoTexto || '',
      documentos,
      dataCriacao: new Date().toISOString()
    };

    addEmpresarial(empresarial);
    reset();
    setDocumentos([]);
    alert('Vínculo empresarial cadastrado com sucesso!');
    if (onClose) onClose();
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CPF Envolvido *
            </label>
            <select
              {...register('cpfEnvolvido', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            >
              <option value="">Selecione um CPF...</option>
              {cpfs.map(cpf => (
                <option key={cpf.id} value={cpf.cpf}>
                  {cpf.cpf} - {cpf.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Envolvido (auto-preenchido)
            </label>
            <input
              type="text"
              value={envolvido?.nome || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vínculo Raízen *
            </label>
            <select
              {...register('vinculoRaizen', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            >
              <option value="">Selecione...</option>
              <option value="Funcionários">Funcionários</option>
              <option value="Prestadores de Serviço">Prestadores de Serviço</option>
              <option value="Fornecedor de Cana">Fornecedor de Cana</option>
              <option value="Fornecedor de Material">Fornecedor de Material</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Setor *
            </label>
            <input
              {...register('setor', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="Administrativo, Operacional, Segurança..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Início *
            </label>
            <input
              {...register('periodoInicio', { required: true })}
              type="date"
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período Fim
            </label>
            <input
              {...register('periodoFim')}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ativo *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  {...register('ativo', { required: true })}
                  type="radio"
                  value="SIM"
                  className="mr-2"
                />
                SIM
              </label>
              <label className="flex items-center">
                <input
                  {...register('ativo', { required: true })}
                  type="radio"
                  value="NÃO"
                  className="mr-2"
                />
                NÃO
              </label>
              <label className="flex items-center">
                <input
                  {...register('ativo', { required: true })}
                  type="radio"
                  value="N/A"
                  className="mr-2"
                />
                N/A
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Saída Devido Ocorrência *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  {...register('saidaDevidoOcorrencia', { required: true })}
                  type="radio"
                  value="SIM"
                  className="mr-2"
                />
                SIM
              </label>
              <label className="flex items-center">
                <input
                  {...register('saidaDevidoOcorrencia', { required: true })}
                  type="radio"
                  value="NÃO"
                  className="mr-2"
                />
                NÃO
              </label>
              <label className="flex items-center">
                <input
                  {...register('saidaDevidoOcorrencia', { required: true })}
                  type="radio"
                  value="N/A"
                  className="mr-2"
                />
                N/A
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campo Texto (observações)
          </label>
          <textarea
            {...register('campoTexto')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            placeholder="Observações sobre o vínculo empresarial..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Documentos Anexo
          </label>
          <FileUpload
            documentos={documentos}
            setDocumentos={setDocumentos}
            acceptedTypes={['pdf', 'doc', 'docx', 'jpg', 'png']}
            maxSize={10 * 1024 * 1024}
            multiple
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroEmpresarial;