"use client";

import { useRef } from "react";
import { motion, useInView, type Variant } from "framer-motion";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  /** CSS class applied to the wrapper div */
  className?: string;
  /** Animation variant. Default: "fadeUp" */
  variant?: "fadeUp" | "fadeIn" | "fadeLeft" | "fadeRight" | "scaleUp";
  /** Delay in seconds. Default: 0 */
  delay?: number;
  /** Duration in seconds. Default: 0.6 */
  duration?: number;
  /** InView margin. Default: "-80px" */
  margin?: string;
  /** Only animate once. Default: true */
  once?: boolean;
}

const variants: Record<string, { hidden: Variant; visible: Variant }> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
};

/**
 * Shared scroll-reveal animation wrapper using Framer Motion.
 *
 * @example
 * <AnimateOnScroll variant="fadeUp" delay={0.2}>
 *   <h2>Hello World</h2>
 * </AnimateOnScroll>
 */
export function AnimateOnScroll({
  children,
  className,
  variant = "fadeUp",
  delay = 0,
  duration = 0.6,
  margin = "-80px",
  once = true,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: margin as any });
  const v = variants[variant] ?? variants.fadeUp;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={v}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
