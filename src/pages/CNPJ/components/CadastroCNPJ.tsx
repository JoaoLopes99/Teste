import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Download } from 'lucide-react';
import { useDataStore } from '../../../store/dataStore';
import { CNPJ } from '../../../types';
import FileUpload from '../../../components/Common/FileUpload';

interface CadastroCNPJProps {
  cnpjEdit?: CNPJ;
  onClose?: () => void;
}

const CadastroCNPJ = ({ cnpjEdit, onClose }: CadastroCNPJProps): JSX.Element => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const { addCNPJ, updateCNPJ, cpfs } = useDataStore();
  const [documentos, setDocumentos] = useState<string[]>(cnpjEdit?.documentos || []);

  const latLong = watch('latLong');
  const cpfVinculo = watch('cpfVinculoPrimario');
  const cpfVinculado = cpfs.find(c => c.cpf === cpfVinculo);

  useEffect(() => {
    if (cnpjEdit) {
      setValue('cnpj', cnpjEdit.cnpj);
      setValue('nomeEmpresa', cnpjEdit.nomeEmpresa);
      setValue('tipologia', cnpjEdit.tipologia);
      setValue('latLong', `${cnpjEdit.latitude || ''}, ${cnpjEdit.longitude || ''}`);
      setValue('cpfVinculoPrimario', cnpjEdit.cpfVinculoPrimario);
      setValue('campoTexto', cnpjEdit.campoTexto);
    } else {
      reset();
      setDocumentos([]);
    }
  }, [cnpjEdit, setValue, reset]);

  React.useEffect(() => {
    if (latLong && latLong.includes(',')) {
      const [lat, lng] = latLong.split(',').map((coord: string) => parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        setValue('latitude', lat);
        setValue('longitude', lng);
      }
    }
  }, [latLong, setValue]);

  const handleDownloadTemplate = () => {
    // Simula download do template Excel
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'template_cnpj.xlsx';
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
    const [lat, lng] = (data.latLong || '').split(',').map((coord: string) => parseFloat(coord.trim()));
    const cnpj: Omit<CNPJ, 'id'> = {
      cnpj: data.cnpj,
      nomeEmpresa: data.nomeEmpresa,
      tipologia: data.tipologia,
      latitude: lat || 0,
      longitude: lng || 0,
      cpfVinculoPrimario: data.cpfVinculoPrimario,
      nomeVinculoPrimario: cpfVinculado?.nome,
      campoTexto: data.campoTexto || '',
      documentos,
      dataCriacao: cnpjEdit?.dataCriacao || new Date().toISOString()
    };
    if (cnpjEdit) {
      updateCNPJ(cnpjEdit.id, cnpj);
      alert('CNPJ atualizado com sucesso!');
    } else {
      addCNPJ(cnpj);
      alert('CNPJ cadastrado com sucesso!');
    }
    if (onClose) onClose();
    reset();
    setDocumentos([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-900">
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
              CNPJ *
            </label>
            <input
              {...register('cnpj', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="00.000.000/0000-00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Empresa *
            </label>
            <input
              {...register('nomeEmpresa', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="Razão social da empresa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipologia *
            </label>
            <select
              {...register('tipologia', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            >
              <option value="">Selecione...</option>
              <option value="Sócio/Administrador">Sócio/Administrador</option>
              <option value="Empregado">Empregado</option>
              <option value="Ocultação B&V">Ocultação B&V</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LAT/LONG
            </label>
            <input
              {...register('latLong')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="-23.5505, -46.6333"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude (auto-preenchido)
            </label>
            <input
              {...register('latitude')}
              type="number"
              step="any"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude (auto-preenchido)
            </label>
            <input
              {...register('longitude')}
              type="number"
              step="any"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CPF Vínculo Primário
            </label>
            <select
              {...register('cpfVinculoPrimario')}
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
              Nome Vínculo Primário (auto-preenchido)
            </label>
            <input
              type="text"
              value={cpfVinculado?.nome || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            />
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
            placeholder="Observações sobre a empresa..."
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

        <div className="flex justify-end space-x-4 mt-8">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
          >
            {cnpjEdit ? 'Salvar Alterações' : 'Cadastrar CNPJ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroCNPJ;