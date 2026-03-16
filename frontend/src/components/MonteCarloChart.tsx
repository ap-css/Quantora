import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { SimulationResponse } from '../types/simulation';

interface MonteCarloChartProps {
  samplePaths: SimulationResponse['sample_paths'];
}

type ChartPoint = {
  year: number;
  [key: string]: number;
};

const MAX_PATHS = 10;

export default function MonteCarloChart({
  samplePaths = [],
}: MonteCarloChartProps) {
  const chartData: ChartPoint[] = useMemo(() => {
    const paths = samplePaths.slice(0, MAX_PATHS);
    if (paths.length === 0) return [];

    const numPoints = paths[0]?.length ?? 0;
    return Array.from({ length: numPoints }, (_, i) => {
      const point: ChartPoint = { year: i };
      paths.forEach((path, j) => {
        point[`path${j + 1}`] = path[i] ?? 0;
      });
      return point;
    });
  }, [samplePaths]);

  const pathKeys = useMemo(() => {
    const n = Math.min(MAX_PATHS, samplePaths.length);
    return Array.from({ length: n }, (_, i) => `path${i + 1}`);
  }, [samplePaths.length]);

  if (chartData.length === 0) return null;

  const strokeColor = 'rgba(59, 130, 246, 0.7)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-card p-6"
    >
      <h3 className="mb-4 text-lg font-semibold text-white">
        Monte Carlo paths (first {pathKeys.length})
      </h3>
      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => {
                if (v >= 1e7) return `${(v / 1e7).toFixed(1)}Cr`;
                if (v >= 1e5) return `${(v / 1e5).toFixed(1)}L`;
                if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
                return String(v);
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
              }}
              labelStyle={{ color: '#9CA3AF' }}
              formatter={(value: number) => [
                new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(value),
                'Portfolio',
              ]}
              labelFormatter={(label: number) => `Year ${label}`}
            />
            {pathKeys.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={strokeColor}
                strokeWidth={1.4}
                dot={false}
                isAnimationActive
                animationDuration={800}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

