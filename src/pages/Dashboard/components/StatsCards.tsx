import React from 'react';
import { FileText, Users } from 'lucide-react';
import { useDataStore } from '../../../store/dataStore';
import { Ocorrencia } from '../../../types';

interface StatsCardsProps {
  ocorrencias: Ocorrencia[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ ocorrencias }) => {
  const { cpfs } = useDataStore();

  const stats = [
    {
      title: 'Total Ocorrências',
      value: ocorrencias.length,
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'CPFs Cadastrados',
      value: cpfs.length,
      icon: Users,
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-full`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;