import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../../store/dataStore';
import { Ocorrencia } from '../../../types';
import FileUpload from '../../../components/Common/FileUpload';
import Select from 'react-select';

interface EditarOcorrenciaProps {
  ocorrencia: Ocorrencia;
  onClose: () => void;
}

// Lista de unidades padronizadas
const UNIDADES = [
  "ARARAQUARA",
  "BARRA",
  "BENALCOOL",
  "BONFIM",
  "CAARAPÓ",
  "CONTINENTAL",
  "COSTA PINTO",
  "DESTIVALE",
  "DIAMANTE",
  "DOIS CÓRREGOS (Hibernada)",
  "GASA",
  "IPAUSSÚ",
  "JARDEST (Hibernada)",
  "JATAÍ",
  "JUNQUEIRA",
  "LAGOA DA PRATA",
  "LEME",
  "MARACAÍ",
  "MARACAJU (Hibernada)",
  "MB (Hibernada)",
  "MUNDIAL",
  "PARAGUAÇU",
  "PARAÍSO",
  "PASSA TEMPO",
  "RAFARD",
  "RIO BRILHANTE",
  "SANTA CÂNDIDA",
  "SANTA ELISA",
  "SANTA HELENA (Hibernada)",
  "SÃO FRANCISCO",
  "SERRA",
  "TAMOIO (Hibernada)",
  "TARUMÃ",
  "UNIVALEM",
  "VALE DO ROSÁRIO"
];

const EditarOcorrencia: React.FC<EditarOcorrenciaProps> = ({ ocorrencia, onClose }) => {
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const { updateOcorrencia } = useDataStore();
  const [documentos, setDocumentos] = useState<string[]>(ocorrencia.documentos || []);
  const navigate = useNavigate();

  const latLong = watch('latLong');

  // Preencher o formulário com os dados da ocorrência
  useEffect(() => {
    if (ocorrencia) {
      setValue('nomeOcorrencia', ocorrencia.nomeOcorrencia);
      setValue('tipo', ocorrencia.tipo);
      setValue('tipoComunicacao', ocorrencia.tipoComunicacao);
      setValue('envolvidos', ocorrencia.envolvidos?.join(', '));
      setValue('unidade', ocorrencia.unidade);
      setValue('latitude', ocorrencia.latitude);
      setValue('longitude', ocorrencia.longitude);
      setValue('latLong', `${ocorrencia.latitude}, ${ocorrencia.longitude}`);
      setValue('gravidade', ocorrencia.gravidade);
      setValue('dataInicio',
        ocorrencia.dataInicio
          ? (typeof ocorrencia.dataInicio === 'string'
              ? ocorrencia.dataInicio.split('T')[0]
              : '')
          : ''
      );
      setValue('dataFim',
        ocorrencia.dataFim
          ? (typeof ocorrencia.dataFim === 'string'
              ? ocorrencia.dataFim.split('T')[0]
              : '')
          : ''
      );
      setValue('responsavel', ocorrencia.responsavel);
      setValue('status', ocorrencia.status);
      setValue('observacoes', ocorrencia.observacoes);
      setValue('consideracoesFinais', ocorrencia.consideracoesFinais);
    }
  }, [ocorrencia, setValue]);

  // Separar lat/long automaticamente
  useEffect(() => {
    if (latLong && latLong.includes(',')) {
      const [lat, lng] = latLong.split(',').map((coord: string) => parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        setValue('latitude', lat);
        setValue('longitude', lng);
      }
    }
  }, [latLong, setValue]);

  const onSubmit = (data: any) => {
    function toDateString(val: any) {
      if (!val) return '';
      if (typeof val === 'string') return val;
      if (val instanceof Date) return val.toISOString().split('T')[0];
      return '';
    }
    const ocorrenciaAtualizada: Partial<Ocorrencia> = {
      nomeOcorrencia: data.nomeOcorrencia,
      tipo: data.tipo,
      tipoComunicacao: data.tipoComunicacao,
      envolvidos: data.envolvidos ? data.envolvidos.split(',').map((e: string) => e.trim()) : [],
      unidade: data.unidade,
      latitude: data.latitude,
      longitude: data.longitude,
      gravidade: data.gravidade,
      dataInicio: toDateString(data.dataInicio),
      dataFim: toDateString(data.dataFim),
      responsavel: data.responsavel,
      status: data.status,
      observacoes: data.observacoes || '',
      consideracoesFinais: data.consideracoesFinais || '',
      documentos
    };

    updateOcorrencia(ocorrencia.id, ocorrenciaAtualizada);
    onClose();
    alert('Ocorrência atualizada com sucesso!');
  };

  const unidadeOptions = UNIDADES.map(u => ({ value: u, label: u }));
  const [unidade, setUnidade] = useState<{ value: string; label: string } | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Editar Ocorrência</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Ocorrência *
            </label>
            <input
              {...register('nomeOcorrencia', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o nome da ocorrência"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Ocorrência *
            </label>
            <select
              {...register('tipo', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione...</option>
              <option value="Furto">Furto</option>
              <option value="Roubo">Roubo</option>
              <option value="Homicídio">Homicídio</option>
              <option value="Tráfico">Tráfico de Drogas</option>
              <option value="Fraude">Fraude</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Comunicação *
            </label>
            <select
              {...register('tipoComunicacao', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione...</option>
              <option value="Telefone">Telefone</option>
              <option value="E-mail">E-mail</option>
              <option value="Presencial">Presencial</option>
              <option value="App">App</option>
              <option value="CANAL DE ÉTICA">CANAL DE ÉTICA</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Envolvidos (CPFs separados por vírgula)
            </label>
            <input
              {...register('envolvidos')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="000.000.000-00, 111.111.111-11"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unidade *
            </label>
            <Select
              options={unidadeOptions}
              value={unidadeOptions.find(opt => opt.value === watch('unidade'))}
              onChange={opt => {
                setUnidade(opt as { value: string; label: string } | null);
                setValue('unidade', opt ? opt.value : '');
              }}
              placeholder="Selecione..."
              isClearable
              classNamePrefix="react-select"
              styles={{ menu: base => ({ ...base, zIndex: 9999 }) }}
            />
            <input type="hidden" {...register('unidade', { required: true })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LAT/LONG *
            </label>
            <input
              {...register('latLong', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gravidade *
            </label>
            <select
              {...register('gravidade', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione...</option>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
              <option value="Crítica">Crítica</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Início *
            </label>
            <input
              {...register('dataInicio', { required: true })}
              type="date"
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Fim
            </label>
            <input
              {...register('dataFim')}
              type="date"
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsável *
            </label>
            <input
              {...register('responsavel', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nome do responsável"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              {...register('status', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione...</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Finalizada">Finalizada</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações
          </label>
          <textarea
            {...register('observacoes')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite as observações"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Considerações Finais
          </label>
          <textarea
            {...register('consideracoesFinais')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite as considerações finais"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Documentos
          </label>
          <FileUpload
            documentos={documentos}
            setDocumentos={setDocumentos}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarOcorrencia; 