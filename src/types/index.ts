export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Ocorrencia {
  id: number;
  nomeOcorrencia: string;
  tipo: string;
  tipoComunicacao: string;
  envolvidos: string[];
  unidade: string;
  latitude: number;
  longitude: number;
  gravidade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  responsavel: string;
  status: 'Em Andamento' | 'Concluída' | 'Arquivada';
  dataInicio: string;
  dataFim?: string;
  observacoes?: string;
  consideracoesFinais?: string;
  documentos: string[];
  dataCriacao: string;
}

export interface CPF {
  id: number;
  cpf: string;
  nome: string;
  tipoCpf: string;
  antecedentesCriminais: string;
  tipologiaCriminal: string[];
  cpfVinculoPrimario?: string;
  nomeVinculoPrimario?: string;
  campoTexto: string;
  foto?: string;
  documentos: string[];
  dataCriacao: string;
}

export interface CNPJ {
  id: number;
  cnpj: string;
  nomeEmpresa: string;
  tipologia: string;
  cpfVinculoPrimario?: string;
  nomeVinculoPrimario?: string;
  campoTexto: string;
  latitude: number;
  longitude: number;
  documentos: string[];
  dataCriacao: string;
}

export interface Imovel {
  id: number;
  imovel: string;
  tipo: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cpfVinculoPrimario?: string;
  nomeVinculoPrimario?: string;
  campoTexto: string;
  latitude: number;
  longitude: number;
  documentos: string[];
  dataCriacao: string;
}

export interface Veiculo {
  id: number;
  veiculo: string;
  tipoVinculo: string;
  placa: string;
  marca: string;
  modelo: string;
  cor: string;
  endereco: string;
  cep: string;
  cidade: string;
  estado: string;
  latitude: number;
  longitude: number;
  cpfVinculoPrimario?: string;
  nomeVinculoPrimario?: string;
  campoTexto: string;
  documentos: string[];
  dataCriacao: string;
}

export interface Telefone {
  id: number;
  tipoVinculo: string;
  numero: string;
  operadora: string;
  proprietarioLinha: string;
  cpfProprietario: string;
  cpfVinculoPrimario?: string;
  nomeVinculoPrimario?: string;
  campoTexto: string;
  documentos: string[];
  dataCriacao: string;
}

export interface RedeSocial {
  id: number;
  redeSocial: string;
  link: string;
  nomeRede: string;
  cpfVinculoPrimario?: string;
  nomeVinculoPrimario?: string;
  campoTexto: string;
  documentos: string[];
  dataCriacao: string;
}

export interface Financeiro {
  id: number;
  cpfProprietario: string;
  nomeProprietario: string;
  tipoTransacao: string;
  dadosBancarios: string;
  valorTransacao: number;
  deNome: string;
  deCpf: string;
  paraNome: string;
  paraCpf: string;
  cpfVinculoPrimario?: string;
  nomeVinculoPrimario?: string;
  campoTexto: string;
  documentos: string[];
  dataCriacao: string;
}

export interface Empresarial {
  id: number;
  cpfEnvolvido: string;
  nomeEnvolvido: string;
  vinculoRaizen: string;
  setor: string;
  periodoInicio: string;
  periodoFim: string;
  ativo: string;
  saidaDevidoOcorrencia: string;
  campoTexto: string;
  documentos: string[];
  dataCriacao: string;
}

export interface Connection {
  id: string;
  fromId: string;
  toId: string;
  type: string;
  label: string;
}

export interface CriminalBoardNode {
  id: string;
  name: string;
  cpf: string;
  photo?: string;
  x: number;
  y: number;
  connections: Connection[];
}

export interface Transacao {
  id: number;
  tipo: string;
  valor: number;
  data: string;
  descricao: string;
  cpfVinculoPrimario?: string;
  nomeVinculoPrimario?: string;
  campoTexto: string;
  documentos: string[];
  dataCriacao: string;
}