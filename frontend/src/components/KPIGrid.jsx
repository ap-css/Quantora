import { motion } from 'framer-motion';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value) {
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

const CARDS = [
  {
    key: 'expected_final_value',
    label: 'Expected Final Value',
    format: formatCurrency,
  },
  {
    key: 'median_final_value',
    label: 'Median Final Value',
    format: formatCurrency,
  },
  {
    key: 'probability_of_reaching_target',
    label: 'Probability of Reaching Target',
    format: formatPercent,
  },
  {
    key: 'value_at_risk_95',
    label: 'Value at Risk (95%)',
    format: formatCurrency,
  },
  {
    key: 'sharpe_estimate',
    label: 'Sharpe Estimate',
    format: (v) => v.toFixed(3),
  },
];

export default function KPIGrid({ data }) {
  if (!data) return null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    >
      {CARDS.map(({ key, label, format }) => (
        <motion.div
          key={key}
          variants={item}
          className="glass-card p-5 transition-all duration-300 hover:scale-[1.02]"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
            {label}
          </p>
          <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
            {format(data[key])}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
