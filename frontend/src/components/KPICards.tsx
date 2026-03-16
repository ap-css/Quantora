import { motion } from 'framer-motion';
import type { SimulationResponse } from '../types/simulation';

interface KPICardsProps {
  data: SimulationResponse;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const CARDS: {
  key: keyof SimulationResponse;
  label: string;
  formatter: (value: number) => string;
}[] = [
  {
    key: 'expected_final_value',
    label: 'Expected Final Value',
    formatter: formatCurrency,
  },
  {
    key: 'median_final_value',
    label: 'Median Final Value',
    formatter: formatCurrency,
  },
  {
    key: 'probability_of_reaching_target',
    label: 'Probability of Reaching Target',
    formatter: formatPercent,
  },
  {
    key: 'value_at_risk_95',
    label: 'Value at Risk (95%)',
    formatter: formatCurrency,
  },
  {
    key: 'sharpe_estimate',
    label: 'Sharpe Estimate',
    formatter: (v) => v.toFixed(3),
  },
  {
    key: 'std_deviation',
    label: 'Standard Deviation',
    formatter: formatCurrency,
  },
];

export default function KPICards({ data }: KPICardsProps) {
  if (!data) return null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
    >
      {CARDS.map(({ key, label, formatter }) => (
        <motion.div
          key={key}
          variants={item}
          className="glass-card group relative overflow-hidden p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-accent/30"
        >
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute -inset-12 bg-gradient-to-br from-accent/20 via-transparent to-purple-500/10 blur-3xl" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
            {label}
          </p>
          <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
            {formatter(data[key] ?? 0)}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}

