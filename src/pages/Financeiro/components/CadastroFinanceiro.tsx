import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDataStore } from '../../../store/dataStore';
import { Financeiro } from '../../../types';

interface CadastroFinanceiroProps {
  financeiroEdit?: Omit<Financeiro, 'id' | 'dataCriacao'> & {
    cpfProprietario: string;
    nomeProprietario: string;
    tipoTransacao: string;
    dadosBancarios: string;
    valorTransacao: number;
    deNome: string;
    deCpf: string;
    paraNome: string;
    paraCpf: string;
  };
  onClose?: () => void;
}

const CadastroFinanceiro: React.FC<CadastroFinanceiroProps> = ({ financeiroEdit, onClose }) => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const { addFinanceiro, cpfs } = useDataStore();

  const cpfProprietario = watch('cpfProprietario');
  const deCpf = watch('deCpf');
  const paraCpf = watch('paraCpf');
  const cpfVinculo = watch('cpfVinculoPrimario');

  const proprietario = cpfs.find(c => c.cpf === cpfProprietario);
  const deVinculado = cpfs.find(c => c.cpf === deCpf);
  const paraVinculado = cpfs.find(c => c.cpf === paraCpf);
  const cpfVinculado = cpfs.find(c => c.cpf === cpfVinculo);

  useEffect(() => {
    if (financeiroEdit) {
      setValue('cpfProprietario', financeiroEdit.cpfProprietario);
      setValue('nomeProprietario', financeiroEdit.nomeProprietario);
      setValue('tipoTransacao', financeiroEdit.tipoTransacao);
      setValue('dadosBancarios', financeiroEdit.dadosBancarios);
      setValue('valorTransacao', financeiroEdit.valorTransacao);
      setValue('deNome', financeiroEdit.deNome);
      setValue('deCpf', financeiroEdit.deCpf);
      setValue('paraNome', financeiroEdit.paraNome);
      setValue('paraCpf', financeiroEdit.paraCpf);
      setValue('cpfVinculoPrimario', financeiroEdit.cpfVinculoPrimario);
      setValue('campoTexto', financeiroEdit.campoTexto);
    }
  }, [financeiroEdit, setValue]);

  const onSubmit = (data: any) => {
    const financeiro: Omit<Financeiro, 'id' | 'createdAt'> = {
      cpfProprietario: data.cpfProprietario,
      nomeProprietario: proprietario?.nome || data.nomeProprietario,
      tipoTransacao: data.tipoTransacao,
      dadosBancarios: data.dadosBancarios,
      valorTransacao: parseFloat(data.valorTransacao),
      deNome: data.deNome,
      deCpf: data.deCpf,
      paraNome: data.paraNome,
      paraCpf: data.paraCpf,
      cpfVinculoPrimario: data.cpfVinculoPrimario,
      nomeVinculoPrimario: cpfVinculado?.nome,
      campoTexto: data.campoTexto || ''
    };

    addFinanceiro(financeiro);
    reset();
    alert('Transação financeira cadastrada com sucesso!');
    if (onClose) onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CPF do Proprietário *
            </label>
            <select
              {...register('cpfProprietario', { required: true })}
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
              Nome do Proprietário (auto-preenchido)
            </label>
            <input
              {...register('nomeProprietario')}
              type="text"
              value={proprietario?.nome || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Transação *
            </label>
            <select
              {...register('tipoTransacao', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione...</option>
              <option value="PIX">PIX</option>
              <option value="TED">TED</option>
              <option value="DOC">DOC</option>
              <option value="Transferência">Transferência</option>
              <option value="Depósito">Depósito</option>
              <option value="Saque">Saque</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor da Transação *
            </label>
            <input
              {...register('valorTransacao', { required: true })}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0,00"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dados Bancários
            </label>
            <textarea
              {...register('dadosBancarios')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Banco, agência, conta, etc..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DE (Nome) *
            </label>
            <input
              {...register('deNome', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nome do remetente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DE (CPF)
            </label>
            <select
              {...register('deCpf')}
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
              PARA (Nome) *
            </label>
            <input
              {...register('paraNome', { required: true })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nome do destinatário"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PARA (CPF)
            </label>
            <select
              {...register('paraCpf')}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              readOnly
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroFinanceiro;