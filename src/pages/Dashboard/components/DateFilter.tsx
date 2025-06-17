import React from 'react';
import { Calendar, Filter } from 'lucide-react';

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApplyFilter,
  onClearFilter,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtrar por período:</span>
        </div>
        
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Data Inicial
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Data Final
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <button
            onClick={onApplyFilter}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mt-6 md:mt-0"
          >
            <Filter className="w-4 h-4" />
            <span>Aplicar Filtro</span>
          </button>
          <button
            type="button"
            onClick={onClearFilter}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors mt-6 md:mt-0"
          >
            <span>Limpar Filtros</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateFilter; 