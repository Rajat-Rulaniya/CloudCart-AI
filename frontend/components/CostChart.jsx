import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function CostChart({ breakdown, title }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!breakdown || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    const data = {
      labels: ['Compute', 'Storage', 'Network', 'Hidden'],
      datasets: [{
        data: [
          breakdown.compute || 0,
          breakdown.storage || 0,
          breakdown.network || 0,
          breakdown.hidden || 0
        ],
        backgroundColor: [
          'rgba(255, 154, 86, 0.8)',
          'rgba(86, 171, 47, 0.8)',
          'rgba(161, 141, 209, 0.8)',
          'rgba(248, 81, 73, 0.8)'
        ],
        borderColor: [
          'rgba(255, 154, 86, 1)',
          'rgba(86, 171, 47, 1)',
          'rgba(161, 141, 209, 1)',
          'rgba(248, 81, 73, 1)'
        ],
        borderWidth: 2
      }]
    };

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#c9d1d9',
              padding: 20,
              font: {
                family: 'Inter',
                size: 13
              }
            }
          },
          tooltip: {
            backgroundColor: '#21262d',
            titleColor: '#ffffff',
            bodyColor: '#c9d1d9',
            borderColor: '#30363d',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function (context) {
                return `$${context.raw.toFixed(2)}/month`;
              }
            }
          }
        },
        cutout: '60%'
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [breakdown]);

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

export function ServiceBarChart({ services }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!services || services.length === 0 || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    const colors = {
      ec2: 'rgba(255, 154, 86, 0.8)',
      s3: 'rgba(86, 171, 47, 0.8)',
      rds: 'rgba(79, 172, 254, 0.8)',
      dataTransfer: 'rgba(161, 141, 209, 0.8)'
    };

    const data = {
      labels: services.map(s => s.name || s.type.toUpperCase()),
      datasets: [{
        label: 'Monthly Cost',
        data: services.map(s => s.monthly || 0),
        backgroundColor: services.map(s => colors[s.type] || 'rgba(88, 166, 255, 0.8)'),
        borderColor: services.map(s => colors[s.type]?.replace('0.8', '1') || 'rgba(88, 166, 255, 1)'),
        borderWidth: 2,
        borderRadius: 6
      }]
    };

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#21262d',
            titleColor: '#ffffff',
            bodyColor: '#c9d1d9',
            borderColor: '#30363d',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function (context) {
                return `$${context.raw.toFixed(2)}/month`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(48, 54, 61, 0.5)'
            },
            ticks: {
              color: '#8b949e',
              callback: function (value) {
                return '$' + value;
              }
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: '#c9d1d9',
              font: {
                family: 'Inter'
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [services]);

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">📊 Per-Service Breakdown</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
