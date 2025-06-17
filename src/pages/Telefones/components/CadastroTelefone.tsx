import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Download } from 'lucide-react';
import { useDataStore } from '../../../store/dataStore';
import { Telefone } from '../../../types';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputMask from 'react-input-mask';

// Schema de validação
const telefoneSchema = z.object({
  numero: z.string()
    .min(14, 'Número de telefone inválido')
    .max(15, 'Número de telefone inválido')
    .regex(
      /^\(\d{2}\) \d{4,5}-\d{4}$/,
      'Formato inválido. Use (99) 9999-9999 para fixo ou (99) 99999-9999 para celular'
    ),
  tipoVinculo: z.string().min(1, 'Tipo de vínculo é obrigatório'),
  operadora: z.string().min(1, 'Operadora é obrigatória'),
  proprietarioLinha: z.string().min(1, 'Proprietário da linha é obrigatório'),
  cpfProprietario: z.string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00')
    .min(1, 'CPF do proprietário é obrigatório'),
  cpfVinculoPrimario: z.string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00')
    .optional(),
  campoTexto: z.string().optional(),
  tipoTelefone: z.enum(['fixo', 'celular'], {
    required_error: 'Tipo de telefone é obrigatório',
  }),
});

type TelefoneFormData = z.infer<typeof telefoneSchema>;

interface CadastroTelefoneProps {
  telefoneEdit?: Telefone;
  onClose?: () => void;
}

const CadastroTelefone = ({ telefoneEdit, onClose }: CadastroTelefoneProps): JSX.Element => {
  const { register, handleSubmit, reset, watch, formState: { errors }, setValue } = useForm<TelefoneFormData>({
    resolver: zodResolver(telefoneSchema)
  });
  const { addTelefone, updateTelefone, cpfs } = useDataStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cpfVinculo = watch('cpfVinculoPrimario');
  const tipoTelefone = watch('tipoTelefone');
  const cpfVinculado = cpfs.find(c => c.cpf === cpfVinculo);

  useEffect(() => {
    if (telefoneEdit) {
      setValue('numero', telefoneEdit.numero);
      setValue('tipoVinculo', telefoneEdit.tipoVinculo);
      setValue('operadora', telefoneEdit.operadora);
      setValue('proprietarioLinha', telefoneEdit.proprietarioLinha);
      setValue('cpfProprietario', telefoneEdit.cpfProprietario);
      setValue('cpfVinculoPrimario', telefoneEdit.cpfVinculoPrimario);
      setValue('campoTexto', telefoneEdit.campoTexto);
      setValue('tipoTelefone', telefoneEdit.numero.length === 15 ? 'celular' : 'fixo');
    } else {
      reset();
    }
  }, [telefoneEdit, setValue, reset]);

  const handleDownloadTemplate = async () => {
    try {
      // Aqui você implementaria a lógica real de download
      const response = await fetch('/api/templates/telefones');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'template_telefones.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Template baixado com sucesso!');
    } catch (error) {
      toast.error('Erro ao baixar template');
      console.error('Erro ao baixar template:', error);
    }
  };

  const handleUploadExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/)) {
      toast.error('Por favor, selecione um arquivo Excel válido');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Aqui você implementaria a lógica real de upload
      const response = await fetch('/api/upload/telefones', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Erro no upload');
      
      toast.success('Arquivo processado com sucesso!');
    } catch (error) {
      toast.error('Erro ao processar arquivo');
      console.error('Erro no upload:', error);
    }
  };

  const onSubmit = async (data: TelefoneFormData) => {
    try {
      setIsSubmitting(true);
      
      const telefone: Omit<Telefone, 'id' | 'createdAt'> = {
        numero: data.numero,
        tipoVinculo: data.tipoVinculo,
        operadora: data.operadora,
        proprietarioLinha: data.proprietarioLinha,
        cpfProprietario: data.cpfProprietario,
        cpfVinculoPrimario: data.cpfVinculoPrimario,
        nomeVinculoPrimario: cpfVinculado?.nome,
        campoTexto: data.campoTexto || '',
        documentos: telefoneEdit?.documentos || [],
        dataCriacao: telefoneEdit?.dataCriacao || new Date().toISOString()
      };

      if (telefoneEdit) {
        await updateTelefone(telefoneEdit.id, telefone);
        toast.success('Telefone atualizado com sucesso!');
      } else {
        await addTelefone(telefone);
        toast.success('Telefone cadastrado com sucesso!');
      }
      if (onClose) onClose();
      reset();
    } catch (error) {
      toast.error('Erro ao cadastrar telefone');
      console.error('Erro ao cadastrar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-900">
      <div className="flex justify-end space-x-4 mb-6">
        <button
          onClick={handleDownloadTemplate}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={isSubmitting}
        >
          <Download className="w-4 h-4" />
          <span>Baixar Modelo</span>
        </button>
        <label className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50">
          <Upload className="w-4 h-4" />
          <span>Upload Excel</span>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleUploadExcel}
            className="hidden"
            disabled={isSubmitting}
          />
        </label>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Telefone *
            </label>
            <select
              {...register('tipoTelefone')}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.tipoTelefone ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione...</option>
              <option value="fixo">Fixo</option>
              <option value="celular">Celular</option>
            </select>
            {errors.tipoTelefone && (
              <p className="mt-1 text-sm text-red-500">{errors.tipoTelefone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone *
            </label>
            <InputMask
              mask={tipoTelefone === 'celular' ? '(99) 99999-9999' : '(99) 9999-9999'}
              {...register('numero')}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700 ${
                errors.numero ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={tipoTelefone === 'celular' ? '(99) 99999-9999' : '(99) 9999-9999'}
            />
            {errors.numero && (
              <p className="mt-1 text-sm text-red-500">{errors.numero.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proprietário da Linha *
            </label>
            <input
              type="text"
              {...register('proprietarioLinha')}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700 ${
                errors.proprietarioLinha ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nome do proprietário da linha"
            />
            {errors.proprietarioLinha && (
              <p className="mt-1 text-sm text-red-500">{errors.proprietarioLinha.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CPF do Proprietário *
            </label>
            <InputMask
              mask="999.999.999-99"
              {...register('cpfProprietario')}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700 ${
                errors.cpfProprietario ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="000.000.000-00"
            />
            {errors.cpfProprietario && (
              <p className="mt-1 text-sm text-red-500">{errors.cpfProprietario.message}</p>
            )}
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
              <option value="Proprietário">Proprietário</option>
              <option value="Em seu uso em nome de outros">Em seu uso em nome de outros</option>
              <option value="Contato do envolvido">Contato do envolvido</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operadora *
            </label>
            <select
              {...register('operadora')}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700 ${
                errors.operadora ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione...</option>
              <option value="Vivo">Vivo</option>
              <option value="Claro">Claro</option>
              <option value="TIM">TIM</option>
              <option value="Oi">Oi</option>
              <option value="Outros">Outros</option>
            </select>
            {errors.operadora && (
              <p className="mt-1 text-sm text-red-500">{errors.operadora.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CPF Vínculo Primário
            </label>
            <InputMask
              mask="999.999.999-99"
              {...register('cpfVinculoPrimario')}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700 ${
                errors.cpfVinculoPrimario ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="000.000.000-00"
            />
            {errors.cpfVinculoPrimario && (
              <p className="mt-1 text-sm text-red-500">{errors.cpfVinculoPrimario.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Vínculo Primário (auto-preenchido)
            </label>
            <input
              type="text"
              value={cpfVinculado?.nome || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
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
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700 ${
              errors.campoTexto ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Observações sobre o telefone..."
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
            disabled={isSubmitting}
          >
            {telefoneEdit ? 'Salvar Alterações' : 'Cadastrar Telefone'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroTelefone;