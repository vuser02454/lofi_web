import { motion } from 'framer-motion';

export default function GlassPanel({ children, className = '', animate = true, ...props }) {
  const Component = animate ? motion.div : 'div';
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.95 },
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      }
    : {};

  return (
    <Component className={`glass-solid p-4 ${className}`} {...motionProps} {...props}>
      {children}
    </Component>
  );
}
