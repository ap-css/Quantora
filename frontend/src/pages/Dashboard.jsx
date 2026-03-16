import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import SimulationForm from '../components/SimulationForm';
import KPIGrid from '../components/KPIGrid';
import MonteCarloChart from '../components/MonteCarloChart';

export default function Dashboard() {
  const [result, setResult] = useState(null);

  return (
    <Layout>
      <div className="space-y-8">
        <SimulationForm
          onResult={setResult}
          onError={() => setResult(null)}
        />

        {result && (
          <>
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <KPIGrid data={result} />
            </motion.section>

            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <MonteCarloChart samplePaths={result.sample_paths ?? []} />
            </motion.section>
          </>
        )}
      </div>
    </Layout>
  );
}
