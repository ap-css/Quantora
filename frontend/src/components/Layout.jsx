import { motion } from 'framer-motion';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#0B1120]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Quantora
          </h1>
          <p className="mt-1 text-sm text-[#9CA3AF]">
            AI Portfolio Risk Intelligence
          </p>
        </motion.header>
        {children}
      </div>
    </div>
  );
}
