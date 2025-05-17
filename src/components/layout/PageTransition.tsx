
import { motion } from 'framer-motion';
import React from 'react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
  const { sidebarCollapsed } = useAppStore();

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ 
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={cn(
        `w-full transition-all duration-300`,
        sidebarCollapsed ? 'pl-0 md:pl-2' : 'px-2 md:px-4',
        className
      )}
    >
      {children}
    </motion.div>
  );
};
