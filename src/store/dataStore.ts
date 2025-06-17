import { create } from 'zustand';
import { 
  Ocorrencia, CPF, CNPJ, Imovel, Veiculo, 
  Telefone, RedeSocial, Financeiro, Empresarial,
  CriminalBoardNode, Connection, Transacao
} from '../types';

interface DataState {
  // Data arrays
  ocorrencias: Ocorrencia[];
  cpfs: CPF[];
  cnpjs: CNPJ[];
  imoveis: Imovel[];
  veiculos: Veiculo[];
  telefones: Telefone[];
  redesSociais: RedeSocial[];
  financeiros: Financeiro[];
  empresariais: Empresarial[];
  criminalBoard: CriminalBoardNode[];
  transacoes: Transacao[];
  
  // CRUD operations
  addOcorrencia: (ocorrencia: Omit<Ocorrencia, 'id' | 'createdAt'>) => void;
  updateOcorrencia: (id: number, ocorrencia: Partial<Ocorrencia>) => void;
  deleteOcorrencia: (id: number) => void;
  
  addCPF: (cpf: Omit<CPF, 'id' | 'createdAt'>) => void;
  updateCPF: (id: number, cpf: Partial<CPF>) => void;
  deleteCPF: (id: number) => void;
  
  addCNPJ: (cnpj: Omit<CNPJ, 'id' | 'createdAt'>) => void;
  updateCNPJ: (id: number, cnpj: Partial<CNPJ>) => void;
  deleteCNPJ: (id: number) => void;
  
  addImovel: (imovel: Omit<Imovel, 'id' | 'createdAt'>) => void;
  updateImovel: (id: number, imovel: Partial<Imovel>) => void;
  deleteImovel: (id: number) => void;
  
  addVeiculo: (veiculo: Omit<Veiculo, 'id' | 'createdAt'>) => void;
  updateVeiculo: (id: number, veiculo: Partial<Veiculo>) => void;
  deleteVeiculo: (id: number) => void;
  
  addTelefone: (telefone: Omit<Telefone, 'id' | 'createdAt'>) => void;
  updateTelefone: (id: number, telefone: Partial<Telefone>) => void;
  deleteTelefone: (id: number) => void;
  
  addRedeSocial: (redeSocial: Omit<RedeSocial, 'id' | 'createdAt'>) => void;
  updateRedeSocial: (id: number, redeSocial: Partial<RedeSocial>) => void;
  deleteRedeSocial: (id: number) => void;
  
  addFinanceiro: (financeiro: Omit<Financeiro, 'id' | 'createdAt'>) => void;
  updateFinanceiro: (id: number, financeiro: Partial<Financeiro>) => void;
  deleteFinanceiro: (id: number) => void;
  
  addEmpresarial: (empresarial: Omit<Empresarial, 'id' | 'createdAt'>) => void;
  updateEmpresarial: (id: number, empresarial: Partial<Empresarial>) => void;
  deleteEmpresarial: (id: number) => void;
  
  updateCriminalBoard: (nodes: CriminalBoardNode[]) => void;
  
  addTransacao: (transacao: Omit<Transacao, 'id' | 'createdAt'>) => void;
  deleteTransacao: (id: number) => void;
}

// Função para carregar dados do localStorage
const loadFromLocalStorage = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Função para salvar dados no localStorage
const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const useDataStore = create<DataState>((set, get) => ({
  // Initial data from localStorage
  ocorrencias: loadFromLocalStorage('ocorrencias'),
  cpfs: loadFromLocalStorage('cpfs'),
  cnpjs: loadFromLocalStorage('cnpjs'),
  imoveis: loadFromLocalStorage('imoveis'),
  veiculos: loadFromLocalStorage('veiculos'),
  telefones: loadFromLocalStorage('telefones'),
  redesSociais: loadFromLocalStorage('redesSociais'),
  financeiros: loadFromLocalStorage('financeiros'),
  empresariais: loadFromLocalStorage('empresariais'),
  criminalBoard: loadFromLocalStorage('criminalBoard'),
  transacoes: loadFromLocalStorage('transacoes'),
  
  // Ocorrencia CRUD
  addOcorrencia: (ocorrencia) => set((state) => {
    const newOcorrencias = [...state.ocorrencias, {
      ...ocorrencia,
      id: state.ocorrencias.length > 0 ? Math.max(...state.ocorrencias.map(o => o.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    }];
    saveToLocalStorage('ocorrencias', newOcorrencias);
    return { ocorrencias: newOcorrencias };
  }),
  
  updateOcorrencia: (id, updates) => set((state) => {
    const newOcorrencias = state.ocorrencias.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    saveToLocalStorage('ocorrencias', newOcorrencias);
    return { ocorrencias: newOcorrencias };
  }),
  
  deleteOcorrencia: (id) => set((state) => {
    const newOcorrencias = state.ocorrencias.filter(item => item.id !== id);
    saveToLocalStorage('ocorrencias', newOcorrencias);
    return { ocorrencias: newOcorrencias };
  }),
  
  // CPF CRUD
  addCPF: (cpf) => set((state) => {
    if (state.cpfs.some(item => item.cpf === cpf.cpf)) {
      alert('Já existe um cadastro com este CPF!');
      return {};
    }
    const newCpfs = [...state.cpfs, {
      ...cpf,
      id: state.cpfs.length > 0 ? Math.max(...state.cpfs.map(c => c.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    }];
    saveToLocalStorage('cpfs', newCpfs);
    return { cpfs: newCpfs };
  }),
  
  updateCPF: (id, updates) => set((state) => {
    const newCpfs = state.cpfs.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    saveToLocalStorage('cpfs', newCpfs);
    return { cpfs: newCpfs };
  }),
  
  deleteCPF: (id) => set((state) => {
    const newCpfs = state.cpfs.filter(item => item.id !== id);
    saveToLocalStorage('cpfs', newCpfs);
    return { cpfs: newCpfs };
  }),
  
  // CNPJ CRUD
  addCNPJ: (cnpj) => set((state) => {
    if (state.cnpjs.some(item => item.cnpj === cnpj.cnpj)) {
      alert('Já existe um cadastro com este CNPJ!');
      return {};
    }
    const newCnpjs = [...state.cnpjs, {
      ...cnpj,
      id: state.cnpjs.length > 0 ? Math.max(...state.cnpjs.map(c => c.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    }];
    saveToLocalStorage('cnpjs', newCnpjs);
    return { cnpjs: newCnpjs };
  }),
  
  updateCNPJ: (id, updates) => set((state) => {
    const newCnpjs = state.cnpjs.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    saveToLocalStorage('cnpjs', newCnpjs);
    return { cnpjs: newCnpjs };
  }),
  
  deleteCNPJ: (id) => set((state) => {
    const newCnpjs = state.cnpjs.filter(item => item.id !== id);
    saveToLocalStorage('cnpjs', newCnpjs);
    return { cnpjs: newCnpjs };
  }),
  
  // Imovel CRUD
  addImovel: (imovel) => set((state) => {
    const newImoveis = [...state.imoveis, {
      ...imovel,
      id: state.imoveis.length > 0 ? Math.max(...state.imoveis.map(i => i.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    }];
    saveToLocalStorage('imoveis', newImoveis);
    return { imoveis: newImoveis };
  }),
  
  updateImovel: (id, updates) => set((state) => {
    const newImoveis = state.imoveis.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    saveToLocalStorage('imoveis', newImoveis);
    return { imoveis: newImoveis };
  }),
  
  deleteImovel: (id) => set((state) => {
    const newImoveis = state.imoveis.filter(item => item.id !== id);
    saveToLocalStorage('imoveis', newImoveis);
    return { imoveis: newImoveis };
  }),
  
  // Veiculo CRUD
  addVeiculo: (veiculo) => set((state) => {
    if (state.veiculos.some(item => item.placa === veiculo.placa)) {
      alert('Já existe um cadastro com esta placa!');
      return {};
    }
    const newVeiculos = [...state.veiculos, {
      ...veiculo,
      id: state.veiculos.length > 0 ? Math.max(...state.veiculos.map(v => v.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    }];
    saveToLocalStorage('veiculos', newVeiculos);
    return { veiculos: newVeiculos };
  }),
  
  updateVeiculo: (id, updates) => set((state) => {
    const newVeiculos = state.veiculos.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    saveToLocalStorage('veiculos', newVeiculos);
    return { veiculos: newVeiculos };
  }),
  
  deleteVeiculo: (id) => set((state) => {
    const newVeiculos = state.veiculos.filter(item => item.id !== id);
    saveToLocalStorage('veiculos', newVeiculos);
    return { veiculos: newVeiculos };
  }),
  
  // Telefone CRUD
  addTelefone: (telefone) => set((state) => {
    if (state.telefones.some(item => item.numero === telefone.numero)) {
      alert('Já existe um cadastro com este número de telefone!');
      return {};
    }
    const newTelefones = [...state.telefones, {
      ...telefone,
      id: state.telefones.length > 0 ? Math.max(...state.telefones.map(t => t.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    }];
    saveToLocalStorage('telefones', newTelefones);
    return { telefones: newTelefones };
  }),
  
  updateTelefone: (id, updates) => set((state) => {
    const newTelefones = state.telefones.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    saveToLocalStorage('telefones', newTelefones);
    return { telefones: newTelefones };
  }),
  
  deleteTelefone: (id) => set((state) => {
    const newTelefones = state.telefones.filter(item => item.id !== id);
    saveToLocalStorage('telefones', newTelefones);
    return { telefones: newTelefones };
  }),
  
  // RedeSocial CRUD
  addRedeSocial: (redeSocial) => set((state) => {
    const newRedesSociais = [...state.redesSociais, {
      ...redeSocial,
      id: state.redesSociais.length > 0 ? Math.max(...state.redesSociais.map(r => r.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    }];
    saveToLocalStorage('redesSociais', newRedesSociais);
    return { redesSociais: newRedesSociais };
  }),
  
  updateRedeSocial: (id, updates) => set((state) => {
    const newRedesSociais = state.redesSociais.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    saveToLocalStorage('redesSociais', newRedesSociais);
    return { redesSociais: newRedesSociais };
  }),
  
  deleteRedeSocial: (id) => set((state) => {
    const newRedesSociais = state.redesSociais.filter(item => item.id !== id);
    saveToLocalStorage('redesSociais', newRedesSociais);
    return { redesSociais: newRedesSociais };
  }),
  
  // Financeiro CRUD
  addFinanceiro: (financeiro) => set((state) => {
    const newFinanceiros = [...state.financeiros, {
      ...financeiro,
      id: state.financeiros.length > 0 ? Math.max(...state.financeiros.map(f => f.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    }];
    saveToLocalStorage('financeiros', newFinanceiros);
    return { financeiros: newFinanceiros };
  }),
  
  updateFinanceiro: (id, updates) => set((state) => {
    const newFinanceiros = state.financeiros.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    saveToLocalStorage('financeiros', newFinanceiros);
    return { financeiros: newFinanceiros };
  }),
  
  deleteFinanceiro: (id) => set((state) => {
    const newFinanceiros = state.financeiros.filter(item => item.id !== id);
    saveToLocalStorage('financeiros', newFinanceiros);
    return { financeiros: newFinanceiros };
  }),
  
  // Empresarial CRUD
  addEmpresarial: (empresarial) => set((state) => {
    const newEmpresariais = [...state.empresariais, {
      ...empresarial,
      id: state.empresariais.length > 0 ? Math.max(...state.empresariais.map(e => e.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    }];
    saveToLocalStorage('empresariais', newEmpresariais);
    return { empresariais: newEmpresariais };
  }),
  
  updateEmpresarial: (id, updates) => set((state) => {
    const newEmpresariais = state.empresariais.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    saveToLocalStorage('empresariais', newEmpresariais);
    return { empresariais: newEmpresariais };
  }),
  
  deleteEmpresarial: (id) => set((state) => {
    const newEmpresariais = state.empresariais.filter(item => item.id !== id);
    saveToLocalStorage('empresariais', newEmpresariais);
    return { empresariais: newEmpresariais };
  }),
  
  // Criminal Board
  updateCriminalBoard: (nodes) => set((state) => {
    saveToLocalStorage('criminalBoard', nodes);
    return { criminalBoard: nodes };
  }),
  
  // Transacao CRUD
  addTransacao: (transacao) => set((state) => {
    const newTransacoes = [...state.transacoes, {
      ...transacao,
      id: state.transacoes.length > 0 ? Math.max(...state.transacoes.map(t => t.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    }];
    saveToLocalStorage('transacoes', newTransacoes);
    return { transacoes: newTransacoes };
  }),
  
  deleteTransacao: (id) => set((state) => {
    const newTransacoes = state.transacoes.filter(item => item.id !== id);
    saveToLocalStorage('transacoes', newTransacoes);
    return { transacoes: newTransacoes };
  })
}));