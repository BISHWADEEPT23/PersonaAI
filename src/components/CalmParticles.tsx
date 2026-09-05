import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export const CalmParticles: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  // Deterministic seed generation to prevent hydration mismatches
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: `${(i * 19) % 94 + 3}%`,
      y: `${(i * 23) % 90 + 5}%`,
      size: (i % 3) + 1.5,
      duration: 7 + (i % 6) * 1.5,
      delay: (i % 5) * 0.8,
      opacity: 0.15 + (i % 4) * 0.08,
    }));
  }, []);

  if (shouldReduceMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-teal-100/60"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            boxShadow: '0 0 6px rgba(167, 243, 208, 0.4)',
          }}
          animate={{
            y: ['0px', '-18px', '0px'],
            opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};
