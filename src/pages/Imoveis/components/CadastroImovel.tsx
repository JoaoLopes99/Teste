import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Download } from 'lucide-react';
import { useDataStore } from '../../../store/dataStore';
import { Imovel } from '../../../types';
import FileUpload from '../../../components/Common/FileUpload';

interface CadastroImovelProps {
  imovelEdit?: Imovel;
  onClose?: () => void;
}

const CadastroImovel = ({ imovelEdit, onClose }: CadastroImovelProps): JSX.Element => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const { addImovel, updateImovel, cpfs } = useDataStore();
  const [documentos, setDocumentos] = useState<string[]>(imovelEdit?.documentos || []);

  const cep = watch('cep');
  const latLong = watch('latLong');
  const cpfVinculo = watch('cpfVinculoPrimario');
  const cpfVinculado = cpfs.find(c => c.cpf === cpfVinculo);

  useEffect(() => {
    if (imovelEdit) {
      setValue('imovel', imovelEdit.imovel);
      setValue('tipo', imovelEdit.tipo);
      setValue('endereco', imovelEdit.endereco);
      setValue('bairro', imovelEdit.bairro);
      setValue('cidade', imovelEdit.cidade);
      setValue('estado', imovelEdit.estado);
      setValue('latLong', `${imovelEdit.latitude || ''}, ${imovelEdit.longitude || ''}`);
      setValue('cpfVinculoPrimario', imovelEdit.cpfVinculoPrimario);
      setValue('campoTexto', imovelEdit.campoTexto);
    } else {
      reset();
      setDocumentos([]);
    }
  }, [imovelEdit, setValue, reset]);

  // Buscar endereço por CEP (simulado)
  React.useEffect(() => {
    if (cep && cep.length === 8) {
      // Simular busca de CEP
      setTimeout(() => {
        setValue('cidade', 'São Paulo');
        setValue('estado', 'SP');
      }, 500);
    }
  }, [cep, setValue]);

  // Separar lat/long automaticamente
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
    link.download = 'template_imoveis.xlsx';
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
    const imovel: Omit<Imovel, 'id' | 'createdAt'> = {
      imovel: data.imovel,
      tipo: data.tipo,
      endereco: data.endereco,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado,
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      cpfVinculoPrimario: data.cpfVinculoPrimario,
      nomeVinculoPrimario: cpfVinculado?.nome,
      campoTexto: data.campoTexto || '',
      documentos,
      dataCriacao: imovelEdit?.dataCriacao || new Date().toISOString()
    };

    if (imovelEdit) {
      updateImovel(imovelEdit.id, imovel);
      alert('Imóvel atualizado com sucesso!');
    } else {
      addImovel(imovel);
      alert('Imóvel cadastrado com sucesso!');
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
              Imóvel (Identificação) *
            </label>
            <input
              {...register('imovel', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="Casa, Apartamento, Terreno..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de vínculo *
            </label>
            <select
              {...register('tipo', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            >
              <option value="">Selecione...</option>
              <option value="Proprietário">Proprietário</option>
              <option value="Residência proprietário">Residência proprietário</option>
              <option value="Residência locatário">Residência locatário</option>
              <option value="Ocultação B&V">Ocultação B&V</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço *
            </label>
            <input
              {...register('endereco', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="Rua, número, complemento..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CEP *
            </label>
            <input
              {...register('cep', { required: true })}
              type="text"
              maxLength={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="00000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cidade (auto-preenchido)
            </label>
            <input
              {...register('cidade')}
              type="text"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado (auto-preenchido)
            </label>
            <input
              {...register('estado')}
              type="text"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            />
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
            placeholder="Observações sobre o imóvel..."
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
            {imovelEdit ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroImovel;