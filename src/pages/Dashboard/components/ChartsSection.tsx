import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from 'recharts';
import { Ocorrencia } from '../../../types';

interface ChartsSectionProps {
  ocorrencias: Ocorrencia[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const ChartsSection: React.FC<ChartsSectionProps> = ({ ocorrencias }) => {
  // Dados para gráfico por tipo de ocorrência
  const tipoOcorrenciaData = ocorrencias.reduce((acc, ocorrencia) => {
    acc[ocorrencia.tipo] = (acc[ocorrencia.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tipoChartData = Object.entries(tipoOcorrenciaData)
    .map(([tipo, count]) => ({
      name: tipo,
      value: count
    }))
    .sort((a, b) => b.value - a.value);

  // Dados para gráfico por gravidade
  const gravidadeData = ocorrencias.reduce((acc, ocorrencia) => {
    acc[ocorrencia.gravidade] = (acc[ocorrencia.gravidade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const gravidadeChartData = Object.entries(gravidadeData)
    .map(([gravidade, count]) => ({
      name: gravidade,
      value: count
    }))
    .sort((a, b) => b.value - a.value);

  // Dados para gráfico por unidade
  const unidadeData = ocorrencias.reduce((acc, ocorrencia) => {
    acc[ocorrencia.unidade] = (acc[ocorrencia.unidade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const unidadeChartData = Object.entries(unidadeData)
    .map(([unidade, count]) => ({
      name: unidade,
      count
    }))
    .sort((a, b) => b.count - a.count);

  // Dados para gráfico por responsável
  const responsavelData = ocorrencias.reduce((acc, ocorrencia) => {
    acc[ocorrencia.responsavel] = (acc[ocorrencia.responsavel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const responsavelChartData = Object.entries(responsavelData)
    .map(([responsavel, count]) => ({
      name: responsavel,
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Componente personalizado para o label das barras
  const CustomBarLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 10}
        fill="#666"
        textAnchor="middle"
        fontSize={12}
        fontWeight="bold"
      >
        {value}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico por Tipo de Ocorrência */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ocorrências por Tipo</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={tipoChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {tipoChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico por Gravidade */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ocorrências por Gravidade</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={gravidadeChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {gravidadeChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico por Unidade */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ocorrências por Unidade</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={unidadeChartData}>
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]}>
              <LabelList content={<CustomBarLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico por Responsável */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsáveis por Ocorrências</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={responsavelChartData}>
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]}>
              <LabelList content={<CustomBarLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartsSection;