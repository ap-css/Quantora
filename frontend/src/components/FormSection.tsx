import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import type { RiskLevel, SimulationRequestPayload } from '../types/simulation';
import Loader from './Loader';

const RISK_OPTIONS: { value: RiskLevel; label: string }[] = [
  { value: 'conservative', label: 'Conservative' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'aggressive', label: 'Aggressive' },
];

const inputClass =
  'w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-[#9CA3AF] focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none transition-all duration-300';

interface FormSectionProps {
  onSubmit: (payload: SimulationRequestPayload) => Promise<void> | void;
  isLoading: boolean;
  errorMessage?: string | null;
}

export default function FormSection({
  onSubmit,
  isLoading,
  errorMessage,
}: FormSectionProps) {
  const [age, setAge] = useState<number>(25);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(20000);
  const [years, setYears] = useState<number>(20);
  const [targetAmount, setTargetAmount] = useState<number>(20000000);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('moderate');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload: SimulationRequestPayload = {
      age,
      monthly_investment: monthlyInvestment,
      risk_level: riskLevel,
      years,
      target_amount: targetAmount,
    };

    await onSubmit(payload);
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      onSubmit={handleSubmit}
      className="glass-card p-6 sm:p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#9CA3AF]">
            Age
          </label>
          <input
            type="number"
            min={0}
            max={120}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#9CA3AF]">
            Monthly Investment (₹)
          </label>
          <input
            type="number"
            min={1}
            step={1000}
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#9CA3AF]">
            Years
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#9CA3AF]">
            Target Amount (₹)
          </label>
          <input
            type="number"
            min={1}
            step={100000}
            value={targetAmount}
            onChange={(e) => setTargetAmount(Number(e.target.value))}
            className={inputClass}
            required
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-3 block text-sm font-medium text-[#9CA3AF]">
          Risk Level
        </label>
        <div className="flex flex-wrap gap-2">
          {RISK_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRiskLevel(opt.value)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                riskLevel === opt.value
                  ? 'bg-accent text-white shadow-lg shadow-accent/25'
                  : 'bg-white/10 text-[#9CA3AF] hover:bg-white/15 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <p className="mt-4 text-sm text-red-400">{errorMessage}</p>
      )}

      <div className="mt-8 flex items-center gap-4">
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={isLoading ? {} : { scale: 1.02 }}
          whileTap={isLoading ? {} : { scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-medium text-white shadow-lg shadow-accent/25 transition-all duration-300 hover:shadow-accent/30 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? <Loader size="sm" /> : 'Run simulation'}
        </motion.button>
      </div>
    </motion.form>
  );
}

