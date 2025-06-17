import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Download } from 'lucide-react';
import { useDataStore } from '../../../store/dataStore';
import { Veiculo } from '../../../types';
import FileUpload from '../../../components/Common/FileUpload';

interface CadastroVeiculoProps {
  veiculoEdit?: Veiculo;
  onClose?: () => void;
}

const CadastroVeiculo = ({ veiculoEdit, onClose }: CadastroVeiculoProps): JSX.Element => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const { addVeiculo, updateVeiculo, cpfs } = useDataStore();
  const [documentos, setDocumentos] = useState<string[]>(veiculoEdit?.documentos || []);

  const cep = watch('cep');
  const latLong = watch('latLong');
  const cpfVinculo = watch('cpfVinculoPrimario');
  const cpfVinculado = cpfs.find(c => c.cpf === cpfVinculo);

  useEffect(() => {
    if (veiculoEdit) {
      setValue('veiculo', veiculoEdit.veiculo);
      setValue('tipoVinculo', veiculoEdit.tipoVinculo);
      setValue('placa', veiculoEdit.placa);
      setValue('marca', veiculoEdit.marca);
      setValue('modelo', veiculoEdit.modelo);
      setValue('cor', veiculoEdit.cor);
      setValue('endereco', veiculoEdit.endereco);
      setValue('cep', veiculoEdit.cep);
      setValue('cidade', veiculoEdit.cidade);
      setValue('estado', veiculoEdit.estado);
      setValue('latLong', `${veiculoEdit.latitude || ''}, ${veiculoEdit.longitude || ''}`);
      setValue('cpfVinculoPrimario', veiculoEdit.cpfVinculoPrimario);
      setValue('campoTexto', veiculoEdit.campoTexto);
    } else {
      reset();
      setDocumentos([]);
    }
  }, [veiculoEdit, setValue, reset]);

  // Buscar endereço por CEP (simulado)
  React.useEffect(() => {
    if (cep && cep.length === 8) {
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
    link.download = 'template_veiculos.xlsx';
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
    const veiculo: Omit<Veiculo, 'id'> = {
      veiculo: data.veiculo,
      tipoVinculo: data.tipoVinculo,
      placa: data.placa,
      marca: data.marca,
      modelo: data.modelo,
      cor: data.cor,
      endereco: data.endereco,
      cep: data.cep,
      cidade: data.cidade,
      estado: data.estado,
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      cpfVinculoPrimario: data.cpfVinculoPrimario,
      nomeVinculoPrimario: cpfVinculado?.nome,
      campoTexto: data.campoTexto || '',
      documentos,
      dataCriacao: veiculoEdit?.dataCriacao || new Date().toISOString()
    };

    if (veiculoEdit) {
      updateVeiculo(veiculoEdit.id, veiculo);
      alert('Veículo atualizado com sucesso!');
    } else {
      addVeiculo(veiculo);
      alert('Veículo cadastrado com sucesso!');
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
              Veículo (Identificação) *
            </label>
            <input
              {...register('veiculo', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="Carro, Moto, Caminhão..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de vínculo *
            </label>
            <select
              {...register('tipoVinculo', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            >
              <option value="">Selecione...</option>
              <option value="Proprietário e usuário">Proprietário e usuário</option>
              <option value="Em nome de outros, em uso do envolvido">Em nome de outros, em uso do envolvido</option>
              <option value="Em nome de outros p/ ocultação B&V">Em nome de outros p/ ocultação B&V</option>
              <option value="Em seu nome p/ ocultação B&V">Em seu nome p/ ocultação B&V</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Placa *
            </label>
            <input
              {...register('placa', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="ABC-1234"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marca *
            </label>
            <input
              {...register('marca', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="Toyota, Honda, Ford..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modelo *
            </label>
            <input
              {...register('modelo', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="Corolla, Civic, Focus..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor *
            </label>
            <input
              {...register('cor', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="Branco, Preto, Prata..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço do Veículo
            </label>
            <input
              {...register('endereco')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="Local onde o veículo foi visto/apreendido..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CEP
            </label>
            <input
              {...register('cep')}
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
            placeholder="Observações sobre o veículo..."
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
            {veiculoEdit ? 'Salvar Alterações' : 'Cadastrar Veículo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroVeiculo;