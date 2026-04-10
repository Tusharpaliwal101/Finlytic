import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  data: number[];
  labels: string[];
  colors?: string[];
  centerLabel: string;
  centerValue: string;
  hideLegend?: boolean;
}

const DonutChart: React.FC<DonutChartProps> = ({ 
  data, labels, colors = ['#3557ff', '#00c9a7', '#ffb34b'], centerLabel, centerValue, hideLegend = false
}) => {
  const chartData = {
    labels,
    datasets: [{
      data,
      backgroundColor: colors,
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };

  const options = {
    cutout: '68%',
    plugins: {
      legend: {
        display: !hideLegend,
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            family: 'Sora',
            size: 12,
            weight: 600,
          },
          color: '#94a3b8',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#0f172a',
        padding: 12,
        titleFont: { family: 'Sora', size: 14 },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="relative w-full h-[200px] group">
      {/* Background Layer: Center Text (Hides on chart hover to prevent tooltip collision) */}
      <div className={`absolute top-1/2 -translate-y-1/2 text-center pointer-events-none z-0 transition-opacity duration-200 group-hover:opacity-0 ${hideLegend ? 'left-1/2 -translate-x-1/2' : 'left-[31.5%] -translate-x-1/2'}`}>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
          {centerLabel}
        </p>
        <p className="text-[14px] sm:text-lg font-bold text-slate-900 dark:text-white font-numbers leading-none">
          {centerValue}
        </p>
      </div>
      
      {/* Foreground Layer: Canvas Graph & Tooltip */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default DonutChart;
