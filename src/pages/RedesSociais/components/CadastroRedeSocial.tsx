import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Download } from 'lucide-react';
import { useDataStore } from '../../../store/dataStore';
import { RedeSocial } from '../../../types';
import FileUpload from '../../../components/Common/FileUpload';

interface CadastroRedeSocialProps {
  redeSocialEdit?: RedeSocial;
  onClose?: () => void;
}

const CadastroRedeSocial = ({ redeSocialEdit, onClose }: CadastroRedeSocialProps): JSX.Element => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const { addRedeSocial, updateRedeSocial, cpfs } = useDataStore();
  const [documentos, setDocumentos] = useState<string[]>(redeSocialEdit?.documentos || []);

  const cpfVinculo = watch('cpfVinculoPrimario');
  const cpfVinculado = cpfs.find(c => c.cpf === cpfVinculo);

  useEffect(() => {
    if (redeSocialEdit) {
      setValue('redeSocial', redeSocialEdit.redeSocial);
      setValue('link', redeSocialEdit.link);
      setValue('nomeRede', redeSocialEdit.nomeRede);
      setValue('cpfVinculoPrimario', redeSocialEdit.cpfVinculoPrimario);
      setValue('campoTexto', redeSocialEdit.campoTexto);
    } else {
      reset();
      setDocumentos([]);
    }
  }, [redeSocialEdit, setValue, reset]);

  const handleDownloadTemplate = () => {
    // Simula download do template Excel
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'template_redes_sociais.xlsx';
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
    const redeSocial: Omit<RedeSocial, 'id'> = {
      redeSocial: data.redeSocial,
      link: data.link,
      nomeRede: data.nomeRede,
      cpfVinculoPrimario: data.cpfVinculoPrimario,
      nomeVinculoPrimario: cpfVinculado?.nome,
      campoTexto: data.campoTexto || '',
      documentos,
      dataCriacao: redeSocialEdit?.dataCriacao || new Date().toISOString()
    };

    if (redeSocialEdit) {
      updateRedeSocial(redeSocialEdit.id, redeSocial);
      alert('Rede social atualizada com sucesso!');
    } else {
      addRedeSocial(redeSocial);
      alert('Rede social cadastrada com sucesso!');
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
              Rede Social *
            </label>
            <select
              {...register('redeSocial', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione...</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Twitter">Twitter</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="TikTok">TikTok</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Rede (Nome do Perfil) *
            </label>
            <input
              {...register('nomeRede', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="@usuario ou nome do perfil"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link *
            </label>
            <input
              {...register('link', { required: true })}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://www.facebook.com/usuario"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CPF Vínculo Primário
            </label>
            <select
              {...register('cpfVinculoPrimario')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Observações sobre a rede social..."
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
            {redeSocialEdit ? 'Salvar Alterações' : 'Cadastrar Rede Social'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroRedeSocial;