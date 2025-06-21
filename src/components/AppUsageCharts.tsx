import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChartBarIcon, ChartPieIcon } from '@heroicons/react/24/outline';
import { DashboardCard } from './DashboardCard';

interface AppUsageData {
  name: string;
  time: number;
}

interface AppUsageChartsProps {
  appUsageData: AppUsageData[];
}

export const AppUsageCharts: React.FC<AppUsageChartsProps> = ({ appUsageData }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C43'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <DashboardCard 
        title="App Usage (minutes)" 
        icon={<ChartBarIcon className="h-5 w-5 text-blue-400" />}
        className="h-[400px]"
      >
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={appUsageData.slice(0, 10)} 
              layout="vertical"
              margin={{ top: 5, right: 10, left: 60, bottom: 5 }}
            >
              <XAxis 
                type="number" 
                stroke="#9CA3AF" 
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={80} 
                stroke="#9CA3AF"
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.375rem' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="time" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      {/* Pie Chart */}
      <DashboardCard 
        title="App Usage Distribution" 
        icon={<ChartPieIcon className="h-5 w-5 text-purple-400" />}
        className="h-[400px]"
      >
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={appUsageData.slice(0, 8)}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="time"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {appUsageData.slice(0, 8).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.375rem' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ color: '#9CA3AF' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>
    </div>
  );
}; 