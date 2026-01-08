import React from 'react';
import {
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Tag, Calendar, BarChart3 } from 'lucide-react';
import { CHART_COLORS } from '../utils/categories';

const Charts = ({ categoryData, monthlyData, priorityData }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-white/10 rounded-xl p-3 shadow-xl">
          {label && <p className="text-sm text-slate-300 mb-1">{label}</p>}
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Legenda customizada para Evolução Mensal
  const CustomLegend = () => {
    const legendItems = [
      { name: 'Entradas', color: '#06b6d4' },
      { name: 'Saídas', color: '#ec4899' },
      { name: 'Saldo', color: '#8b5cf6' }
    ];

    return (
      <div className="flex items-center justify-center gap-6 mt-4">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-slate-300 font-medium">{item.name}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Gráfico de Pizza - Gastos por Categoria */}
      <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Tag size={24} className="text-cyan-400" />
          Gastos por Categoria
        </h2>
        {categoryData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legenda customizada */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                  <span className="text-xs text-slate-300">{item.name}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-slate-400">
            Nenhuma despesa registrada
          </div>
        )}
      </div>

      {/* Gráfico de Barras - Necessário vs Fútil vs Investimento */}
      <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.45s' }}>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BarChart3 size={24} className="text-purple-400" />
          Distribuição de Gastos
        </h2>
        {priorityData.some(d => d.value > 0) ? (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255, 255, 255, 0.5)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="rgba(255, 255, 255, 0.5)" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Legenda customizada com percentuais */}
            <div className="flex flex-wrap justify-center gap-6 mt-4">
              {priorityData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-300 font-medium">{item.name}</span>
                    <span className="text-xs text-slate-400">{item.percentage.toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-slate-400">
            Nenhuma despesa registrada
          </div>
        )}
      </div>

      {/* Gráfico de Linha - Evolução Mensal */}
      <div className="glass-card p-6 lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Calendar size={24} className="text-purple-400" />
          Evolução Mensal
        </h2>
        {monthlyData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis
                  dataKey="monthLabel"
                  stroke="rgba(255, 255, 255, 0.5)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="rgba(255, 255, 255, 0.5)" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="entradas"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  name="Entradas"
                  dot={{ fill: '#06b6d4', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="saidas"
                  stroke="#ec4899"
                  strokeWidth={3}
                  name="Saídas"
                  dot={{ fill: '#ec4899', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="saldo"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  name="Saldo"
                  dot={{ fill: '#8b5cf6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <CustomLegend />
          </>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-slate-400">
            Nenhuma transação registrada
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;
