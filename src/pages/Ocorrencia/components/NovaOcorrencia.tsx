import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Download } from 'lucide-react';
import { useDataStore } from '../../../store/dataStore';
import { Ocorrencia } from '../../../types';
import FileUpload from '../../../components/Common/FileUpload';
import Select from 'react-select';

const NovaOcorrencia: React.FC = () => {
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const { addOcorrencia, cpfs } = useDataStore();
  const [documentos, setDocumentos] = useState<string[]>([]);

  const latLong = watch('latLong');

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

  const unidadeOptions = UNIDADES.map(u => ({ value: u, label: u }));
  const [unidade, setUnidade] = useState(null);

  const handleDownloadTemplate = () => {
    // Simula download do template Excel
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'template_ocorrencias.xlsx';
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

  const onSubmit = (data: any) => {
    const ocorrencia: Omit<Ocorrencia, 'id' | 'createdAt'> = {
      nomeOcorrencia: data.nomeOcorrencia,
      tipo: data.tipo,
      tipoComunicacao: data.tipoComunicacao,
      envolvidos: data.envolvidos ? data.envolvidos.split(',').map((e: string) => e.trim()) : [],
      unidade: data.unidade,
      latitude: data.latitude,
      longitude: data.longitude,
      gravidade: data.gravidade,
      dataInicio: new Date(data.dataInicio).toISOString(),
      dataFim: data.dataFim ? new Date(data.dataFim).toISOString() : new Date().toISOString(),
      responsavel: data.responsavel,
      status: data.status,
      observacoes: data.observacoes || '',
      consideracoesFinais: data.consideracoesFinais || '',
      documentos,
      dataCriacao: new Date().toISOString()
    };

    addOcorrencia(ocorrencia);
    reset();
    setDocumentos([]);
    alert('Ocorrência cadastrada com sucesso!');
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
              Nome da Ocorrência *
            </label>
            <input
              {...register('nomeOcorrencia', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="Digite o nome da ocorrência"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Ocorrência *
            </label>
            <select
              {...register('tipo', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
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
                setUnidade(opt);
                setValue('unidade', opt ? opt.value : '');
              }}
              placeholder="Selecione..."
              isClearable
              classNamePrefix="react-select"
              menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
              styles={{
                menu: (base) => ({ ...base, zIndex: 9999, minWidth: 350, width: 'max-content', maxWidth: 600 }),
                control: (base) => ({ ...base, minWidth: 250 }),
                option: (base) => ({ ...base, whiteSpace: 'nowrap' })
              }}
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
              Gravidade *
            </label>
            <select
              {...register('gravidade', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsável *
            </label>
            <input
              {...register('responsavel', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="Nome do responsável"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              {...register('status', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            >
              <option value="">Selecione...</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Finalizada">Finalizada</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              {...register('observacoes')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="Observações sobre a ocorrência..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Considerações Finais
            </label>
            <textarea
              {...register('consideracoesFinais')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
              placeholder="Considerações finais..."
            />
          </div>
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
            onClick={() => reset()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
          >
            Cadastrar Ocorrência
          </button>
        </div>
      </form>
    </div>
  );
};

export default NovaOcorrencia;