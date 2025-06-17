import React, { useState, useCallback } from 'react';
import StatsCards from './components/StatsCards';
import ChartsSection from './components/ChartsSection';
import CriminalMap from './components/CriminalMap';
import DateFilter from './components/DateFilter';
import { useDataStore } from '../../store/dataStore';

const Dashboard: React.FC = () => {
  const { ocorrencias } = useDataStore();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appliedStartDate, setAppliedStartDate] = useState('');
  const [appliedEndDate, setAppliedEndDate] = useState('');

  const handleApplyFilter = useCallback(() => {
    // Validar as datas antes de aplicar
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      alert('A data inicial não pode ser maior que a data final');
      return;
    }

    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
  }, [startDate, endDate]);

  const handleClearFilter = useCallback(() => {
    setStartDate('');
    setEndDate('');
    setAppliedStartDate('');
    setAppliedEndDate('');
  }, []);

  const filteredOcorrencias = useCallback(() => {
    return ocorrencias.filter(ocorrencia => {
      if (!appliedStartDate && !appliedEndDate) return true;
      
      const dataOcorrencia = new Date(ocorrencia.dataInicio);
      const start = appliedStartDate ? new Date(appliedStartDate) : new Date(0);
      const end = appliedEndDate ? new Date(appliedEndDate) : new Date();
      
      // Ajustar o end para incluir o dia inteiro
      end.setHours(23, 59, 59, 999);
      
      return dataOcorrencia >= start && dataOcorrencia <= end;
    });
  }, [ocorrencias, appliedStartDate, appliedEndDate]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <DateFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onApplyFilter={handleApplyFilter}
        onClearFilter={handleClearFilter}
      />

      <StatsCards ocorrencias={filteredOcorrencias()} />
      <ChartsSection ocorrencias={filteredOcorrencias()} />
      <CriminalMap ocorrencias={filteredOcorrencias()} />
    </div>
  );
};

export default Dashboard;