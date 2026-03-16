import { motion } from 'framer-motion';

interface LoaderProps {
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export default function Loader({
  label = 'Running simulation…',
  size = 'md',
  className = '',
}: LoaderProps) {
  const dimension = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <div
      className={`flex items-center gap-2 text-sm font-medium text-white/90 ${className}`}
    >
      <motion.span
        className={`${dimension} inline-flex items-center justify-center rounded-full border-2 border-transparent border-t-white/90`}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 0.9,
          ease: 'linear',
        }}
      />
      <span>{label}</span>
    </div>
  );
}

