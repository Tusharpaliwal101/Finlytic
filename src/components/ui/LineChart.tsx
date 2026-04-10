import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
    borderDash?: number[];
    fill?: boolean;
  }[];
}

const LineChart: React.FC<LineChartProps> = ({ labels, datasets }) => {
  const data = {
    labels,
    datasets: datasets.map(ds => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.color,
      backgroundColor: `${ds.color}15`,
      borderDash: ds.borderDash || [],
      fill: ds.fill !== undefined ? ds.fill : true,
      tension: 0.4,
      pointRadius: 0,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          font: { family: 'Sora', size: 12, weight: 600 },
          color: '#94a3b8',
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        titleFont: { family: 'Sora', size: 14 },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { font: { family: 'JetBrains Mono', size: 10 }, color: '#94a3b8' },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'JetBrains Mono', size: 10 }, color: '#94a3b8' },
      },
    },
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
