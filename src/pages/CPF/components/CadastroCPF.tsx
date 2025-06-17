import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, Upload, Download } from 'lucide-react';
import { useDataStore } from '../../../store/dataStore';
import { CPF } from '../../../types';
import FileUpload from '../../../components/Common/FileUpload';

interface CadastroCPFProps {
  cpfEdit?: CPF;
  onClose?: () => void;
}

const CadastroCPF = ({ cpfEdit, onClose }: CadastroCPFProps): JSX.Element => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const { addCPF, updateCPF, cpfs } = useDataStore();
  const [foto, setFoto] = useState<string>(cpfEdit?.foto || '');
  const [documentos, setDocumentos] = useState<string[]>(cpfEdit?.documentos || []);

  const cpfVinculo = watch('cpfVinculoPrimario');
  const cpfVinculado = cpfs.find(c => c.cpf === cpfVinculo);

  useEffect(() => {
    if (cpfEdit) {
      setValue('cpf', cpfEdit.cpf);
      setValue('nome', cpfEdit.nome);
      setValue('tipoCPF', cpfEdit.tipoCpf);
      setValue('antecedentesCriminais', cpfEdit.antecedentesCriminais);
      setValue('tipologiaCriminal', cpfEdit.tipologiaCriminal?.join(', '));
      setValue('cpfVinculoPrimario', cpfEdit.cpfVinculoPrimario);
      setValue('campoTexto', cpfEdit.campoTexto);
    } else {
      reset();
      setFoto('');
      setDocumentos([]);
    }
  }, [cpfEdit, setValue, reset]);

  const handleDownloadTemplate = () => {
    // Simula download do template Excel
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'template_cpf.xlsx';
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
    const cpf: Omit<CPF, 'id' | 'createdAt'> = {
      cpf: data.cpf,
      nome: data.nome,
      tipoCpf: data.tipoCPF,
      antecedentesCriminais: data.antecedentesCriminais || '',
      tipologiaCriminal: data.tipologiaCriminal ? data.tipologiaCriminal.split(',').map((t: string) => t.trim()) : [],
      cpfVinculoPrimario: data.cpfVinculoPrimario,
      nomeVinculoPrimario: cpfVinculado?.nome,
      campoTexto: data.campoTexto || '',
      foto,
      documentos,
      dataCriacao: cpfEdit?.dataCriacao || new Date().toISOString()
    };

    if (cpfEdit) {
      updateCPF(cpfEdit.id, cpf);
      alert('CPF atualizado com sucesso!');
    } else {
      addCPF(cpf);
      alert('CPF cadastrado com sucesso!');
    }
    if (onClose) onClose();
    reset();
    setFoto('');
    setDocumentos([]);
  };

  const handleFotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
        {/* Foto do Envolvido */}
        <div className="text-center">
          <div className="inline-block relative">
            {foto ? (
              <img
                src={foto}
                alt="Foto do envolvido"
                className="w-32 h-40 object-cover rounded-lg border-2 border-gray-300"
              />
            ) : (
              <div className="w-32 h-40 bg-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-600 mt-2">Foto do Envolvido (3x4)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CPF Envolvido *
            </label>
            <input
              {...register('cpf', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="000.000.000-00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Envolvido *
            </label>
            <input
              {...register('nome', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="Nome completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de CPF *
            </label>
            <select
              {...register('tipoCPF', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            >
              <option value="">Selecione...</option>
              <option value="Primário">Primário</option>
              <option value="Familiar">Familiar</option>
              <option value="Secundário">Secundário</option>
              <option value="Ocultação de B&V">Ocultação de B&V</option>
              <option value="Vínculo pessoal não definido">Vínculo pessoal não definido</option>
              <option value="Vínculo comercial">Vínculo comercial</option>
              <option value="Vínculo empresarial">Vínculo empresarial</option>
              <option value="Vínculo de círculo de amizade">Vínculo de círculo de amizade</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipologia Criminal (separado por vírgula)
            </label>
            <input
              {...register('tipologiaCriminal')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="Furto, Roubo, Tráfico..."
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
            Antecedentes Criminais
          </label>
          <textarea
            {...register('antecedentesCriminais')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            placeholder="Descreva os antecedentes criminais..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campo Texto (observações)
          </label>
          <textarea
            {...register('campoTexto')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            placeholder="Observações adicionais..."
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
            {cpfEdit ? 'Salvar Alterações' : 'Cadastrar CPF'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroCPF;