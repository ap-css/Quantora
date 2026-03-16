import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type {
  SimulationRequestPayload,
  SimulationResponse,
} from '../types/simulation';
import { runSimulation } from '../api/simulationApi';
import Layout from '../components/Layout.jsx';
import FormSection from '../components/FormSection';
import KPICards from '../components/KPICards';
import MonteCarloChart from '../components/MonteCarloChart';

export default function Dashboard() {
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const kpiSectionRef = useRef<HTMLDivElement | null>(null);

  async function handleRunSimulation(payload: SimulationRequestPayload) {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await runSimulation(payload);
      setResult(data);

      // Smoothly scroll to KPI section once results are ready
      window.requestAnimationFrame(() => {
        if (kpiSectionRef.current) {
          kpiSectionRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Simulation failed. Please try again.';
      setErrorMessage(message);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        <FormSection
          onSubmit={handleRunSimulation}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />

        {result && (
          <div ref={kpiSectionRef} className="space-y-6">
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <KPICards data={result} />
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              <MonteCarloChart samplePaths={result.sample_paths ?? []} />
            </motion.section>
          </div>
        )}
      </div>
    </Layout>
  );
}

